// lib/upload/mhgpt-upload-client.ts
// ============================================================================
// MHGPT Encrypted File Upload Client — 3-phase flow
//
// Phase 1: DEK dual-wrap → POST init-upload → presigned PUT URL + object_id
//          + server-authoritative tenant_id (echo from session)
// Phase 2: AES-256-GCM encrypt with server-bound AAD → PUT ciphertext
// Phase 3: PATCH uploaded → POST finalize (nonce + aad)
//
// SPEC-002 §3.8, SPEC-003 §4
// SF-7: filename is NEVER sent to the server.
//
// Security note on tenant_id:
//   The server derives tenant_id from the session cookie and echoes it in the
//   init-upload response. The client uses ONLY this server-returned value for
//   AAD binding — never a hardcoded constant. This ensures the AAD matches the
//   authoritative tenant even if session/routing changes.
// ============================================================================

import { generateDEK } from "@/lib/crypto/aesgcm";
import { wrapDEK, wrapDEKForWorker } from "@/lib/crypto/dek";
import { encryptContent } from "@/lib/crypto/content-encryption";
import { loadKey, saveKey } from "@/lib/crypto/key-store";
import { endpoints } from "@/lib/endpoints";
import { SK_KEY } from "@/lib/crypto/types";

// ── Types ──────────────────────────────────────────────────────────────────

export interface UploadOpts {
  /** MIME type of the plaintext content, e.g. "text/plain" */
  mimeType: string;
  /** Backend object type — derived from mimeType if omitted */
  objectType?: "text" | "file";
  /** Optional AbortSignal for cancel/timeout support */
  signal?: AbortSignal;
}

export interface UploadResult {
  objectId: string;
  status: "ready" | "processing" | "failed";
}

// ── Helpers ────────────────────────────────────────────────────────────────

/**
 * Standard base64 encoding.
 * Uses chunked approach to avoid stack overflow on large inputs.
 */
function toBase64(bytes: Uint8Array): string {
  const CHUNK = 8192;
  let bin = "";
  for (let i = 0; i < bytes.length; i += CHUNK) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK)));
  }
  return btoa(bin);
}

/** UUID v4 using WebCrypto — throws clearly if unavailable. */
function randomUUID(): string {
  if (typeof crypto === "undefined") {
    throw new Error("WebCrypto is not available in this environment");
  }
  if (typeof (crypto as any).randomUUID === "function") {
    return (crypto as any).randomUUID() as string;
  }
  // Fallback: manual UUID v4
  const u = crypto.getRandomValues(new Uint8Array(16));
  u[6] = (u[6] & 0x0f) | 0x40;
  u[8] = (u[8] & 0x3f) | 0x80;
  const h = Array.from(u).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/**
 * Get the device SK from IndexedDB.
 * If none exists, generates and persists a new AES-KW key.
 * (Proper pairing flow adds MK protection on top — this is simplified setup.)
 */
async function getOrCreateSK(): Promise<CryptoKey> {
  const existing = await loadKey(SK_KEY);
  if (existing) return existing;

  const sk = await window.crypto.subtle.generateKey(
    { name: "AES-KW", length: 256 },
    false, // non-extractable
    ["wrapKey", "unwrapKey"],
  );
  await saveKey(SK_KEY, sk);
  return sk;
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Encrypt `plaintext` and upload it via the 3-phase MHGPT media API.
 *
 * SF-7: filename is NOT passed in and never sent to the server.
 *
 * @throws Error with descriptive message on any phase failure
 */
export async function uploadEncrypted(
  plaintext: ArrayBuffer,
  opts: UploadOpts,
): Promise<UploadResult> {
  const mimeType = opts.mimeType || "text/plain";
  const objectType = opts.objectType ?? (mimeType === "text/plain" ? "text" : "file");
  const signal = opts.signal;

  // ── Phase 1: key setup + init-upload ─────────────────────────────────────

  const dek = generateDEK(); // 32 random bytes (Uint8Array)

  // Worker-side DEK wrap via Vault Transit
  const workerWrap = await wrapDEKForWorker(dek);

  // Client-side DEK wrap with device SK (AES-KW → 40 bytes)
  const sk = await getOrCreateSK();
  const clientWrapped = await wrapDEK(dek, sk);

  // AES-256-GCM appends exactly 16-byte authentication tag
  const ciphertextSize = plaintext.byteLength + 16;

  const initRes = await fetch(`${endpoints.api}/v1/objects/init-upload`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    signal,
    body: JSON.stringify({
      // tenant_id is intentionally omitted — server derives it from session.
      // The server echoes it back in the response for client AAD binding.
      conversation_id: randomUUID(),
      object_type: objectType,
      mime_type: mimeType,
      content_size_bytes: ciphertextSize,
      dek_alg: "AES-256-GCM",
      wrap_alg_client: "AES-KW",
      wrap_alg_worker: "vault-transit",
      kek_key_name: workerWrap.kek_key_name,
      kek_key_version: workerWrap.kek_key_version,
      cdek_wrapped_client_ct: toBase64(clientWrapped),
      cdek_wrapped_worker_ct: workerWrap.cdek_wrapped_worker_ct,
    }),
  });

  if (!initRes.ok) {
    const msg = await initRes.text().catch(() => String(initRes.status));
    throw new Error(`Upload init failed (${initRes.status}): ${msg}`);
  }

  const initData = await initRes.json();
  const { object_id, presigned_put_url } = initData;

  // Use server-echoed tenant_id for AAD — never a client-side constant.
  // Falls back to "global" only if backend does not yet echo it (backward compat).
  const tenantId: string = initData.tenant_id ?? "global";

  // ── Phase 2: encrypt + PUT ciphertext to presigned URL ───────────────────

  const encrypted = await encryptContent(plaintext, dek, {
    tenantId,          // server-authoritative
    objectId: object_id,
    mimeType,
    contentSizeBytes: ciphertextSize,
  });

  // Zero DEK bytes immediately after use (defense-in-depth)
  dek.fill(0);

  const putRes = await fetch(presigned_put_url, {
    method: "PUT",
    headers: { "Content-Type": mimeType },
    signal,
    body: encrypted.ciphertext.buffer.slice(
      encrypted.ciphertext.byteOffset,
      encrypted.ciphertext.byteOffset + encrypted.ciphertext.byteLength,
    ) as ArrayBuffer,
  });

  if (!putRes.ok) {
    throw new Error(`Ciphertext PUT to storage failed (${putRes.status})`);
  }

  // ── Phase 3: mark uploaded → finalize ────────────────────────────────────

  const patchRes = await fetch(
    `${endpoints.api}/v1/objects/${object_id}/uploaded`,
    { method: "PATCH", credentials: "include", signal },
  );

  // 409 = already in uploaded state → idempotent, continue
  if (!patchRes.ok && patchRes.status !== 409) {
    throw new Error(`PATCH uploaded failed (${patchRes.status})`);
  }

  const finalRes = await fetch(
    `${endpoints.api}/v1/objects/${object_id}/finalize`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      signal,
      body: JSON.stringify({
        content_nonce: toBase64(encrypted.nonce),
        content_aad: toBase64(encrypted.aad),
      }),
    },
  );

  if (!finalRes.ok) {
    const msg = await finalRes.text().catch(() => String(finalRes.status));
    throw new Error(`Finalize failed (${finalRes.status}): ${msg}`);
  }

  const finalData = await finalRes.json();
  return { objectId: object_id, status: finalData.status };
}

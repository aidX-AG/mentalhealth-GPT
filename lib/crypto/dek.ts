// lib/crypto/dek.ts
// ============================================================================
// DEK (Data Encryption Key) Management
// Version: v1.0 – 2026-02-14
//
// DEK = per-object random 32 bytes, dual-wrapped:
// - Client wrap: SK (AES-KW) → cdek_wrapped_client_ct
// - Worker wrap: Vault Transit → cdek_wrapped_worker_ct
//
// SPEC-002 §3.3: DEK wrap/unwrap via AES-KW
// SPEC-002 §3.8: Dual-wrap in upload flow
// ============================================================================

import { CryptoError, toBase64Url } from "./aesgcm";
import { DEK_BYTES } from "./types";
import type { WorkerWrapResult } from "./types";
import { endpoints, apiPaths } from "../endpoints";

// Re-export generateDEK from aesgcm.ts (canonical source)
export { generateDEK } from "./aesgcm";

/** Ensure WebCrypto is available. */
function assertWebCrypto(): void {
  if (
    typeof window === "undefined" ||
    !window.crypto ||
    !window.crypto.subtle
  ) {
    throw new CryptoError("Web Crypto API is not available in this environment");
  }
}

/**
 * Wrap DEK with SK (client-side wrap) → cdek_wrapped_client_ct.
 *
 * Same AES-KW pattern as MK wrapping:
 * 1. Import DEK as temporary CryptoKey (extractable=true)
 * 2. wrapKey("raw", tempDekKey, sk, "AES-KW")
 *
 * @param dek  32-byte raw DEK
 * @param sk   Device SK (AES-KW, non-extractable)
 * @returns    Wrapped DEK bytes (40 bytes)
 */
export async function wrapDEK(
  dek: Uint8Array,
  sk: CryptoKey,
): Promise<Uint8Array> {
  assertWebCrypto();

  if (dek.length !== DEK_BYTES) {
    throw new CryptoError(`DEK must be exactly ${DEK_BYTES} bytes`);
  }

  const tempDekKey = await window.crypto.subtle.importKey(
    "raw",
    dek.buffer.slice(dek.byteOffset, dek.byteOffset + dek.byteLength) as ArrayBuffer,
    { name: "AES-GCM", length: 256 },
    true, // extractable=true required for wrapKey
    ["encrypt", "decrypt"],
  );

  const wrapped = await window.crypto.subtle.wrapKey(
    "raw",
    tempDekKey,
    sk,
    { name: "AES-KW" },
  );

  return new Uint8Array(wrapped);
}

/**
 * Unwrap DEK from client wrap → raw bytes for decryption.
 *
 * IMPORTANT: Caller MUST zero the returned bytes after use: dekBytes.fill(0)
 *
 * @param wrappedDEK  Wrapped DEK from server (40 bytes)
 * @param sk          Device SK (AES-KW, non-extractable)
 * @returns           Raw DEK bytes (32 bytes) — MUST be zeroed after use
 */
export async function unwrapDEK(
  wrappedDEK: Uint8Array,
  sk: CryptoKey,
): Promise<Uint8Array> {
  assertWebCrypto();

  try {
    // Unwrap with extractable=true so we can export raw bytes
    const tempDekKey = await window.crypto.subtle.unwrapKey(
      "raw",
      wrappedDEK.buffer.slice(
        wrappedDEK.byteOffset,
        wrappedDEK.byteOffset + wrappedDEK.byteLength,
      ) as ArrayBuffer,
      sk,
      { name: "AES-KW" },
      { name: "AES-GCM", length: 256 },
      true, // extractable=true for export
      ["encrypt", "decrypt"],
    );

    const dekRaw = await window.crypto.subtle.exportKey("raw", tempDekKey);
    return new Uint8Array(dekRaw);
  } catch (err) {
    throw new CryptoError(
      "Failed to unwrap DEK (tampered or wrong SK?)",
      err,
    );
  }
}

/**
 * Request worker-side DEK wrap from the API (Vault Transit).
 *
 * POST /v1/crypto/wrap-dek-for-worker { dek_b64 }
 * Returns: { cdek_wrapped_worker_ct, kek_key_name, kek_key_version }
 *
 * @param dek  Raw DEK bytes (will be base64url-encoded for transport)
 * @returns    Worker wrap result from Vault Transit
 */
export async function wrapDEKForWorker(
  dek: Uint8Array,
): Promise<WorkerWrapResult> {
  const dekB64 = toBase64Url(dek);

  const res = await fetch(
    `${endpoints.api}${apiPaths.crypto.wrapDek}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ dek_b64: dekB64 }),
    },
  );

  if (!res.ok) {
    throw new CryptoError(
      `Worker DEK wrap failed: ${res.status}`,
    );
  }

  const data = await res.json();
  return {
    cdek_wrapped_worker_ct: data.cdek_wrapped_worker_ct,
    kek_key_name: data.kek_key_name,
    kek_key_version: data.kek_key_version,
  };
}

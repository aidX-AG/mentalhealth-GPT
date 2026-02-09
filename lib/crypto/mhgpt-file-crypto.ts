/**
 * ============================================================================
 * mhgpt-file-crypto.ts — Browser File Encryption (Chunked) w/ WebCrypto
 * Version: v1.0 — 2026-02-09
 *
 * Goals:
 * - Generate per-file DEK (AES-256)
 * - Encrypt file chunk-by-chunk (File.slice)
 * - Use AES-GCM with per-chunk random nonce (12 bytes)
 * - Bind AAD (associated authenticated data) per chunk for context-integrity
 *
 * Notes:
 * - WebCrypto is not streaming; "streaming/chunked" is achieved via slicing.
 * - Ciphertext returned by WebCrypto includes GCM tag appended.
 * - This module does NOT upload. It produces {manifest, chunks[]} for Phase 2.1.
 * ============================================================================
 */

export type MhgptAlg = "AES-256-GCM";

export type MhgptChunkRecord = {
  i: number;             // chunk index
  offset: number;        // byte offset in original file
  len: number;           // plaintext length
  nonceB64: string;      // 12-byte nonce
  ctB64: string;         // ciphertext+tag
  aadB64: string;        // AAD used (debuggable, optional but useful)
};

export type MhgptEncryptedManifest = {
  v: 1;
  alg: MhgptAlg;
  createdAt: string;     // ISO
  fileId: string;        // random id
  originalName: string;
  mime: string;
  size: number;
  chunkSize: number;
  chunks: {
    count: number;
    records: MhgptChunkRecord[];
  };
  // IMPORTANT: how DEK is handled is outside this module.
  // For Phase 2.1 we will wrap/store DEK server-side (Vault) or via MK device scheme.
};

const te = new TextEncoder();
const td = new TextDecoder();

/* ----------------------------- Helpers ---------------------------------- */

function toB64(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function fromB64(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function concatBytes(a: Uint8Array, b: Uint8Array): Uint8Array {
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0);
  out.set(b, a.length);
  return out;
}

/**
 * Deterministic, stable JSON for AAD (sorted keys).
 * (We avoid "JSON.stringify" randomness due to key insertion differences.)
 */
function canonicalJson(obj: Record<string, unknown>): string {
  const keys = Object.keys(obj).sort();
  const parts: string[] = [];
  for (const k of keys) {
    const v = obj[k];
    parts.push(`"${k}":${canonicalValue(v)}`);
  }
  return `{${parts.join(",")}}`;
}

function canonicalValue(v: unknown): string {
  if (v === null) return "null";
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (typeof v === "string") return JSON.stringify(v);
  if (Array.isArray(v)) return `[${v.map(canonicalValue).join(",")}]`;
  if (typeof v === "object") return canonicalJson(v as Record<string, unknown>);
  return JSON.stringify(String(v));
}

/**
 * fileId: 16 random bytes -> hex
 */
function randomFileId(): string {
  const b = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(b).map(x => x.toString(16).padStart(2, "0")).join("");
}

async function readSlice(file: File, start: number, end: number): Promise<Uint8Array> {
  const ab = await file.slice(start, end).arrayBuffer();
  return new Uint8Array(ab);
}

/* ----------------------------- Keying ----------------------------------- */

/**
 * Generate per-file DEK (AES-256). Keep extractable=true for now because Phase 2.1
 * will wrap/store it; later we can change to extractable=false depending on MK design.
 */
export async function generateFileDEK(): Promise<CryptoKey> {
  return crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

/* --------------------------- Encryption --------------------------------- */

export async function encryptFileChunked(
  file: File,
  dek: CryptoKey,
  opts?: { chunkSize?: number; fileId?: string }
): Promise<{ manifest: MhgptEncryptedManifest }> {
  const chunkSize = opts?.chunkSize ?? (4 * 1024 * 1024); // 4 MiB default
  const fileId = opts?.fileId ?? randomFileId();

  const totalSize = file.size;
  const count = Math.ceil(totalSize / chunkSize);

  const records: MhgptChunkRecord[] = [];

  for (let i = 0; i < count; i++) {
    const offset = i * chunkSize;
    const end = Math.min(offset + chunkSize, totalSize);
    const pt = await readSlice(file, offset, end);

    // 12-byte nonce (GCM recommended length)
    const nonce = crypto.getRandomValues(new Uint8Array(12));

    // AAD binds context: fileId, chunk index, sizes, mime, originalName.
    const aadObj = {
      v: 1,
      ctx: "mhgpt-file-chunk",
      fileId,
      i,
      offset,
      len: pt.length,
      size: totalSize,
      count,
      chunkSize,
      mime: file.type || "application/octet-stream",
      name: file.name,
    };
    const aad = te.encode(canonicalJson(aadObj));

    const ctBuf = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce, additionalData: aad, tagLength: 128 },
      dek,
      pt
    );
    const ct = new Uint8Array(ctBuf);

    records.push({
      i,
      offset,
      len: pt.length,
      nonceB64: toB64(nonce),
      ctB64: toB64(ct),
      aadB64: toB64(aad),
    });
  }

  const manifest: MhgptEncryptedManifest = {
    v: 1,
    alg: "AES-256-GCM",
    createdAt: new Date().toISOString(),
    fileId,
    originalName: file.name,
    mime: file.type || "application/octet-stream",
    size: totalSize,
    chunkSize,
    chunks: { count, records },
  };

  return { manifest };
}

/* --------------------------- Decryption --------------------------------- */

export async function decryptToBlob(
  manifest: MhgptEncryptedManifest,
  dek: CryptoKey
): Promise<Blob> {
  if (manifest.v !== 1) throw new Error("Unsupported manifest version");
  if (manifest.alg !== "AES-256-GCM") throw new Error("Unsupported algorithm");

  // Basic consistency checks
  const { count, records } = manifest.chunks;
  if (records.length !== count) throw new Error("Chunk count mismatch");

  // Decrypt in order
  const parts: Uint8Array[] = [];
  for (let i = 0; i < count; i++) {
    const r = records[i];
    if (r.i !== i) throw new Error(`Chunk index mismatch at ${i}`);

    const nonce = fromB64(r.nonceB64);
    const aad = fromB64(r.aadB64);
    const ct = fromB64(r.ctB64);

    const ptBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: nonce, additionalData: aad, tagLength: 128 },
      dek,
      ct
    );
    parts.push(new Uint8Array(ptBuf));
  }

  // Concatenate
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let pos = 0;
  for (const p of parts) {
    out.set(p, pos);
    pos += p.length;
  }

  return new Blob([out], { type: manifest.mime });
}

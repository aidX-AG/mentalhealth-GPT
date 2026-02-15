// lib/crypto/aesgcm.ts
// ============================================================================
// Client-side AES-256-GCM encryption helpers
// Version: v1.2 – 2026-01-13
//
// Purpose:
// - Pure cryptographic primitives for client-side encryption
// - Used by all encrypted content types (text, images, audio, video)
// - No API calls, no app logic, no storage
//
// IMPORTANT:
// - Browser-only (Web Crypto API)
// - Ciphertext is binary; small metadata is base64url-encoded
//
// Notes on TypeScript:
// - Some TS DOM lib versions are strict about BufferSource generics and may
//   infer Uint8Array<ArrayBufferLike>. We normalize all inputs to ArrayBuffer
//   to ensure compatibility across TS/DOM versions and runtimes.
// ============================================================================

export class CryptoError extends Error {
  public cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "CryptoError";
    this.cause = cause;
  }
}

/** Ensure we are running in a browser environment with WebCrypto. */
function assertWebCrypto(): void {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    throw new CryptoError("Web Crypto API is not available in this environment");
  }
}

/** UTF-8 encode a string. */
function fromString(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

/**
 * Normalize any Uint8Array-like to a real ArrayBuffer (not SharedArrayBuffer).
 * This avoids strict TS DOM typing conflicts (ArrayBufferLike vs ArrayBuffer).
 */
function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  // Copy into a fresh ArrayBuffer (guaranteed ArrayBuffer, not SharedArrayBuffer)
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer;
}

/**
 * Base64URL (RFC 4648 §5) encoding: URL-safe, no padding.
 * Safe for JSON transport, URLs, and headers.
 */
export function toBase64Url(u8: Uint8Array): string {
  // Avoid spread on TypedArrays to prevent downlevelIteration / TS target issues.
  let binary = "";
  const chunkSize = 0x8000; // 32KB

  for (let i = 0; i < u8.length; i += chunkSize) {
    const chunk = u8.subarray(i, i + chunkSize);
    for (let j = 0; j < chunk.length; j++) {
      binary += String.fromCharCode(chunk[j]);
    }
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function fromBase64Url(b64url: string): Uint8Array {
  try {
    let b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    if (pad) b64 += "=".repeat(4 - pad);

    const binary = atob(b64);
    const out = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
    return out;
  } catch (err) {
    throw new CryptoError("Invalid base64url input", err);
  }
}

// ---------------------------------------------------------------------------
// Key generation
// ---------------------------------------------------------------------------

/**
 * Generate a new Data Encryption Key (DEK)
 * - 32 random bytes
 * - Used for exactly one object
 */
export function generateDEK(): Uint8Array {
  assertWebCrypto();

  const dek = new Uint8Array(32); // 256-bit
  window.crypto.getRandomValues(dek);
  return dek;
}

// ---------------------------------------------------------------------------
// Encryption
// ---------------------------------------------------------------------------

export type EncryptedPayload = {
  ciphertext: Uint8Array;
  iv_b64u: string;
  aad_b64u: string;
  alg: "AES-256-GCM";
};

/**
 * Encrypt data using AES-256-GCM
 *
 * @param plaintext   Raw data to encrypt
 * @param dek         32-byte Data Encryption Key
 * @param aadText     Context-bound additional authenticated data (REQUIRED)
 *
 * AAD should bind ciphertext to its intended context to prevent swapping/replay.
 * Recommended format (example):
 *   tenant|user|object_type|object_key|version
 */
export async function encryptAesGcm(
  plaintext: ArrayBuffer,
  dek: Uint8Array,
  aadText: string
): Promise<EncryptedPayload> {
  assertWebCrypto();

  if (dek.length !== 32) {
    throw new CryptoError("DEK must be exactly 32 bytes (AES-256)");
  }
  if (!aadText || aadText.length === 0) {
    throw new CryptoError("AAD text is required for context binding");
  }

  // Light validation (non-blocking)
  const aadParts = aadText.split("|");
  if (aadParts.length < 3) {
    // eslint-disable-next-line no-console
    console.warn("AAD should contain at least: tenant|user|object_type");
  }

  // Normalize inputs for WebCrypto + strict TS DOM typings
  const dekAb: ArrayBuffer = toArrayBuffer(dek);
  const aadBytes = fromString(aadText);
  const aadAb: ArrayBuffer = toArrayBuffer(aadBytes);

  const key = await window.crypto.subtle.importKey(
    "raw",
    dekAb,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  // IV: 12 bytes (recommended for GCM)
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);

  try {
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
        additionalData: aadAb,
        tagLength: 128,
      },
      key,
      plaintext
    );

    return {
      ciphertext: new Uint8Array(encrypted),
      iv_b64u: toBase64Url(iv),
      aad_b64u: toBase64Url(aadBytes),
      alg: "AES-256-GCM",
    };
  } catch (err) {
    throw new CryptoError("AES-GCM encryption failed", err);
  }
}

// ---------------------------------------------------------------------------
// Decryption
// ---------------------------------------------------------------------------

/**
 * Decrypt data using AES-256-GCM
 *
 * @param ciphertext  Encrypted data (ciphertext + 128-bit GCM auth tag)
 * @param dek         32-byte Data Encryption Key
 * @param iv          12-byte initialization vector (must match encryption IV)
 * @param aadText     Additional authenticated data (must match encryption AAD exactly)
 *
 * Throws CryptoError if authentication fails (tampered ciphertext, wrong key, or wrong AAD).
 */
export async function decryptAesGcm(
  ciphertext: ArrayBuffer,
  dek: Uint8Array,
  iv: Uint8Array,
  aadText: string,
): Promise<ArrayBuffer> {
  assertWebCrypto();

  if (dek.length !== 32) {
    throw new CryptoError("DEK must be exactly 32 bytes (AES-256)");
  }
  if (iv.length !== 12) {
    throw new CryptoError("IV must be exactly 12 bytes (AES-GCM)");
  }
  if (!aadText || aadText.length === 0) {
    throw new CryptoError("AAD text is required for context binding");
  }

  const dekAb: ArrayBuffer = toArrayBuffer(dek);
  const ivAb: ArrayBuffer = toArrayBuffer(iv);
  const aadBytes = fromString(aadText);
  const aadAb: ArrayBuffer = toArrayBuffer(aadBytes);

  const key = await window.crypto.subtle.importKey(
    "raw",
    dekAb,
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );

  try {
    return await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: ivAb,
        additionalData: aadAb,
        tagLength: 128,
      },
      key,
      ciphertext,
    );
  } catch (err) {
    throw new CryptoError("AES-GCM decryption failed", err);
  }
}

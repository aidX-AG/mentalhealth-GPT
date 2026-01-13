// lib/crypto/aesgcm.ts
// ============================================================================
// Client-side AES-256-GCM encryption helpers
// Version: v1.1 – 2026-01-12
//
// Purpose:
// - Pure cryptographic primitives for client-side encryption
// - Used by all encrypted content types (text, images, audio, video)
// - No API calls, no app logic, no storage
//
// IMPORTANT:
// - Browser-only (Web Crypto API)
// - Ciphertext is binary; only small metadata is base64url-encoded
// ============================================================================

export class CryptoError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message);
    this.name = "CryptoError";
  }
}

function assertWebCrypto() {
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    throw new CryptoError("Web Crypto API is not available in this environment");
  }
}

function fromString(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

/**
 * Base64URL (RFC 4648 §5) encoding: URL-safe, no padding.
 * Safe for JSON transport, URLs, and headers.
 */
export function toBase64Url(u8: Uint8Array): string {
  // Chunked conversion avoids potential call stack issues.
  let binary = "";
  const chunkSize = 0x8000; // 32KB
  for (let i = 0; i < u8.length; i += chunkSize) {
    const chunk = u8.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
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

  const dek = new Uint8Array(32); // 256 bit
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

  // Light validation (non-blocking) – helps keep AAD consistent across the codebase.
  const aadParts = aadText.split("|");
  if (aadParts.length < 3) {
    // eslint-disable-next-line no-console
    console.warn("AAD should contain at least: tenant|user|object_type");
  }

  const key = await window.crypto.subtle.importKey(
    "raw",
    dek,
    { name: "AES-GCM" },
    false,
    ["encrypt"]
  );

  // IV: 12 bytes (recommended for GCM)
  const iv = new Uint8Array(12);
  window.crypto.getRandomValues(iv);

  const aad = fromString(aadText);

  try {
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
        additionalData: aad,
        tagLength: 128,
      },
      key,
      plaintext
    );

    return {
      ciphertext: new Uint8Array(encrypted),
      iv_b64u: toBase64Url(iv),
      aad_b64u: toBase64Url(aad),
      alg: "AES-256-GCM",
    };
  } catch (err) {
    throw new CryptoError("AES-GCM encryption failed", err);
  }
}

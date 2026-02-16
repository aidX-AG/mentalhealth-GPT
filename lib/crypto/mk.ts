// lib/crypto/mk.ts
// ============================================================================
// MK (Mapping Key) Management
// Version: v1.0 – 2026-02-14
//
// MK = AES-GCM data key (encrypts mapping.enc), wrapped by SK via AES-KW.
//
// SPEC-002 §3.2: MK wrap/unwrap via AES-KW
// SPEC-006 §6.3: MK generation during onboarding
// SPEC-006 §7.3: MK export for pairing transfer
// SPEC-006 §10.3: mkBytes.fill(0) zeroing after wrap
//
// Extractable note:
// - wrapKey("raw", ...) requires extractable=true per WebCrypto spec
// - wrapMK imports with extractable=true (transient, for wrap operation only)
// - unwrapMK returns extractable=false (for day-to-day encrypt/decrypt)
// - exportMKForPairing returns extractable=true (transient, for pairing transfer)
// ============================================================================

import { CryptoError } from "./aesgcm";
import { MK_ALGORITHM, MK_BYTES } from "./types";

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
 * Generate 32 random bytes for a new Mapping Key.
 * Called once on the trust-anchor device during first-time onboarding.
 *
 * IMPORTANT: Caller MUST zero the bytes after wrapping: mkBytes.fill(0)
 */
export function generateMappingKeyBytes(): Uint8Array {
  assertWebCrypto();
  const mk = new Uint8Array(MK_BYTES);
  window.crypto.getRandomValues(mk);
  return mk;
}

/**
 * Wrap MK bytes with SK → mk_wrap_device (for server storage).
 *
 * 1. Import mkBytes as temporary CryptoKey (extractable=true, required for wrapKey)
 * 2. wrapKey("raw", tempMkKey, sk, "AES-KW") → wrapped bytes
 *
 * @param mkBytes  32-byte raw MK
 * @param sk       Device SK (AES-KW, non-extractable)
 * @returns        Wrapped MK bytes (40 bytes: 32 key + 8 AES-KW integrity check)
 */
export async function wrapMK(
  mkBytes: Uint8Array,
  sk: CryptoKey,
): Promise<Uint8Array> {
  assertWebCrypto();

  if (mkBytes.length !== MK_BYTES) {
    throw new CryptoError(`MK must be exactly ${MK_BYTES} bytes`);
  }

  // Import as temporary CryptoKey with extractable=true (needed for wrapKey)
  const tempMkKey = await window.crypto.subtle.importKey(
    "raw",
    mkBytes.buffer.slice(
      mkBytes.byteOffset,
      mkBytes.byteOffset + mkBytes.byteLength,
    ) as ArrayBuffer,
    MK_ALGORITHM,
    true, // extractable=true required for wrapKey operation
    ["encrypt", "decrypt"],
  );

  const wrapped = await window.crypto.subtle.wrapKey(
    "raw",
    tempMkKey,
    sk,
    { name: "AES-KW" },
  );

  return new Uint8Array(wrapped);
}

/**
 * Unwrap mk_wrap_device → MK as CryptoKey for encrypt/decrypt operations.
 *
 * Returns a non-extractable CryptoKey (AES-GCM) — the key used for
 * day-to-day mapping encryption/decryption.
 *
 * AES-KW has built-in integrity checking (RFC 3394, 64-bit IV check).
 * If the wrapped key has been tampered with, unwrapKey throws DOMException.
 *
 * @param wrappedMK  Wrapped MK from server (40 bytes)
 * @param sk         Device SK (AES-KW, non-extractable)
 * @returns          MK as CryptoKey (AES-GCM, non-extractable)
 */
export async function unwrapMK(
  wrappedMK: Uint8Array,
  sk: CryptoKey,
): Promise<CryptoKey> {
  assertWebCrypto();

  try {
    return await window.crypto.subtle.unwrapKey(
      "raw",
      wrappedMK.buffer.slice(
        wrappedMK.byteOffset,
        wrappedMK.byteOffset + wrappedMK.byteLength,
      ) as ArrayBuffer,
      sk,
      { name: "AES-KW" },
      MK_ALGORITHM,
      false, // extractable=false for day-to-day use
      ["encrypt", "decrypt"],
    );
  } catch (err) {
    throw new CryptoError("Failed to unwrap MK (tampered or wrong SK?)", err);
  }
}

/**
 * Unwrap MK as raw bytes for pairing transfer (SPEC-006 §7.3 step 6).
 *
 * The trust-anchor device needs MK raw bytes to encrypt them with the
 * ECDH-derived key for transfer to the new device.
 *
 * IMPORTANT: Caller MUST zero the returned bytes after use: mkBytes.fill(0)
 *
 * @param wrappedMK  Wrapped MK from server
 * @param sk         Device SK
 * @returns          Raw MK bytes (32 bytes) — MUST be zeroed after use
 */
export async function exportMKForPairing(
  wrappedMK: Uint8Array,
  sk: CryptoKey,
): Promise<Uint8Array> {
  assertWebCrypto();

  // Unwrap with extractable=true (transient, for export only)
  const tempMkKey = await window.crypto.subtle.unwrapKey(
    "raw",
    wrappedMK.buffer.slice(
      wrappedMK.byteOffset,
      wrappedMK.byteOffset + wrappedMK.byteLength,
    ) as ArrayBuffer,
    sk,
    { name: "AES-KW" },
    MK_ALGORITHM,
    true, // extractable=true for export
    ["encrypt", "decrypt"],
  );

  const mkRaw = await window.crypto.subtle.exportKey("raw", tempMkKey);
  return new Uint8Array(mkRaw);
}

/**
 * Import raw MK bytes as non-extractable CryptoKey.
 *
 * Used on the new device after receiving MK via pairing:
 * 1. Decrypt MK bytes from ECDH channel
 * 2. importMK(mkBytes) → CryptoKey for operations
 * 3. wrapMK(mkBytes, sk) → mk_wrap_device for server
 * 4. mkBytes.fill(0) — zero the raw bytes
 *
 * @param mkBytes  32-byte raw MK
 * @returns        MK as CryptoKey (AES-GCM, non-extractable)
 */
export async function importMK(mkBytes: Uint8Array): Promise<CryptoKey> {
  assertWebCrypto();

  if (mkBytes.length !== MK_BYTES) {
    throw new CryptoError(`MK must be exactly ${MK_BYTES} bytes`);
  }

  return window.crypto.subtle.importKey(
    "raw",
    mkBytes.buffer.slice(
      mkBytes.byteOffset,
      mkBytes.byteOffset + mkBytes.byteLength,
    ) as ArrayBuffer,
    MK_ALGORITHM,
    false, // non-extractable for operations
    ["encrypt", "decrypt"],
  );
}

// lib/crypto/mapping-encryption.ts
// ============================================================================
// Mapping Encryption / Decryption
// Version: v1.0 – 2026-02-14
//
// Encrypts/decrypts the pseudonymisation mapping (JSON) with MK (AES-GCM).
// Nonce is prefixed in the blob: nonce(12) || ciphertext(+tag)
//
// SPEC-002 §3.6: Mapping nonce prefixed in blob (not separate)
// SPEC-002 §3.7: Mapping encryption with MK
// ============================================================================

import { CryptoError } from "./aesgcm";
import { buildMappingAAD } from "./aad";
import type { MappingAADInput, MappingBlob } from "./types";
import { NONCE_BYTES } from "./types";

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
 * Normalize any Uint8Array to a plain ArrayBuffer.
 * Needed for strict WebCrypto TypeScript typings.
 */
function toArrayBuffer(u8: Uint8Array): ArrayBuffer {
  return u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength) as ArrayBuffer;
}

/**
 * Encrypt a mapping object → nonce(12) || ciphertext blob.
 *
 * The mapping is JSON-serialized, then encrypted with MK (AES-GCM).
 * The 12-byte nonce is prepended to the ciphertext (SPEC-002 §3.6).
 *
 * @param mapping   JSON-serializable mapping object
 * @param mk        Unwrapped MK as CryptoKey (AES-GCM, from unwrapMK)
 * @param aadInput  AAD fields (tenantId, userId, mappingVersion)
 * @returns         nonce(12) || ciphertext (MappingBlob)
 */
export async function encryptMapping(
  mapping: unknown,
  mk: CryptoKey,
  aadInput: MappingAADInput,
): Promise<MappingBlob> {
  assertWebCrypto();

  const plaintext = new TextEncoder().encode(JSON.stringify(mapping));
  const nonce = new Uint8Array(NONCE_BYTES);
  window.crypto.getRandomValues(nonce);

  const aad = buildMappingAAD(aadInput);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: toArrayBuffer(nonce),
      additionalData: toArrayBuffer(aad),
      tagLength: 128,
    },
    mk,
    toArrayBuffer(plaintext),
  );

  // Prepend nonce to ciphertext: nonce(12) || ciphertext(+tag)
  const result = new Uint8Array(NONCE_BYTES + ciphertext.byteLength);
  result.set(nonce, 0);
  result.set(new Uint8Array(ciphertext), NONCE_BYTES);

  return result;
}

/**
 * Decrypt a mapping blob → parsed JSON object.
 *
 * Splits the blob into nonce(12) and ciphertext, then decrypts with MK.
 *
 * @param blob      nonce(12) || ciphertext (from MinIO presigned download)
 * @param mk        Unwrapped MK as CryptoKey (AES-GCM)
 * @param aadInput  AAD fields (must match encryption AAD exactly)
 * @returns         Parsed JSON mapping object
 */
export async function decryptMapping(
  blob: Uint8Array,
  mk: CryptoKey,
  aadInput: MappingAADInput,
): Promise<unknown> {
  assertWebCrypto();

  if (blob.length <= NONCE_BYTES) {
    throw new CryptoError(
      `Mapping blob too short: ${blob.length} bytes (need > ${NONCE_BYTES})`,
    );
  }

  const nonce = blob.slice(0, NONCE_BYTES);
  const ciphertext = blob.slice(NONCE_BYTES);
  const aad = buildMappingAAD(aadInput);

  let plaintext: ArrayBuffer;
  try {
    plaintext = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: toArrayBuffer(nonce),
        additionalData: toArrayBuffer(aad),
        tagLength: 128,
      },
      mk,
      toArrayBuffer(ciphertext),
    );
  } catch (err) {
    throw new CryptoError("Mapping decryption failed", err);
  }

  try {
    return JSON.parse(new TextDecoder().decode(plaintext));
  } catch (err) {
    throw new CryptoError("Mapping JSON parse failed after decryption", err);
  }
}

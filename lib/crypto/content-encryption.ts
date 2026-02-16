// lib/crypto/content-encryption.ts
// ============================================================================
// Content Encryption / Decryption (high-level orchestration)
// Version: v1.0 – 2026-02-14
//
// Wraps the low-level AES-GCM primitives with AAD construction.
// Content nonce is returned separately (stored in DB via finalize).
//
// SPEC-002 §3.4: Content encrypt/decrypt (AES-256-GCM)
// SPEC-002 §3.5: AAD canonical encoding
// SPEC-002 §3.6: Content nonce stored separately in DB
// SPEC-002 §3.8: Upload flow integration
// ============================================================================

import { encryptAesGcm, decryptAesGcm, fromBase64Url, CryptoError } from "./aesgcm";
import { buildContentAAD } from "./aad";
import type { ContentAADInput, ContentEncryptionResult } from "./types";
import { NONCE_BYTES } from "./types";

/**
 * Encrypt content with a DEK and context-bound AAD.
 *
 * @param plaintext  Raw data to encrypt
 * @param dek        32-byte Data Encryption Key
 * @param aadInput   AAD fields (tenantId, objectId, mimeType, contentSizeBytes)
 * @returns          { ciphertext, nonce (12 bytes), aad (pipe-delimited bytes) }
 */
export async function encryptContent(
  plaintext: ArrayBuffer,
  dek: Uint8Array,
  aadInput: ContentAADInput,
): Promise<ContentEncryptionResult> {
  const aad = buildContentAAD(aadInput);
  const aadText = new TextDecoder().decode(aad);

  const result = await encryptAesGcm(plaintext, dek, aadText);

  return {
    ciphertext: result.ciphertext,
    nonce: decodeIV(result.iv_b64u),
    aad,
  };
}

/**
 * Decrypt content with a DEK and the original nonce/AAD.
 *
 * @param ciphertext  Encrypted data (ciphertext + 128-bit GCM tag)
 * @param dek         32-byte Data Encryption Key
 * @param nonce       12-byte IV from finalize metadata
 * @param aad         AAD bytes from finalize metadata
 * @returns           Decrypted plaintext
 */
export async function decryptContent(
  ciphertext: ArrayBuffer,
  dek: Uint8Array,
  nonce: Uint8Array,
  aad: Uint8Array,
): Promise<ArrayBuffer> {
  const aadText = new TextDecoder().decode(aad);
  return decryptAesGcm(ciphertext, dek, nonce, aadText);
}

/**
 * Decode base64url IV to Uint8Array and validate length.
 * encryptAesGcm returns iv_b64u as base64url string.
 */
function decodeIV(ivB64u: string): Uint8Array {
  const iv = fromBase64Url(ivB64u);
  if (iv.length !== NONCE_BYTES) {
    throw new CryptoError(
      `IV must be ${NONCE_BYTES} bytes, got ${iv.length}`,
    );
  }
  return iv;
}

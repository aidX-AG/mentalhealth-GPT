// lib/crypto/types.ts
// ============================================================================
// Shared crypto types and constants (SPEC-002, SPEC-006)
// Version: v1.0 – 2026-02-14
// ============================================================================

// ---------------------------------------------------------------------------
// Key types
// ---------------------------------------------------------------------------

/** Encrypted MK payload for pairing transfer (SPEC-006 §7.3 step 6) */
export interface EncryptedMKTransfer {
  iv: Uint8Array; // 12 bytes (AES-GCM)
  ciphertext: Uint8Array; // MK encrypted with ECDH-derived key
}

/** Content encryption result — nonce separate (stored in DB via finalize) */
export interface ContentEncryptionResult {
  ciphertext: Uint8Array; // ciphertext + GCM tag (128-bit)
  nonce: Uint8Array; // 12 bytes, sent separately in finalize
  aad: Uint8Array; // pipe-delimited AAD bytes
}

/**
 * Mapping encryption result — nonce prefixed in blob (SPEC-002 §3.6)
 * Format: nonce(12) || ciphertext(+tag)
 */
export type MappingBlob = Uint8Array;

// ---------------------------------------------------------------------------
// AAD input types (SPEC-002 §3.5)
// ---------------------------------------------------------------------------

export interface ContentAADInput {
  tenantId: string;
  objectId: string; // server-issued from init-upload
  mimeType: string;
  contentSizeBytes: number;
}

export interface MappingAADInput {
  tenantId: string;
  userId: string;
  mappingVersion: number;
}

// ---------------------------------------------------------------------------
// QR Payload (SPEC-006 §7.1)
// ---------------------------------------------------------------------------

export interface PairingQRPayload {
  v: 1; // protocol version
  p: string; // pairing_id (base64url, 22 chars)
  s: string; // pairing_secret (base64url, 43 chars)
  n: string; // pairing_nonce (base64url, 22 chars) — HKDF salt
  t: number; // unix timestamp seconds (UX only, TTL = server)
}

// ---------------------------------------------------------------------------
// Worker wrap response (POST /v1/crypto/wrap-dek-for-worker)
// ---------------------------------------------------------------------------

export interface WorkerWrapResult {
  cdek_wrapped_worker_ct: string;
  kek_key_name: string;
  kek_key_version: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const SK_ALGORITHM: AesKeyGenParams = { name: "AES-KW", length: 256 };
export const MK_ALGORITHM: AesKeyGenParams = { name: "AES-GCM", length: 256 };
export const ECDH_CURVE = "P-256" as const;
export const HKDF_INFO = new TextEncoder().encode("mhgpt-pairing-v1");
export const NONCE_BYTES = 12;
export const MK_BYTES = 32;
export const DEK_BYTES = 32;
export const PAIRING_QR_MAX_BYTES = 200;

// IndexedDB
export const IDB_NAME = "mhgpt_crypto";
export const IDB_STORE = "keys";
export const SK_KEY = "device-sk";

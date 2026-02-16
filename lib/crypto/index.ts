// lib/crypto/index.ts
// ============================================================================
// Barrel export — Public API for the crypto library
// Version: v1.0 – 2026-02-14
//
// All crypto operations are exposed through this single entry point.
// Import from "lib/crypto" instead of individual modules.
// ============================================================================

// Key management — SK (Device Key)
export {
  generateDeviceKey,
  getDeviceKey,
  ensureDeviceKey,
  hasDeviceKey,
} from "./sk";

// Key management — MK (Mapping Key)
export {
  generateMappingKeyBytes,
  wrapMK,
  unwrapMK,
  exportMKForPairing,
  importMK,
} from "./mk";

// Key management — DEK (Data Encryption Key)
export { generateDEK, wrapDEK, unwrapDEK, wrapDEKForWorker } from "./dek";

// Content encryption (AES-256-GCM)
export { encryptContent, decryptContent } from "./content-encryption";

// Mapping encryption (AES-256-GCM, nonce-prefixed blob)
export { encryptMapping, decryptMapping } from "./mapping-encryption";

// AAD builders (canonical pipe-delimited)
export { buildContentAAD, buildMappingAAD } from "./aad";

// Pairing protocol (SPEC-006: P-256 ECDH + HKDF + AES-GCM)
export {
  parsePairingQR,
  buildPairingQR,
  initiatePairing,
  respondToPairing,
} from "./pairing";

// Low-level primitives (from aesgcm.ts)
export {
  encryptAesGcm,
  decryptAesGcm,
  toBase64Url,
  fromBase64Url,
  CryptoError,
} from "./aesgcm";

// Types
export type {
  ContentAADInput,
  MappingAADInput,
  ContentEncryptionResult,
  MappingBlob,
  PairingQRPayload,
  EncryptedMKTransfer,
  WorkerWrapResult,
} from "./types";

// Pairing result types
export type {
  PairingInitResult,
  PairingResponseResult,
} from "./pairing";

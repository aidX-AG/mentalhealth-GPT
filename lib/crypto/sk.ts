// lib/crypto/sk.ts
// ============================================================================
// SK (Storage Key / Device Key) Management
// Version: v1.0 – 2026-02-14
//
// SK = AES-KW, 256-bit, non-extractable, stored in IndexedDB.
// Used exclusively for wrapping/unwrapping MK and DEK.
//
// SPEC-002 §3.1: SK generation and persistence
// SPEC-006 §8.3: Eviction detection (hasDeviceKey)
// SPEC-006 §10.3: SK non-extractable enforced
// ============================================================================

import { CryptoError } from "./aesgcm";
import { saveKey, loadKey, hasKey } from "./key-store";
import { SK_ALGORITHM, SK_KEY } from "./types";

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
 * Generate a new SK and persist to IndexedDB.
 *
 * - AES-KW, 256-bit
 * - extractable = false (key NEVER leaves WebCrypto)
 * - usages = ["wrapKey", "unwrapKey"]
 *
 * @returns The generated CryptoKey (also saved to IndexedDB)
 */
export async function generateDeviceKey(): Promise<CryptoKey> {
  assertWebCrypto();

  const sk = await window.crypto.subtle.generateKey(
    SK_ALGORITHM,
    false, // non-extractable
    ["wrapKey", "unwrapKey"],
  );

  await saveKey(SK_KEY, sk);
  return sk;
}

/**
 * Load SK from IndexedDB.
 * Returns null if the key doesn't exist (evicted or never generated).
 */
export async function getDeviceKey(): Promise<CryptoKey | null> {
  return loadKey(SK_KEY);
}

/**
 * Ensure SK exists: load if present, generate if missing.
 * Use this during onboarding / device setup.
 */
export async function ensureDeviceKey(): Promise<CryptoKey> {
  const existing = await getDeviceKey();
  if (existing) return existing;
  return generateDeviceKey();
}

/**
 * Check if SK exists in IndexedDB without loading it.
 * Used for eviction detection (SPEC-006 §8.3):
 * If user is authenticated but hasDeviceKey() returns false,
 * the device has been evicted and needs re-pairing.
 */
export async function hasDeviceKey(): Promise<boolean> {
  return hasKey(SK_KEY);
}

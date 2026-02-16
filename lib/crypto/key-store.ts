// lib/crypto/key-store.ts
// ============================================================================
// IndexedDB key storage for CryptoKey objects
// Version: v1.0 – 2026-02-14
//
// Stores non-extractable CryptoKey objects directly in IndexedDB.
// The structured clone algorithm preserves WebCrypto key properties.
// No external library — native IndexedDB API with Promise wrappers.
//
// SPEC-002 §3.1: SK stored as CryptoKey in IndexedDB
// SPEC-006 §8.3: hasKey() for eviction detection
// ============================================================================

import { CryptoError } from "./aesgcm";
import { IDB_NAME, IDB_STORE } from "./types";

const IDB_VERSION = 1;

/** Guard against SSR / non-browser environments */
function assertIndexedDB(): void {
  if (typeof indexedDB === "undefined") {
    throw new CryptoError("IndexedDB is not available in this environment");
  }
}

/**
 * Open (or create) the crypto key database.
 * Uses a single object store with string keys.
 */
function openDB(): Promise<IDBDatabase> {
  assertIndexedDB();

  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(IDB_NAME, IDB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(new CryptoError("Failed to open IndexedDB", request.error));
  });
}

/** Save a CryptoKey to IndexedDB under the given id. */
export async function saveKey(id: string, key: CryptoKey): Promise<void> {
  const db = await openDB();
  try {
    return await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      const request = store.put(key, id);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(new CryptoError(`Failed to save key "${id}"`, request.error));
    });
  } finally {
    db.close();
  }
}

/** Load a CryptoKey from IndexedDB. Returns null if not found. */
export async function loadKey(id: string): Promise<CryptoKey | null> {
  const db = await openDB();
  try {
    return await new Promise<CryptoKey | null>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const store = tx.objectStore(IDB_STORE);
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result;
        if (result === undefined) {
          resolve(null);
        } else {
          resolve(result as CryptoKey);
        }
      };
      request.onerror = () =>
        reject(new CryptoError(`Failed to load key "${id}"`, request.error));
    });
  } finally {
    db.close();
  }
}

/** Delete a key from IndexedDB. No-op if key doesn't exist. */
export async function deleteKey(id: string): Promise<void> {
  const db = await openDB();
  try {
    return await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () =>
        reject(new CryptoError(`Failed to delete key "${id}"`, request.error));
    });
  } finally {
    db.close();
  }
}

/** Check if a key exists in IndexedDB without loading it. */
export async function hasKey(id: string): Promise<boolean> {
  const db = await openDB();
  try {
    return await new Promise<boolean>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, "readonly");
      const store = tx.objectStore(IDB_STORE);
      const request = store.count(id);

      request.onsuccess = () => resolve(request.result > 0);
      request.onerror = () =>
        reject(
          new CryptoError(`Failed to check key "${id}"`, request.error),
        );
    });
  } finally {
    db.close();
  }
}

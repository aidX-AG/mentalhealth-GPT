// vitest.setup.ts
// ============================================================================
// Test environment setup for crypto library tests.
//
// Polyfills:
// - WebCrypto API: happy-dom doesn't provide crypto.subtle,
//   so we inject Node 20's native WebCrypto implementation.
// - IndexedDB: fake-indexeddb provides a full IDB implementation in-memory.
// ============================================================================

import "fake-indexeddb/auto";
import { webcrypto } from "node:crypto";

// happy-dom provides `window` but not a full WebCrypto implementation.
// Node 20+ ships a spec-compliant WebCrypto at `crypto.webcrypto`.
// Our code checks `window.crypto.subtle`, so we must ensure it's set.
Object.defineProperty(window, "crypto", {
  value: webcrypto as unknown as Crypto,
  configurable: true,
  writable: true,
});

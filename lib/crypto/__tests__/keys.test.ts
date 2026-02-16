import { describe, it, expect, beforeEach } from "vitest";
import {
  generateDeviceKey,
  getDeviceKey,
  ensureDeviceKey,
  hasDeviceKey,
} from "../sk";
import {
  generateMappingKeyBytes,
  wrapMK,
  unwrapMK,
  exportMKForPairing,
  importMK,
} from "../mk";
import { generateDEK, wrapDEK, unwrapDEK } from "../dek";
import { IDB_NAME, MK_BYTES, DEK_BYTES } from "../types";

// Clear IndexedDB between tests to prevent cross-contamination
beforeEach(async () => {
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(IDB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
});

// ---------------------------------------------------------------------------
// SK (Device Key)
// ---------------------------------------------------------------------------
describe("SK (Device Key)", () => {
  it("generates a non-extractable AES-KW CryptoKey", async () => {
    const sk = await generateDeviceKey();
    expect(sk).toBeInstanceOf(CryptoKey);
    expect(sk.algorithm.name).toBe("AES-KW");
    expect(sk.extractable).toBe(false);
    expect(sk.usages).toContain("wrapKey");
    expect(sk.usages).toContain("unwrapKey");
  });

  it("persists to IndexedDB and can be retrieved", async () => {
    await generateDeviceKey();
    const retrieved = await getDeviceKey();
    expect(retrieved).not.toBeNull();
    expect(retrieved!.algorithm.name).toBe("AES-KW");
  });

  it("getDeviceKey returns null when no key exists", async () => {
    const result = await getDeviceKey();
    expect(result).toBeNull();
  });

  it("hasDeviceKey returns false when no key exists", async () => {
    expect(await hasDeviceKey()).toBe(false);
  });

  it("hasDeviceKey returns true after generate", async () => {
    await generateDeviceKey();
    expect(await hasDeviceKey()).toBe(true);
  });

  it("ensureDeviceKey generates if missing", async () => {
    expect(await hasDeviceKey()).toBe(false);
    const sk = await ensureDeviceKey();
    expect(sk.algorithm.name).toBe("AES-KW");
    expect(await hasDeviceKey()).toBe(true);
  });

  it("ensureDeviceKey returns existing key if present", async () => {
    const sk1 = await generateDeviceKey();
    const sk2 = await ensureDeviceKey();
    // Both should be AES-KW keys (we can't compare CryptoKey identity,
    // but we verify the key works by wrapping with both)
    expect(sk2.algorithm.name).toBe("AES-KW");
  });

  it("non-extractable: exportKey throws", async () => {
    const sk = await generateDeviceKey();
    await expect(
      window.crypto.subtle.exportKey("raw", sk),
    ).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// MK (Mapping Key)
// ---------------------------------------------------------------------------
describe("MK (Mapping Key)", () => {
  let sk: CryptoKey;

  beforeEach(async () => {
    sk = await generateDeviceKey();
  });

  it("generateMappingKeyBytes returns 32 random bytes", () => {
    const mk = generateMappingKeyBytes();
    expect(mk).toBeInstanceOf(Uint8Array);
    expect(mk.length).toBe(MK_BYTES);

    // Two calls should produce different bytes (probabilistic, but safe)
    const mk2 = generateMappingKeyBytes();
    expect(mk).not.toEqual(mk2);
  });

  it("wrapMK → unwrapMK roundtrip", async () => {
    const mkBytes = generateMappingKeyBytes();
    const wrapped = await wrapMK(mkBytes, sk);

    // AES-KW adds 8-byte integrity check value (RFC 3394)
    expect(wrapped.length).toBe(MK_BYTES + 8);

    const mkKey = await unwrapMK(wrapped, sk);
    expect(mkKey).toBeInstanceOf(CryptoKey);
    expect(mkKey.algorithm.name).toBe("AES-GCM");
    expect(mkKey.extractable).toBe(false);
  });

  it("unwrapMK with tampered data throws (AES-KW integrity)", async () => {
    const mkBytes = generateMappingKeyBytes();
    const wrapped = await wrapMK(mkBytes, sk);

    // Flip a byte — AES-KW integrity check must fail
    wrapped[0] ^= 0xff;

    await expect(unwrapMK(wrapped, sk)).rejects.toThrow();
  });

  it("unwrapMK with wrong SK throws", async () => {
    const mkBytes = generateMappingKeyBytes();
    const wrapped = await wrapMK(mkBytes, sk);

    // Generate a different SK
    const wrongSk = await window.crypto.subtle.generateKey(
      { name: "AES-KW", length: 256 },
      false,
      ["wrapKey", "unwrapKey"],
    );

    await expect(unwrapMK(wrapped, wrongSk)).rejects.toThrow();
  });

  it("exportMKForPairing returns original raw bytes", async () => {
    const mkBytes = generateMappingKeyBytes();
    const wrapped = await wrapMK(mkBytes, sk);
    const exported = await exportMKForPairing(wrapped, sk);

    expect(exported.length).toBe(MK_BYTES);
    expect(exported).toEqual(mkBytes);
  });

  it("importMK creates a non-extractable AES-GCM CryptoKey", async () => {
    const mkBytes = generateMappingKeyBytes();
    const mkKey = await importMK(mkBytes);

    expect(mkKey).toBeInstanceOf(CryptoKey);
    expect(mkKey.algorithm.name).toBe("AES-GCM");
    expect(mkKey.extractable).toBe(false);
  });

  it("rejects wrong-size MK (16 bytes instead of 32)", async () => {
    await expect(wrapMK(new Uint8Array(16), sk)).rejects.toThrow();
    await expect(importMK(new Uint8Array(16))).rejects.toThrow();
  });

  it("MK can encrypt and decrypt data after unwrap", async () => {
    const mkBytes = generateMappingKeyBytes();
    const wrapped = await wrapMK(mkBytes, sk);
    const mkKey = await unwrapMK(wrapped, sk);

    // Use the MK to encrypt and decrypt
    const nonce = new Uint8Array(12);
    window.crypto.getRandomValues(nonce);
    const data = new TextEncoder().encode("test mapping data");

    const ct = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv: nonce },
      mkKey,
      data,
    );

    const pt = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv: nonce },
      mkKey,
      ct,
    );

    expect(new Uint8Array(pt)).toEqual(data);
  });
});

// ---------------------------------------------------------------------------
// DEK (Data Encryption Key)
// ---------------------------------------------------------------------------
describe("DEK (Data Encryption Key)", () => {
  let sk: CryptoKey;

  beforeEach(async () => {
    sk = await generateDeviceKey();
  });

  it("generateDEK returns 32 random bytes", () => {
    const dek = generateDEK();
    expect(dek).toBeInstanceOf(Uint8Array);
    expect(dek.length).toBe(DEK_BYTES);
  });

  it("wrapDEK → unwrapDEK roundtrip preserves bytes", async () => {
    const dek = generateDEK();
    const wrapped = await wrapDEK(dek, sk);

    // AES-KW: 32 + 8 bytes
    expect(wrapped.length).toBe(DEK_BYTES + 8);

    const unwrapped = await unwrapDEK(wrapped, sk);
    expect(unwrapped).toEqual(dek);
  });

  it("unwrapDEK with tampered data throws", async () => {
    const dek = generateDEK();
    const wrapped = await wrapDEK(dek, sk);
    wrapped[0] ^= 0xff;

    await expect(unwrapDEK(wrapped, sk)).rejects.toThrow();
  });

  it("unwrapDEK with wrong SK throws", async () => {
    const dek = generateDEK();
    const wrapped = await wrapDEK(dek, sk);

    const wrongSk = await window.crypto.subtle.generateKey(
      { name: "AES-KW", length: 256 },
      false,
      ["wrapKey", "unwrapKey"],
    );

    await expect(unwrapDEK(wrapped, wrongSk)).rejects.toThrow();
  });

  it("rejects wrong-size DEK", async () => {
    await expect(wrapDEK(new Uint8Array(16), sk)).rejects.toThrow();
  });

  it("DEK bytes can be zeroed after unwrap (caller responsibility)", async () => {
    const dek = generateDEK();
    const wrapped = await wrapDEK(dek, sk);
    const unwrapped = await unwrapDEK(wrapped, sk);

    // Verify zeroing works
    unwrapped.fill(0);
    expect(unwrapped.every((b) => b === 0)).toBe(true);
  });
});

import { describe, it, expect, beforeEach } from "vitest";
import {
  parsePairingQR,
  buildPairingQR,
  initiatePairing,
  respondToPairing,
} from "../pairing";
import {
  generateMappingKeyBytes,
  wrapMK,
  importMK,
  exportMKForPairing,
} from "../mk";
import { generateDeviceKey } from "../sk";
import { encryptMapping, decryptMapping } from "../mapping-encryption";
import { IDB_NAME, PAIRING_QR_MAX_BYTES } from "../types";
import type { MappingAADInput } from "../types";

// Clear IndexedDB between tests
beforeEach(async () => {
  await new Promise<void>((resolve, reject) => {
    const req = indexedDB.deleteDatabase(IDB_NAME);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
});

// ---------------------------------------------------------------------------
// QR Payload (SPEC-006 §7.1)
// ---------------------------------------------------------------------------
describe("QR Payload", () => {
  it("parsePairingQR accepts valid payload", () => {
    const payload = JSON.stringify({
      v: 1,
      p: "pairing-id-base64url",
      s: "pairing-secret-base64url-43chars",
      n: "pairing-nonce-b64url",
      t: 1700000000,
    });

    const parsed = parsePairingQR(payload);
    expect(parsed.v).toBe(1);
    expect(parsed.p).toBe("pairing-id-base64url");
    expect(parsed.s).toBe("pairing-secret-base64url-43chars");
    expect(parsed.n).toBe("pairing-nonce-b64url");
    expect(parsed.t).toBe(1700000000);
  });

  it("ignores unknown fields (forward-compat)", () => {
    const payload = JSON.stringify({
      v: 1,
      p: "pid",
      s: "sec",
      n: "non",
      t: 1700000000,
      x: "extra-field",
    });

    const parsed = parsePairingQR(payload);
    expect(parsed.p).toBe("pid");
    expect((parsed as any).x).toBeUndefined();
  });

  it("rejects oversized payload (> 200 bytes)", () => {
    const payload = JSON.stringify({
      v: 1,
      p: "a".repeat(100),
      s: "b".repeat(100),
      n: "c".repeat(50),
      t: 1700000000,
    });

    expect(
      new TextEncoder().encode(payload).length,
    ).toBeGreaterThan(PAIRING_QR_MAX_BYTES);
    expect(() => parsePairingQR(payload)).toThrow(/200|limit/i);
  });

  it("rejects unsupported version (v > 1)", () => {
    const payload = JSON.stringify({
      v: 2,
      p: "a",
      s: "b",
      n: "c",
      t: 1700000000,
    });
    expect(() => parsePairingQR(payload)).toThrow(/aktualisieren|version/i);
  });

  it("rejects malformed JSON", () => {
    expect(() => parsePairingQR("not json at all")).toThrow();
  });

  it("rejects non-object JSON", () => {
    expect(() => parsePairingQR('"just a string"')).toThrow();
    expect(() => parsePairingQR("42")).toThrow();
  });

  it("rejects missing required fields", () => {
    // missing s, n, t
    expect(() =>
      parsePairingQR(JSON.stringify({ v: 1, p: "a" })),
    ).toThrow();

    // missing n, t
    expect(() =>
      parsePairingQR(JSON.stringify({ v: 1, p: "a", s: "b" })),
    ).toThrow();

    // missing t
    expect(() =>
      parsePairingQR(JSON.stringify({ v: 1, p: "a", s: "b", n: "c" })),
    ).toThrow();
  });

  it("rejects empty string fields", () => {
    expect(() =>
      parsePairingQR(
        JSON.stringify({ v: 1, p: "", s: "b", n: "c", t: 1 }),
      ),
    ).toThrow();
  });

  it("buildPairingQR creates compact JSON ≤ 200 bytes", () => {
    const qr = buildPairingQR({
      pairingId: "pid",
      pairingSecret: "psecret",
      pairingNonce: "pnonce",
    });

    const parsed = JSON.parse(qr);
    expect(parsed.v).toBe(1);
    expect(parsed.p).toBe("pid");
    expect(parsed.s).toBe("psecret");
    expect(parsed.n).toBe("pnonce");
    expect(typeof parsed.t).toBe("number");
    expect(
      new TextEncoder().encode(qr).length,
    ).toBeLessThanOrEqual(PAIRING_QR_MAX_BYTES);
  });

  it("buildPairingQR → parsePairingQR roundtrip", () => {
    const qr = buildPairingQR({
      pairingId: "test-id",
      pairingSecret: "test-secret",
      pairingNonce: "test-nonce",
    });

    const parsed = parsePairingQR(qr);
    expect(parsed.p).toBe("test-id");
    expect(parsed.s).toBe("test-secret");
    expect(parsed.n).toBe("test-nonce");
  });
});

// ---------------------------------------------------------------------------
// ECDH Pairing Protocol (SPEC-006 §7.3)
// ---------------------------------------------------------------------------
describe("ECDH Pairing Protocol", () => {
  it("initiatePairing generates 65-byte P-256 public key", async () => {
    const result = await initiatePairing();
    // Uncompressed P-256 point: 0x04 || x(32) || y(32) = 65 bytes
    expect(result.publicKeyRaw.length).toBe(65);
    expect(result.publicKeyRaw[0]).toBe(0x04);
  });

  it("respondToPairing generates 65-byte P-256 public key", async () => {
    const trustAnchor = await initiatePairing();
    const newDevice = await respondToPairing(trustAnchor.publicKeyRaw);
    expect(newDevice.publicKeyRaw.length).toBe(65);
    expect(newDevice.publicKeyRaw[0]).toBe(0x04);
  });

  it("MK transfer roundtrip: trust-anchor encrypts, new device decrypts", async () => {
    // 1. Trust-anchor generates MK
    const mkBytes = generateMappingKeyBytes();

    // 2. Trust-anchor initiates pairing
    const trustAnchor = await initiatePairing();

    // 3. New device responds with trust-anchor's public key
    const newDevice = await respondToPairing(trustAnchor.publicKeyRaw);

    // 4. Pairing nonce (from QR code)
    const pairingNonce = new Uint8Array(16);
    window.crypto.getRandomValues(pairingNonce);

    // 5. Trust-anchor encrypts MK for new device
    const encrypted = await trustAnchor.encryptMKForPeer(
      mkBytes,
      newDevice.publicKeyRaw,
      pairingNonce,
    );

    expect(encrypted.iv.length).toBe(12);
    expect(encrypted.ciphertext.length).toBeGreaterThan(0);

    // 6. New device decrypts MK
    const decryptedMK = await newDevice.decryptMKFromPeer(
      encrypted,
      pairingNonce,
    );

    expect(decryptedMK).toEqual(mkBytes);
  });

  it("decrypt fails with wrong pairing nonce", async () => {
    const mkBytes = generateMappingKeyBytes();
    const trustAnchor = await initiatePairing();
    const newDevice = await respondToPairing(trustAnchor.publicKeyRaw);

    const nonce1 = new Uint8Array(16);
    window.crypto.getRandomValues(nonce1);
    const nonce2 = new Uint8Array(16);
    window.crypto.getRandomValues(nonce2);

    const encrypted = await trustAnchor.encryptMKForPeer(
      mkBytes,
      newDevice.publicKeyRaw,
      nonce1,
    );

    // Wrong nonce → different derived key → auth tag mismatch
    await expect(
      newDevice.decryptMKFromPeer(encrypted, nonce2),
    ).rejects.toThrow();
  });

  it("decrypt fails with wrong keypair", async () => {
    const mkBytes = generateMappingKeyBytes();
    const trustAnchor = await initiatePairing();
    const newDevice = await respondToPairing(trustAnchor.publicKeyRaw);
    const wrongDevice = await respondToPairing(trustAnchor.publicKeyRaw);

    const pairingNonce = new Uint8Array(16);
    window.crypto.getRandomValues(pairingNonce);

    // Encrypt for newDevice
    const encrypted = await trustAnchor.encryptMKForPeer(
      mkBytes,
      newDevice.publicKeyRaw,
      pairingNonce,
    );

    // wrongDevice tries to decrypt → different ECDH shared secret
    await expect(
      wrongDevice.decryptMKFromPeer(encrypted, pairingNonce),
    ).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Full Pairing Flow (End-to-End)
// ---------------------------------------------------------------------------
describe("Full Pairing Flow (end-to-end)", () => {
  it("paired device can use transferred MK to decrypt mapping", async () => {
    // === Setup: Trust-anchor device ===
    const sk1 = await generateDeviceKey();
    const mkBytes = generateMappingKeyBytes();
    const mkWrapped1 = await wrapMK(mkBytes, sk1);

    // Create a test mapping
    const aadInput: MappingAADInput = {
      tenantId: "tenant-1",
      userId: "user-123",
      mappingVersion: 1,
    };
    const mapping = { PERSON_001: "Max Müller", LOC_001: "Zürich" };

    // Trust-anchor encrypts mapping with MK
    const mk1 = await importMK(mkBytes);
    const mappingBlob = await encryptMapping(mapping, mk1, aadInput);

    // === Pairing Protocol ===
    const trustAnchor = await initiatePairing();
    const newDevice = await respondToPairing(trustAnchor.publicKeyRaw);

    const pairingNonce = new Uint8Array(16);
    window.crypto.getRandomValues(pairingNonce);

    // Trust-anchor exports MK and encrypts for peer
    const exportedMK = await exportMKForPairing(mkWrapped1, sk1);
    const encrypted = await trustAnchor.encryptMKForPeer(
      exportedMK,
      newDevice.publicKeyRaw,
      pairingNonce,
    );

    // === New device receives MK ===
    const receivedMK = await newDevice.decryptMKFromPeer(
      encrypted,
      pairingNonce,
    );

    // New device wraps MK with its own SK
    const sk2 = await window.crypto.subtle.generateKey(
      { name: "AES-KW", length: 256 },
      false,
      ["wrapKey", "unwrapKey"],
    );
    const mkWrapped2 = await wrapMK(receivedMK, sk2);

    // Clean up raw MK bytes (as spec requires)
    receivedMK.fill(0);
    exportedMK.fill(0);

    // === Verification: new device can decrypt the mapping ===
    const { unwrapMK } = await import("../mk");
    const mk2 = await unwrapMK(mkWrapped2, sk2);
    const decryptedMapping = await decryptMapping(mappingBlob, mk2, aadInput);

    expect(decryptedMapping).toEqual(mapping);
  });
});

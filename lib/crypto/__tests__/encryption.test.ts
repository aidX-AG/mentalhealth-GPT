import { describe, it, expect, beforeAll } from "vitest";
import { encryptContent, decryptContent } from "../content-encryption";
import { encryptMapping, decryptMapping } from "../mapping-encryption";
import { generateDEK } from "../aesgcm";
import { generateMappingKeyBytes, importMK } from "../mk";
import { NONCE_BYTES } from "../types";
import type { ContentAADInput, MappingAADInput } from "../types";

// ---------------------------------------------------------------------------
// Content Encryption (AES-256-GCM, nonce separate)
// ---------------------------------------------------------------------------
describe("Content Encryption", () => {
  const aadInput: ContentAADInput = {
    tenantId: "tenant-1",
    objectId: "obj-123",
    mimeType: "text/plain",
    contentSizeBytes: 13,
  };

  it("encrypt → decrypt roundtrip (text)", async () => {
    const dek = generateDEK();
    const plaintext = new TextEncoder().encode("Hello, World!");

    const encrypted = await encryptContent(
      plaintext.buffer as ArrayBuffer,
      dek,
      aadInput,
    );

    expect(encrypted.nonce.length).toBe(NONCE_BYTES);
    expect(encrypted.ciphertext.length).toBeGreaterThan(0);
    expect(encrypted.aad.length).toBeGreaterThan(0);

    const decrypted = await decryptContent(
      encrypted.ciphertext.buffer as ArrayBuffer,
      dek,
      encrypted.nonce,
      encrypted.aad,
    );

    expect(new Uint8Array(decrypted)).toEqual(plaintext);
  });

  it("encrypt → decrypt roundtrip (binary data)", async () => {
    const dek = generateDEK();
    const binary = new Uint8Array(256);
    for (let i = 0; i < 256; i++) binary[i] = i;

    const binaryAadInput: ContentAADInput = {
      ...aadInput,
      mimeType: "application/octet-stream",
      contentSizeBytes: 256,
    };

    const encrypted = await encryptContent(
      binary.buffer as ArrayBuffer,
      dek,
      binaryAadInput,
    );

    const decrypted = await decryptContent(
      encrypted.ciphertext.buffer as ArrayBuffer,
      dek,
      encrypted.nonce,
      encrypted.aad,
    );

    expect(new Uint8Array(decrypted)).toEqual(binary);
  });

  it("decrypt with wrong DEK throws", async () => {
    const dek = generateDEK();
    const wrongDek = generateDEK();
    const plaintext = new TextEncoder().encode("secret data");

    const encrypted = await encryptContent(
      plaintext.buffer as ArrayBuffer,
      dek,
      aadInput,
    );

    await expect(
      decryptContent(
        encrypted.ciphertext.buffer as ArrayBuffer,
        wrongDek,
        encrypted.nonce,
        encrypted.aad,
      ),
    ).rejects.toThrow();
  });

  it("decrypt with wrong AAD throws (GCM auth tag mismatch)", async () => {
    const dek = generateDEK();
    const plaintext = new TextEncoder().encode("secret data");

    const encrypted = await encryptContent(
      plaintext.buffer as ArrayBuffer,
      dek,
      aadInput,
    );

    const wrongAAD = new TextEncoder().encode(
      "v1|content|wrong-tenant|obj-123|text/plain|11",
    );

    await expect(
      decryptContent(
        encrypted.ciphertext.buffer as ArrayBuffer,
        dek,
        encrypted.nonce,
        wrongAAD,
      ),
    ).rejects.toThrow();
  });

  it("decrypt with tampered ciphertext throws", async () => {
    const dek = generateDEK();
    const plaintext = new TextEncoder().encode("secret data");

    const encrypted = await encryptContent(
      plaintext.buffer as ArrayBuffer,
      dek,
      aadInput,
    );

    // Flip a byte in ciphertext
    encrypted.ciphertext[0] ^= 0xff;

    await expect(
      decryptContent(
        encrypted.ciphertext.buffer as ArrayBuffer,
        dek,
        encrypted.nonce,
        encrypted.aad,
      ),
    ).rejects.toThrow();
  });

  it("each encryption produces a unique nonce", async () => {
    const dek = generateDEK();
    const plaintext = new TextEncoder().encode("same data");

    const e1 = await encryptContent(
      plaintext.buffer as ArrayBuffer,
      dek,
      aadInput,
    );
    const e2 = await encryptContent(
      plaintext.buffer as ArrayBuffer,
      dek,
      aadInput,
    );

    expect(e1.nonce).not.toEqual(e2.nonce);
  });
});

// ---------------------------------------------------------------------------
// Mapping Encryption (AES-256-GCM, nonce prefixed in blob)
// ---------------------------------------------------------------------------
describe("Mapping Encryption", () => {
  let mk: CryptoKey;
  const aadInput: MappingAADInput = {
    tenantId: "tenant-1",
    userId: "user-abc",
    mappingVersion: 1,
  };

  beforeAll(async () => {
    const mkBytes = generateMappingKeyBytes();
    mk = await importMK(mkBytes);
  });

  it("encrypt → decrypt roundtrip", async () => {
    const mapping = { PERSON_001: "Max Müller", LOC_001: "Zürich" };

    const blob = await encryptMapping(mapping, mk, aadInput);
    expect(blob.length).toBeGreaterThan(NONCE_BYTES);

    const decrypted = await decryptMapping(blob, mk, aadInput);
    expect(decrypted).toEqual(mapping);
  });

  it("blob structure: nonce(12) || ciphertext", async () => {
    const mapping = { key: "value" };
    const blob = await encryptMapping(mapping, mk, aadInput);

    // First 12 bytes = nonce
    const nonce = blob.slice(0, NONCE_BYTES);
    expect(nonce.length).toBe(NONCE_BYTES);

    // Remaining bytes = ciphertext + GCM tag
    const ciphertext = blob.slice(NONCE_BYTES);
    expect(ciphertext.length).toBeGreaterThan(0);
  });

  it("encrypt → decrypt preserves complex mapping", async () => {
    const mapping = {
      PERSON_001: "Max Müller",
      PERSON_002: "Anna Schmidt",
      LOC_001: "Zürich",
      MED_001: "Depression",
      REL_001: "Reformiert",
    };

    const blob = await encryptMapping(mapping, mk, aadInput);
    const decrypted = await decryptMapping(blob, mk, aadInput);
    expect(decrypted).toEqual(mapping);
  });

  it("decrypt with wrong MK throws", async () => {
    const mapping = { key: "value" };
    const blob = await encryptMapping(mapping, mk, aadInput);

    const wrongMkBytes = generateMappingKeyBytes();
    const wrongMk = await importMK(wrongMkBytes);

    await expect(decryptMapping(blob, wrongMk, aadInput)).rejects.toThrow();
  });

  it("decrypt with wrong AAD throws", async () => {
    const mapping = { key: "value" };
    const blob = await encryptMapping(mapping, mk, aadInput);

    const wrongAad: MappingAADInput = {
      tenantId: "wrong-tenant",
      userId: "user-abc",
      mappingVersion: 1,
    };

    await expect(decryptMapping(blob, mk, wrongAad)).rejects.toThrow();
  });

  it("decrypt with wrong mappingVersion throws", async () => {
    const mapping = { key: "value" };
    const blob = await encryptMapping(mapping, mk, aadInput);

    const wrongVersionAad: MappingAADInput = {
      ...aadInput,
      mappingVersion: 2,
    };

    await expect(
      decryptMapping(blob, mk, wrongVersionAad),
    ).rejects.toThrow();
  });

  it("blob too short throws (< 12 bytes)", async () => {
    await expect(
      decryptMapping(new Uint8Array(10), mk, aadInput),
    ).rejects.toThrow();
  });

  it("each encryption produces unique blob (different nonce)", async () => {
    const mapping = { same: "data" };
    const blob1 = await encryptMapping(mapping, mk, aadInput);
    const blob2 = await encryptMapping(mapping, mk, aadInput);

    // Different nonces → different blobs
    expect(blob1).not.toEqual(blob2);
    // But both decrypt to same data
    expect(await decryptMapping(blob1, mk, aadInput)).toEqual(mapping);
    expect(await decryptMapping(blob2, mk, aadInput)).toEqual(mapping);
  });
});

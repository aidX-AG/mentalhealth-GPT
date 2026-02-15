// lib/crypto/pairing.ts
// ============================================================================
// P-256 ECDH Pairing Protocol — WebCrypto-native
// Version: v1.0 – 2026-02-14
//
// Implements the ECDH key agreement and MK transfer for device pairing.
// Uses P-256 ECDH + HKDF-SHA-256 + AES-256-GCM — NO libsodium/WASM.
//
// SPEC-006 §7.1: QR-Payload parsing/building (200 byte limit, anti-fuzzing)
// SPEC-006 §7.3: ECDH P-256 + HKDF + AES-GCM key agreement
// SPEC-006 §6.3: Trust-Anchor (Desktop) flow
// SPEC-006 §6.4: New Device (Smartphone) flow
// ============================================================================

import { CryptoError } from "./aesgcm";
import {
  ECDH_CURVE,
  HKDF_INFO,
  NONCE_BYTES,
  PAIRING_QR_MAX_BYTES,
} from "./types";
import type { PairingQRPayload, EncryptedMKTransfer } from "./types";

// ---------------------------------------------------------------------------
// QR Payload (SPEC-006 §7.1)
// ---------------------------------------------------------------------------

/**
 * Parse and validate a QR code payload from a scanned pairing QR.
 * Used on the smartphone (new device) side.
 *
 * Validation:
 * - Anti-fuzzing: reject if > 200 bytes
 * - JSON parse with error handling
 * - v === 1 (forward-compat: v > 1 → "update app" message)
 * - Required fields: p, s, n (non-empty strings), t (number)
 * - Unknown fields: ignored (forward-compat)
 */
export function parsePairingQR(raw: string): PairingQRPayload {
  // Anti-fuzzing: reject oversized payloads before any parsing
  if (new TextEncoder().encode(raw).length > PAIRING_QR_MAX_BYTES) {
    throw new CryptoError(
      `QR payload exceeds ${PAIRING_QR_MAX_BYTES} byte limit`,
    );
  }

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new CryptoError("Invalid QR payload: not valid JSON");
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new CryptoError("Invalid QR payload: not an object");
  }

  // Version check
  if (typeof parsed.v !== "number") {
    throw new CryptoError("Invalid QR payload: missing version field");
  }
  if (parsed.v !== 1) {
    throw new CryptoError(
      "Unsupported pairing protocol version. Bitte App aktualisieren.",
    );
  }

  // Required fields
  if (typeof parsed.p !== "string" || parsed.p.length === 0) {
    throw new CryptoError("Invalid QR payload: missing pairing_id (p)");
  }
  if (typeof parsed.s !== "string" || parsed.s.length === 0) {
    throw new CryptoError("Invalid QR payload: missing pairing_secret (s)");
  }
  if (typeof parsed.n !== "string" || parsed.n.length === 0) {
    throw new CryptoError("Invalid QR payload: missing pairing_nonce (n)");
  }
  if (typeof parsed.t !== "number") {
    throw new CryptoError("Invalid QR payload: missing timestamp (t)");
  }

  return {
    v: 1,
    p: parsed.p,
    s: parsed.s,
    n: parsed.n,
    t: parsed.t,
  };
}

/**
 * Build a QR payload string for display as QR code.
 * Used on the desktop (trust-anchor) side after POST /v1/pairing/sessions.
 *
 * Returns compact JSON string (no whitespace) ≤ 200 bytes.
 * Suitable for react-qr-code: <QRCode value={buildPairingQR(...)} />
 */
export function buildPairingQR(params: {
  pairingId: string;
  pairingSecret: string;
  pairingNonce: string;
}): string {
  const payload = {
    v: 1,
    p: params.pairingId,
    s: params.pairingSecret,
    n: params.pairingNonce,
    t: Math.floor(Date.now() / 1000),
  };

  const json = JSON.stringify(payload);

  if (new TextEncoder().encode(json).length > PAIRING_QR_MAX_BYTES) {
    throw new CryptoError(
      `QR payload exceeds ${PAIRING_QR_MAX_BYTES} byte limit`,
    );
  }

  return json;
}

// ---------------------------------------------------------------------------
// ECDH Key Agreement (SPEC-006 §7.3)
// ---------------------------------------------------------------------------

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

/** Generate an ephemeral P-256 ECDH keypair. */
async function generateECDHKeyPair(): Promise<CryptoKeyPair> {
  return window.crypto.subtle.generateKey(
    { name: "ECDH", namedCurve: ECDH_CURVE },
    false, // non-extractable private key
    ["deriveBits"],
  );
}

/** Export a public key as raw bytes (65 bytes, uncompressed P-256 point). */
async function exportPublicKey(key: CryptoKey): Promise<Uint8Array> {
  const raw = await window.crypto.subtle.exportKey("raw", key);
  return new Uint8Array(raw);
}

/** Import a peer's raw public key as CryptoKey. */
async function importPeerPublicKey(raw: Uint8Array): Promise<CryptoKey> {
  return window.crypto.subtle.importKey(
    "raw",
    raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength),
    { name: "ECDH", namedCurve: ECDH_CURVE },
    false,
    [],
  );
}

/**
 * Derive an AES-256-GCM encryption key from ECDH shared secret + pairing_nonce.
 *
 * Steps (SPEC-006 §7.3):
 * 1. deriveBits(ECDH) → 256-bit shared secret
 * 2. importKey(shared, "HKDF") → HKDF base key
 * 3. deriveKey(HKDF-SHA-256, salt=pairingNonce, info="mhgpt-pairing-v1") → AES-GCM key
 *
 * The pairing_nonce serves as HKDF salt for Key Separation:
 * Each pairing session derives a unique key, even with identical ECDH keypairs.
 */
async function deriveEncKey(
  ownPrivateKey: CryptoKey,
  peerPublicKey: CryptoKey,
  pairingNonce: Uint8Array,
): Promise<CryptoKey> {
  // Step 1: ECDH shared secret (256 bits)
  const sharedBits = await window.crypto.subtle.deriveBits(
    { name: "ECDH", public: peerPublicKey },
    ownPrivateKey,
    256,
  );

  // Step 2: Import shared secret as HKDF base key
  const sharedSecretKey = await window.crypto.subtle.importKey(
    "raw",
    sharedBits,
    "HKDF",
    false,
    ["deriveKey"],
  );

  // Step 3: HKDF-SHA-256 → AES-256-GCM encryption key
  return window.crypto.subtle.deriveKey(
    {
      name: "HKDF",
      hash: "SHA-256",
      salt: pairingNonce.buffer.slice(
        pairingNonce.byteOffset,
        pairingNonce.byteOffset + pairingNonce.byteLength,
      ),
      info: HKDF_INFO,
    },
    sharedSecretKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

// ---------------------------------------------------------------------------
// Trust-Anchor Flow (Desktop — SPEC-006 §6.3)
// ---------------------------------------------------------------------------

/** Result of initiatePairing() — desktop side */
export interface PairingInitResult {
  /** Own ECDH public key (65 bytes, raw P-256) — NOT sent via QR, sent via API */
  publicKeyRaw: Uint8Array;

  /**
   * Encrypt MK for the peer device.
   * Called after receiving peer's public key from GET /v1/pairing/:id/response.
   *
   * @param mkBytes          Raw MK bytes (32 bytes, from exportMKForPairing)
   * @param peerPublicKeyRaw Peer's ECDH public key (65 bytes, from API response)
   * @param pairingNonce     Pairing nonce (16 bytes, from QR field `n`)
   * @returns                { iv, ciphertext } — send via POST /v1/pairing/:id/data
   */
  encryptMKForPeer: (
    mkBytes: Uint8Array,
    peerPublicKeyRaw: Uint8Array,
    pairingNonce: Uint8Array,
  ) => Promise<EncryptedMKTransfer>;
}

/**
 * Initiate pairing as the trust-anchor device (desktop).
 *
 * Generates an ephemeral ECDH keypair. Returns:
 * - publicKeyRaw: to be stored server-side (not in QR — QR has pairing_id/secret/nonce)
 * - encryptMKForPeer: closure that captures the private key for MK encryption
 *
 * The private key is held in the closure scope and GC'd after the closure is released.
 */
export async function initiatePairing(): Promise<PairingInitResult> {
  assertWebCrypto();

  const keyPair = await generateECDHKeyPair();
  const publicKeyRaw = await exportPublicKey(keyPair.publicKey);

  const encryptMKForPeer = async (
    mkBytes: Uint8Array,
    peerPublicKeyRaw: Uint8Array,
    pairingNonce: Uint8Array,
  ): Promise<EncryptedMKTransfer> => {
    const peerPublicKey = await importPeerPublicKey(peerPublicKeyRaw);
    const encKey = await deriveEncKey(
      keyPair.privateKey,
      peerPublicKey,
      pairingNonce,
    );

    const iv = new Uint8Array(NONCE_BYTES);
    window.crypto.getRandomValues(iv);

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv.buffer.slice(iv.byteOffset, iv.byteOffset + iv.byteLength),
      },
      encKey,
      mkBytes.buffer.slice(
        mkBytes.byteOffset,
        mkBytes.byteOffset + mkBytes.byteLength,
      ),
    );

    return { iv, ciphertext: new Uint8Array(ciphertext) };
  };

  return { publicKeyRaw, encryptMKForPeer };
}

// ---------------------------------------------------------------------------
// New Device Flow (Smartphone — SPEC-006 §6.4)
// ---------------------------------------------------------------------------

/** Result of respondToPairing() — smartphone side */
export interface PairingResponseResult {
  /** Own ECDH public key (65 bytes) — send via POST /v1/pairing/:id/response */
  publicKeyRaw: Uint8Array;

  /**
   * Decrypt MK from the trust-anchor device.
   * Called after fetching encrypted MK from GET /v1/pairing/:id/data.
   *
   * @param encrypted    { iv, ciphertext } from API response
   * @param pairingNonce Pairing nonce (16 bytes, from QR field `n`)
   * @returns            Raw MK bytes (32 bytes) — MUST be zeroed after wrapMK
   */
  decryptMKFromPeer: (
    encrypted: EncryptedMKTransfer,
    pairingNonce: Uint8Array,
  ) => Promise<Uint8Array>;
}

/**
 * Respond to pairing as the new device (smartphone).
 *
 * Note: peerPublicKeyRaw is NOT in the QR code — it's retrieved from the API
 * after the trust-anchor initiates pairing and stores its public key.
 * Actually, in our protocol the trust-anchor doesn't send its public key
 * at session creation time. Instead:
 *
 * 1. Trust-anchor creates pairing session → gets pairing_id/secret/nonce
 * 2. New device scans QR → sends its public key via POST /response
 * 3. Trust-anchor polls GET /response → gets new device's public key
 * 4. Trust-anchor derives key, encrypts MK, sends via POST /data
 * 5. New device fetches GET /data → decrypts MK
 *
 * So the new device doesn't need the trust-anchor's public key at scan time.
 * It needs it implicitly through the ECDH-derived key used by the trust-anchor
 * to encrypt the MK. But for decryption, the new device needs to derive the
 * SAME key, which requires the trust-anchor's public key.
 *
 * Protocol adjustment: The trust-anchor's public key can be included in the
 * POST /data payload alongside the encrypted MK, OR the new device can
 * receive it via GET /response (trust-anchor stores it when creating session).
 *
 * For now, we accept the peer public key as a parameter — the orchestration
 * layer (UI/hook) determines how to obtain it.
 */
export async function respondToPairing(
  peerPublicKeyRaw: Uint8Array,
): Promise<PairingResponseResult> {
  assertWebCrypto();

  const keyPair = await generateECDHKeyPair();
  const publicKeyRaw = await exportPublicKey(keyPair.publicKey);

  const decryptMKFromPeer = async (
    encrypted: EncryptedMKTransfer,
    pairingNonce: Uint8Array,
  ): Promise<Uint8Array> => {
    const peerPublicKey = await importPeerPublicKey(peerPublicKeyRaw);
    const encKey = await deriveEncKey(
      keyPair.privateKey,
      peerPublicKey,
      pairingNonce,
    );

    let mkBytes: ArrayBuffer;
    try {
      mkBytes = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: encrypted.iv.buffer.slice(
            encrypted.iv.byteOffset,
            encrypted.iv.byteOffset + encrypted.iv.byteLength,
          ),
        },
        encKey,
        encrypted.ciphertext.buffer.slice(
          encrypted.ciphertext.byteOffset,
          encrypted.ciphertext.byteOffset + encrypted.ciphertext.byteLength,
        ),
      );
    } catch (err) {
      throw new CryptoError("Failed to decrypt MK from peer", err);
    }

    return new Uint8Array(mkBytes);
  };

  return { publicKeyRaw, decryptMKFromPeer };
}

// lib/crypto/aad.ts
// ============================================================================
// AAD (Additional Authenticated Data) — Canonical Encoding
// Version: v1.0 – 2026-02-14
//
// Pipe-delimited byte sequences for AES-GCM context binding.
// Deterministic: same input always produces identical bytes.
//
// SPEC-002 §3.5: Canonical pipe-delimited AAD
// ============================================================================

import { CryptoError } from "./aesgcm";
import type { ContentAADInput, MappingAADInput } from "./types";

const encoder = new TextEncoder();

/**
 * Validate that a field value is non-empty and contains no pipe characters.
 * Pipes would break the canonical delimiter.
 */
function validateField(value: string, name: string): void {
  if (!value || value.length === 0) {
    throw new CryptoError(`AAD field "${name}" must be non-empty`);
  }
  if (value.includes("|")) {
    throw new CryptoError(
      `AAD field "${name}" must not contain pipe character`,
    );
  }
}

/**
 * Build content AAD: "v1|content|tenantId|objectId|mimeType|contentSizeBytes"
 *
 * Used for content encryption (object.enc). The objectId comes from the server
 * (init-upload response), ensuring the AAD is bound to a specific server-issued object.
 */
export function buildContentAAD(input: ContentAADInput): Uint8Array {
  validateField(input.tenantId, "tenantId");
  validateField(input.objectId, "objectId");
  validateField(input.mimeType, "mimeType");

  if (
    !Number.isFinite(input.contentSizeBytes) ||
    input.contentSizeBytes < 0
  ) {
    throw new CryptoError("AAD contentSizeBytes must be a non-negative finite number");
  }

  const sizeStr = String(Math.floor(input.contentSizeBytes));

  const canonical = [
    "v1",
    "content",
    input.tenantId,
    input.objectId,
    input.mimeType,
    sizeStr,
  ].join("|");

  return encoder.encode(canonical);
}

/**
 * Build mapping AAD: "v1|mapping|tenantId|userId|mappingVersion"
 *
 * Used for mapping encryption (mapping.enc). Version is included
 * to bind the encryption to a specific mapping revision.
 */
export function buildMappingAAD(input: MappingAADInput): Uint8Array {
  validateField(input.tenantId, "tenantId");
  validateField(input.userId, "userId");

  if (
    !Number.isFinite(input.mappingVersion) ||
    input.mappingVersion < 0
  ) {
    throw new CryptoError("AAD mappingVersion must be a non-negative finite number");
  }

  const canonical = [
    "v1",
    "mapping",
    input.tenantId,
    input.userId,
    String(Math.floor(input.mappingVersion)),
  ].join("|");

  return encoder.encode(canonical);
}

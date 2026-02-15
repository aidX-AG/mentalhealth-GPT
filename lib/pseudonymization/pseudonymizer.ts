// lib/pseudonymization/pseudonymizer.ts
// ============================================================================
// SPEC-007 §6, §9.2 — Pseudonymize / Depseudonymize
//
// O(1) token reuse via category-aware reverse index.
// Token escape integrated (§12).
// ============================================================================

import type { DetectedPII, PIICategory, PseudonymizationMapping } from "./types";
import { TOKEN_REGEX, TOKEN_OPEN, TOKEN_CLOSE } from "./types";
import { patternRegistry } from "./regex";
import { escapeTokenBrackets, unescapeTokenBrackets } from "./token-escape";

// ---------------------------------------------------------------------------
// Reuse Lookup Key (§6 — category-aware + normalized)
// ---------------------------------------------------------------------------

/**
 * Build a reuse key for the original_to_token index.
 * Key = `${category}::${normalizedOriginal}`
 *
 * Regex hits use pattern.normalize() for canonical form.
 * NER/dictionary hits use original.trim() as-is.
 */
function reuseLookupKey(
  category: PIICategory,
  original: string,
  patternId?: string,
): string {
  if (patternId) {
    const pattern = patternRegistry.get(patternId);
    if (pattern?.normalize) {
      return `${category}::${pattern.normalize(original)}`;
    }
  }
  return `${category}::${original.trim()}`;
}

// ---------------------------------------------------------------------------
// Token Creation
// ---------------------------------------------------------------------------

function getOrCreateToken(
  original: string,
  category: PIICategory,
  mapping: PseudonymizationMapping,
  detection: DetectedPII,
): string {
  const key = reuseLookupKey(category, original, detection.patternId);

  // O(1) lookup
  const existingToken = mapping.original_to_token[key];
  if (existingToken) return existingToken;

  // Create new token
  const counter = mapping.next_counter;
  const token = `${TOKEN_OPEN}${category}:${String(counter).padStart(3, "0")}${TOKEN_CLOSE}`;

  // Update both indexes
  mapping.entries[token] = {
    type: category,
    original,
    created_at: new Date().toISOString(),
    confidence: detection.confidence,
    source: detection.source,
  };
  mapping.original_to_token[key] = token;
  mapping.next_counter = counter + 1;

  return token;
}

// ---------------------------------------------------------------------------
// Create empty mapping
// ---------------------------------------------------------------------------

export function createMapping(): PseudonymizationMapping {
  const now = new Date().toISOString();
  return {
    version: 1,
    created_at: now,
    updated_at: now,
    entries: {},
    original_to_token: {},
    next_counter: 1,
  };
}

// ---------------------------------------------------------------------------
// Pseudonymize (§9.2)
// ---------------------------------------------------------------------------

/**
 * Replace accepted PII detections with tokens.
 * Processes detections in reverse order (end → start) to preserve offsets.
 *
 * @param text - Escaped input text
 * @param acceptedDetections - Detections the user accepted (from review)
 * @param existingMapping - Existing mapping or null for new
 * @returns Pseudonymized text + updated mapping
 */
export function pseudonymize(
  text: string,
  acceptedDetections: DetectedPII[],
  existingMapping: PseudonymizationMapping | null,
): { pseudonymized: string; mapping: PseudonymizationMapping } {
  const mapping = existingMapping
    ? { ...existingMapping, updated_at: new Date().toISOString() }
    : createMapping();

  // Assign tokens in forward (text) order so first PII gets :001
  const forwardSorted = [...acceptedDetections].sort((a, b) => a.start - b.start);
  const tokenByStart = new Map<number, string>();
  for (const detection of forwardSorted) {
    const token = getOrCreateToken(
      detection.original,
      detection.category,
      mapping,
      detection,
    );
    tokenByStart.set(detection.start, token);
  }

  // Replace in reverse order so offsets stay valid
  const reverseSorted = [...acceptedDetections].sort((a, b) => b.start - a.start);
  let result = text;
  for (const detection of reverseSorted) {
    const token = tokenByStart.get(detection.start)!;
    result = result.slice(0, detection.start) + token + result.slice(detection.end);
  }

  return { pseudonymized: result, mapping };
}

// ---------------------------------------------------------------------------
// Depseudonymize (§9.2)
// ---------------------------------------------------------------------------

/**
 * Replace tokens with original values from mapping.
 * Uses strict TOKEN_REGEX to only match well-formed tokens (§12.4).
 * Applies unescape after token replacement (§12).
 */
export function depseudonymize(
  text: string,
  mapping: PseudonymizationMapping,
): string {
  // Replace all tokens with originals
  const result = text.replace(
    TOKEN_REGEX,
    (token) => mapping.entries[token]?.original ?? token,
  );

  // Restore any escaped brackets from user input
  return unescapeTokenBrackets(result);
}

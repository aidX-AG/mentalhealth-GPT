// lib/pseudonymization/token-escape.ts
// ============================================================================
// SPEC-007 §12 — Token Escape & Guard
//
// Escapes literal ⟦⟧ in user input to prevent token injection / ambiguity.
// ============================================================================

import {
  TOKEN_OPEN,
  TOKEN_CLOSE,
  ESCAPE_OPEN,
  ESCAPE_CLOSE,
} from "./types";

/**
 * Escape literal ⟦ ⟧ characters in user input before detection.
 * Replaces them with visually similar but distinct Unicode characters
 * that will not be matched by the token regex.
 */
export function escapeTokenBrackets(text: string): string {
  return text
    .replace(new RegExp(TOKEN_OPEN, "g"), ESCAPE_OPEN)
    .replace(new RegExp(TOKEN_CLOSE, "g"), ESCAPE_CLOSE);
}

/**
 * Restore escaped brackets after depseudonymization.
 * Call this AFTER all tokens have been replaced with originals.
 */
export function unescapeTokenBrackets(text: string): string {
  return text
    .replace(new RegExp(ESCAPE_OPEN, "g"), TOKEN_OPEN)
    .replace(new RegExp(ESCAPE_CLOSE, "g"), TOKEN_CLOSE);
}

/**
 * Check whether text contains any literal token brackets.
 * Useful for pre-flight checks.
 */
export function containsTokenBrackets(text: string): boolean {
  return text.includes(TOKEN_OPEN) || text.includes(TOKEN_CLOSE);
}

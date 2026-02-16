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
  ESCAPE2_OPEN,
  ESCAPE2_CLOSE,
} from "./types";

/**
 * Escape literal ⟦ ⟧ characters in user input before detection.
 *
 * 2-step escape (§12.2):
 *   Step 1: ⦃ → ⦅, ⦄ → ⦆   (protect literal escape chars in user input)
 *   Step 2: ⟦ → ⦃, ⟧ → ⦄   (escape token brackets)
 *
 * This prevents collision if user input contains literal ⦃/⦄.
 */
export function escapeTokenBrackets(text: string): string {
  return text
    // Step 1: Protect literal escape characters first
    .replace(new RegExp(ESCAPE_OPEN, "g"), ESCAPE2_OPEN)
    .replace(new RegExp(ESCAPE_CLOSE, "g"), ESCAPE2_CLOSE)
    // Step 2: Escape token brackets
    .replace(new RegExp(TOKEN_OPEN, "g"), ESCAPE_OPEN)
    .replace(new RegExp(TOKEN_CLOSE, "g"), ESCAPE_CLOSE);
}

/**
 * Restore escaped brackets after depseudonymization.
 * Call this AFTER all tokens have been replaced with originals.
 *
 * 2-step unescape (reverse order):
 *   Step 1: ⦃ → ⟦, ⦄ → ⟧   (restore token brackets)
 *   Step 2: ⦅ → ⦃, ⦆ → ⦄   (restore literal escape chars)
 */
export function unescapeTokenBrackets(text: string): string {
  return text
    // Step 1: Restore token brackets
    .replace(new RegExp(ESCAPE_OPEN, "g"), TOKEN_OPEN)
    .replace(new RegExp(ESCAPE_CLOSE, "g"), TOKEN_CLOSE)
    // Step 2: Restore literal escape characters
    .replace(new RegExp(ESCAPE2_OPEN, "g"), ESCAPE_OPEN)
    .replace(new RegExp(ESCAPE2_CLOSE, "g"), ESCAPE_CLOSE);
}

/**
 * Check whether text contains any literal token brackets.
 * Useful for pre-flight checks.
 */
export function containsTokenBrackets(text: string): boolean {
  return text.includes(TOKEN_OPEN) || text.includes(TOKEN_CLOSE);
}

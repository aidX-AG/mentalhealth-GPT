// lib/pseudonymization/regex/index.ts
// ============================================================================
// SPEC-007 §3.8 — Pattern Registry & Detection Orchestration
// ============================================================================

import type { RegexPattern, DetectedPII } from "../types";
import { DEFAULT_CONTEXT_WINDOW } from "../types";
import { swissPatterns } from "./patterns-ch";
import { germanPatterns } from "./patterns-de";
import { austrianPatterns } from "./patterns-at";
import { usPatterns } from "./patterns-us";
import { latamPatterns } from "./patterns-latam";
import { universalPatterns } from "./patterns-universal";

// ---------------------------------------------------------------------------
// Registry: all patterns in one place
// ---------------------------------------------------------------------------

const ALL_PATTERNS: RegexPattern[] = [
  ...swissPatterns,
  ...germanPatterns,
  ...austrianPatterns,
  ...usPatterns,
  ...latamPatterns,
  ...universalPatterns,
];

/** Lookup by pattern ID for normalize/validate access from pseudonymizer. */
const patternById = new Map<string, RegexPattern>();
for (const p of ALL_PATTERNS) {
  patternById.set(p.id, p);
}

export { patternById as patternRegistry };

// ---------------------------------------------------------------------------
// Context Check (§3.8)
// ---------------------------------------------------------------------------

function checkContext(
  text: string,
  start: number,
  end: number,
  pattern: RegexPattern,
): boolean {
  if (!pattern.contextRequired) return true;
  const window = pattern.contextWindow ?? DEFAULT_CONTEXT_WINDOW;
  const before = text.slice(Math.max(0, start - window), start);
  const after = text.slice(end, Math.min(text.length, end + window));
  const context = before + after;
  return pattern.contextRequired.test(context);
}

// ---------------------------------------------------------------------------
// Detect all regex matches in text
// ---------------------------------------------------------------------------

/**
 * Run all regex patterns against text.
 * Returns DetectedPII[] with source="regex", confidence=1.0.
 *
 * For each match:
 * 1. Check context (if contextRequired is set)
 * 2. Normalize (if normalize fn exists)
 * 3. Validate (if validate fn exists)
 * 4. If all pass → add to results
 */
export function detectRegex(text: string): DetectedPII[] {
  const results: DetectedPII[] = [];

  for (const pattern of ALL_PATTERNS) {
    // Clone regex to reset lastIndex (important for /g patterns)
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const original = match[0];

      // 1. Context check
      if (!checkContext(text, start, end, pattern)) continue;

      // 2. Normalize + Validate
      if (pattern.validate) {
        const normalized = pattern.normalize
          ? pattern.normalize(original)
          : original;
        if (!pattern.validate(normalized)) continue;
      }

      results.push({
        category: pattern.category,
        original,
        start,
        end,
        confidence: 1.0,
        source: "regex",
        patternId: pattern.id,
        defaultAccepted: true,
      });
    }
  }

  return results;
}

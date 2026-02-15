// lib/pseudonymization/types.ts
// ============================================================================
// SPEC-007 v1.2 — Pseudonymization Types & Constants
// ============================================================================

// ---------------------------------------------------------------------------
// PII Categories (§2)
// ---------------------------------------------------------------------------

export type PIICategory =
  | "PERSON"
  | "ORT"
  | "ORG"
  | "DATUM"
  | "EMAIL"
  | "TELEFON"
  | "SOZIALVERS"
  | "IBAN"
  | "STEUERNR"
  | "PLZ"
  | "DIAGNOSE"
  | "MEDIKAMENT"
  | "THERAPIE";

/** All valid PII category values (for runtime validation). */
export const PII_CATEGORIES: readonly PIICategory[] = [
  "PERSON",
  "ORT",
  "ORG",
  "DATUM",
  "EMAIL",
  "TELEFON",
  "SOZIALVERS",
  "IBAN",
  "STEUERNR",
  "PLZ",
  "DIAGNOSE",
  "MEDIKAMENT",
  "THERAPIE",
] as const;

// ---------------------------------------------------------------------------
// Detection Result (§9.1)
// ---------------------------------------------------------------------------

export interface DetectedPII {
  category: PIICategory;
  original: string;
  start: number;
  end: number;
  confidence: number;
  source: "regex" | "ner" | "dictionary";
  patternId?: string;
  defaultAccepted: boolean;
}

// ---------------------------------------------------------------------------
// Mapping Structure (§6)
// ---------------------------------------------------------------------------

export interface MappingEntry {
  type: PIICategory;
  original: string;
  created_at: string;
  confidence: number;
  source: "regex" | "ner" | "dictionary" | "manual";
}

export interface PseudonymizationMapping {
  version: 1;
  created_at: string;
  updated_at: string;
  entries: Record<string, MappingEntry>;
  original_to_token: Record<string, string>;
  next_counter: number;
}

// ---------------------------------------------------------------------------
// Regex Pattern Registry (§3.8)
// ---------------------------------------------------------------------------

export interface RegexPattern {
  id: string;
  category: PIICategory;
  regex: RegExp;
  regions: string[];
  normalize?: (match: string) => string;
  validate?: (normalized: string) => boolean;
  contextRequired?: RegExp;
  contextWindow?: number;
  priority: number;
}

// ---------------------------------------------------------------------------
// NER Types (§4)
// ---------------------------------------------------------------------------

export interface NEREntity {
  entity: string;       // "B-PER", "I-PER", "B-LOC", etc.
  score: number;
  word: string;
  start: number;
  end: number;
}

export type NERStatus = "idle" | "loading" | "ready" | "degraded";

/** Messages from main thread → NER worker */
export type NERWorkerRequest =
  | { type: "init" }
  | { type: "detect"; text: string; requestId: string };

/** Messages from NER worker → main thread */
export type NERWorkerResponse =
  | { type: "ready" }
  | { type: "progress"; percent: number }
  | { type: "result"; requestId: string; entities: NEREntity[] }
  | { type: "error"; message: string };

// ---------------------------------------------------------------------------
// Dictionary Types (§5)
// ---------------------------------------------------------------------------

export type DictionaryCategory = "DIAGNOSE" | "MEDIKAMENT" | "THERAPIE";

export interface DictionaryTerm {
  term: string;
  category: DictionaryCategory;
  language: string;
}

// ---------------------------------------------------------------------------
// Confidence Thresholds (§4.3, §8.2)
// ---------------------------------------------------------------------------

export const NER_CONFIDENCE_THRESHOLD = 0.60;
export const NER_HIGH_CONFIDENCE = 0.85;

// ---------------------------------------------------------------------------
// Detection Source Priority (§11) — lower = higher priority
// ---------------------------------------------------------------------------

export const SOURCE_PRIORITY: Record<DetectedPII["source"], number> = {
  regex: 0,
  ner: 1,
  dictionary: 2,
};

/**
 * Categories where regex is authoritative (structural patterns with checksums).
 * For entity categories (PERSON, ORT, ORG), NER is authoritative — regex
 * gets downgraded to NER priority so the longer, context-aware NER span wins.
 */
export const STRUCTURED_CATEGORIES: ReadonlySet<PIICategory> = new Set<PIICategory>([
  "DATUM",
  "EMAIL",
  "TELEFON",
  "SOZIALVERS",
  "IBAN",
  "STEUERNR",
  "PLZ",
]);

// ---------------------------------------------------------------------------
// Context Window (§3.8)
// ---------------------------------------------------------------------------

export const DEFAULT_CONTEXT_WINDOW = 30;

// ---------------------------------------------------------------------------
// Token Format (§2, §12.4)
// ---------------------------------------------------------------------------

/** Strict regex matching well-formed pseudonymization tokens. */
export const TOKEN_REGEX =
  /⟦(PERSON|ORT|ORG|DATUM|EMAIL|TELEFON|SOZIALVERS|IBAN|STEUERNR|PLZ|DIAGNOSE|MEDIKAMENT|THERAPIE):\d{3}⟧/g;

/** Unicode brackets used for tokens. */
export const TOKEN_OPEN = "⟦";   // U+27E6
export const TOKEN_CLOSE = "⟧";  // U+27E7

/** Escape replacements — Level 1 (§12.2): ⟦⟧ → ⦃⦄ */
export const ESCAPE_OPEN = "\u2983";   // ⦃ LEFT WHITE CURLY BRACKET
export const ESCAPE_CLOSE = "\u2984";  // ⦄ RIGHT WHITE CURLY BRACKET

/** Escape replacements — Level 2 (§12.2): ⦃⦄ → ⦅⦆ (protects literal ⦃⦄ in user input) */
export const ESCAPE2_OPEN = "\u2985";  // ⦅ LEFT WHITE PARENTHESIS
export const ESCAPE2_CLOSE = "\u2986"; // ⦆ RIGHT WHITE PARENTHESIS

// ---------------------------------------------------------------------------
// Model Config (§4.5)
// ---------------------------------------------------------------------------

export const MODEL_CONFIG = {
  baseUrl: "https://models.mentalhealth-gpt.ch/ner/distilbert-multilingual-cased-ner-hrl",
  version: "v1.0.0",
  manifestHash: "", // Set after initial model deployment
} as const;

export const DOWNLOAD_CONFIG = {
  timeoutMs: 120_000,
  maxRetries: 2,
  retryDelayMs: 3_000,
} as const;

// ---------------------------------------------------------------------------
// NER Entity → PII Category mapping (§4.2)
// ---------------------------------------------------------------------------

export const NER_ENTITY_MAP: Record<string, PIICategory> = {
  PER: "PERSON",
  LOC: "ORT",
  ORG: "ORG",
};

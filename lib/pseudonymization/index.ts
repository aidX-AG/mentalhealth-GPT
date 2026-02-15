// lib/pseudonymization/index.ts
// ============================================================================
// SPEC-007 — Barrel Export
// ============================================================================

// Types
export type {
  PIICategory,
  DetectedPII,
  PseudonymizationMapping,
  MappingEntry,
  RegexPattern,
  DictionaryCategory,
  NERStatus,
} from "./types";

export {
  PII_CATEGORIES,
  TOKEN_REGEX,
  TOKEN_OPEN,
  TOKEN_CLOSE,
  ESCAPE_OPEN,
  ESCAPE_CLOSE,
  ESCAPE2_OPEN,
  ESCAPE2_CLOSE,
  NER_CONFIDENCE_THRESHOLD,
  NER_HIGH_CONFIDENCE,
  SOURCE_PRIORITY,
  STRUCTURED_CATEGORIES,
} from "./types";

// Token escape (§12)
export { escapeTokenBrackets, unescapeTokenBrackets, containsTokenBrackets } from "./token-escape";

// Regex detection (Layer 1)
export { detectRegex } from "./regex";
export { patternRegistry } from "./regex";

// Dictionary detection (Layer 3)
export { detectDictionary } from "./dictionary";

// Detector (3-layer orchestration + merge)
export { detectAll, mergeDetections } from "./detector";

// Pseudonymizer (§9.2)
export { pseudonymize, depseudonymize, createMapping } from "./pseudonymizer";

// NER client (Layer 2)
export { NERClient } from "./ner-client";

// NER singleton (§4.4 — globalThis lifecycle)
export {
  subscribe as nerSubscribe,
  ensureReady as nerEnsureReady,
  detect as nerDetect,
  getStatus as nerGetStatus,
  getProgress as nerGetProgress,
  destroy as nerDestroy,
} from "./ner-singleton";
export type { NERSingletonListener } from "./ner-singleton";

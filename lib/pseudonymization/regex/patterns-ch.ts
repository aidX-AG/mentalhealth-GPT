// lib/pseudonymization/regex/patterns-ch.ts
// ============================================================================
// SPEC-007 §3 — Swiss PII Patterns
// ============================================================================

import type { RegexPattern } from "../types";
import {
  normalizeAHV,
  validateAHV,
  normalizePhone,
  validateSwissPhone,
} from "./validators";

export const swissPatterns: RegexPattern[] = [
  // AHV (§3.1.1)
  {
    id: "ch-ahv",
    category: "SOZIALVERS",
    regex: /\b756[.\s-]?\d{4}[.\s-]?\d{4}[.\s-]?\d{2}\b/g,
    regions: ["CH"],
    normalize: normalizeAHV,
    validate: validateAHV,
    priority: 0,
  },

  // Swiss phone (§3.2.1)
  {
    id: "ch-phone",
    category: "TELEFON",
    regex: /(?:\+41|0041|0)\s?\(?\d{2}\)?\s?[\d\s.\-]{7,12}/g,
    regions: ["CH"],
    normalize: normalizePhone,
    validate: validateSwissPhone,
    priority: 1,
  },

  // Swiss PLZ + City (§3.6.1)
  {
    id: "ch-plz",
    category: "PLZ",
    regex: /\b[1-9]\d{3}\s+[A-ZÄÖÜ][a-zäöüéèê]+(?:\s[A-ZÄÖÜ][a-zäöüéèê]+)?\b/g,
    regions: ["CH"],
    priority: 5,
  },

  // Swiss UID (§3.7.1)
  {
    id: "ch-uid",
    category: "STEUERNR",
    regex: /\bCHE[.\s-]?\d{3}[.\s-]?\d{3}[.\s-]?\d{3}\b/g,
    regions: ["CH"],
    priority: 2,
  },
];

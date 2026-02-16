// lib/pseudonymization/regex/patterns-at.ts
// ============================================================================
// SPEC-007 §3 — Austrian PII Patterns
// ============================================================================

import type { RegexPattern } from "../types";
import { normalizePhone, digitsOnly } from "./validators";

export const austrianPatterns: RegexPattern[] = [
  // Austrian Sozialversicherungsnummer (§3.1.3)
  {
    id: "at-svn",
    category: "SOZIALVERS",
    regex: /\b\d{4}\s?\d{6}\b/g,
    regions: ["AT"],
    normalize: digitsOnly,
    validate: (digits) => {
      if (digits.length !== 10) return false;
      // Date portion (last 6 digits) must be a plausible date
      const day = parseInt(digits.slice(4, 6), 10);
      const month = parseInt(digits.slice(6, 8), 10);
      if (day < 1 || day > 31 || month < 1 || month > 12) return false;
      return true;
    },
    priority: 0,
  },

  // Austrian phone (§3.2.3)
  {
    id: "at-phone",
    category: "TELEFON",
    regex: /(?:\+43|0043|0)\s?\(?\d{1,4}\)?\s?[\d\s.\-]{5,12}/g,
    regions: ["AT"],
    normalize: normalizePhone,
    validate: (normalized) => {
      const digits = digitsOnly(normalized);
      return digits.length >= 9 && digits.length <= 13;
    },
    priority: 1,
  },

  // Austrian PLZ + City (§3.6.3)
  {
    id: "at-plz",
    category: "PLZ",
    regex: /\b[1-9]\d{3}\s+[A-ZÄÖÜ][a-zäöüéèê]+(?:\s[A-ZÄÖÜ][a-zäöüéèê]+)?\b/g,
    regions: ["AT"],
    priority: 5,
  },

  // Austrian UID (§3.7.3)
  {
    id: "at-uid",
    category: "STEUERNR",
    regex: /\bATU\d{8}\b/g,
    regions: ["AT"],
    priority: 2,
  },
];

// lib/pseudonymization/regex/patterns-de.ts
// ============================================================================
// SPEC-007 §3 — German PII Patterns
// ============================================================================

import type { RegexPattern } from "../types";
import {
  normalizePhone,
  digitsOnly,
  validateGermanSteuerID,
} from "./validators";

export const germanPatterns: RegexPattern[] = [
  // German Sozialversicherungsnummer (§3.1.2)
  {
    id: "de-svn",
    category: "SOZIALVERS",
    regex: /\b\d{2}\s?\d{6}\s?[A-Z]\s?\d{3}\b/g,
    regions: ["DE"],
    normalize: (raw) => raw.replace(/\s/g, ""),
    validate: (normalized) => {
      // Area (first 2 digits) in valid range, letter present
      if (normalized.length !== 12) return false;
      const datePart = normalized.slice(2, 8);
      const day = parseInt(datePart.slice(0, 2), 10);
      const month = parseInt(datePart.slice(2, 4), 10);
      if (day < 1 || day > 31 || month < 1 || month > 12) return false;
      return /^[A-Z]$/.test(normalized[8]);
    },
    priority: 0,
  },

  // German phone (§3.2.2)
  {
    id: "de-phone",
    category: "TELEFON",
    regex: /(?:\+49|0049|0)\s?\(?\d{2,5}\)?\s?[\d\s.\-]{5,12}/g,
    regions: ["DE"],
    normalize: normalizePhone,
    validate: (normalized) => {
      const digits = digitsOnly(normalized);
      return digits.length >= 10 && digits.length <= 13;
    },
    priority: 1,
  },

  // German PLZ + City (§3.6.2)
  {
    id: "de-plz",
    category: "PLZ",
    regex: /\b(?:0[1-9]|[1-9]\d)\d{3}\s+[A-ZÄÖÜ][a-zäöüß]+(?:\s(?:am|an|im|ob)\s[A-ZÄÖÜ][a-zäöüß]+)?\b/g,
    regions: ["DE"],
    priority: 5,
  },

  // German Steuer-ID (§3.7.2)
  {
    id: "de-steuerid",
    category: "STEUERNR",
    regex: /\b\d{2}\s?\d{3}\s?\d{3}\s?\d{3}\b/g,
    regions: ["DE"],
    normalize: digitsOnly,
    validate: validateGermanSteuerID,
    priority: 2,
  },
];

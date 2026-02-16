// lib/pseudonymization/regex/patterns-us.ts
// ============================================================================
// SPEC-007 §3 — US PII Patterns
// ============================================================================

import type { RegexPattern } from "../types";
import {
  normalizeSSN,
  validateUSSSN,
  normalizePhone,
  validateUSPhone,
  digitsOnly,
} from "./validators";

export const usPatterns: RegexPattern[] = [
  // US SSN (§3.1.4)
  {
    id: "us-ssn",
    category: "SOZIALVERS",
    regex: /\b(?!000|666|9\d{2})\d{3}[-\s]?(?!00)\d{2}[-\s]?(?!0{4})\d{4}\b/g,
    regions: ["US"],
    normalize: normalizeSSN,
    validate: validateUSSSN,
    priority: 0,
  },

  // US/Canada phone (§3.2.4)
  {
    id: "us-phone",
    category: "TELEFON",
    regex: /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g,
    regions: ["US", "CA"],
    normalize: normalizePhone,
    validate: validateUSPhone,
    priority: 1,
  },

  // US ZIP (§3.6.4)
  {
    id: "us-zip",
    category: "PLZ",
    regex: /\b\d{5}(?:-\d{4})?\b/g,
    regions: ["US"],
    contextRequired: /(?:ZIP|zip|Zip|\b[A-Z]{2}\s*\d{5}|,\s*[A-Z]{2}\s)/,
    contextWindow: 40,
    priority: 5,
  },

  // US EIN (§3.7.4)
  {
    id: "us-ein",
    category: "STEUERNR",
    regex: /\b\d{2}-\d{7}\b/g,
    regions: ["US"],
    contextRequired: /(?:EIN|Tax\s*ID|employer\s*identification|tax\s*identification)/i,
    contextWindow: 50,
    normalize: digitsOnly,
    priority: 2,
  },
];

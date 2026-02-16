// lib/pseudonymization/regex/patterns-universal.ts
// ============================================================================
// SPEC-007 §3 — Universal PII Patterns (IBAN, email, dates, E.164)
// ============================================================================

import type { RegexPattern } from "../types";
import { normalizeIBAN, validateIBAN, normalizePhone, validateE164 } from "./validators";

// Month names for written date patterns (§3.5.4)
const DE_MONTHS = "Januar|Februar|März|April|Mai|Juni|Juli|August|September|Oktober|November|Dezember|Jan|Feb|Mär|Apr|Jun|Jul|Aug|Sep|Okt|Nov|Dez";
const FR_MONTHS = "janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre|janv|févr|avr|juil|sept|oct|nov|déc";
const EN_MONTHS = "January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec";
const ES_MONTHS = "enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre";
const ALL_MONTHS = `${DE_MONTHS}|${FR_MONTHS}|${EN_MONTHS}|${ES_MONTHS}`;

export const universalPatterns: RegexPattern[] = [
  // IBAN — all countries, Mod-97 validated (§3.3)
  {
    id: "iban-mod97",
    category: "IBAN",
    regex: /\b[A-Z]{2}\d{2}\s?[\dA-Z]{4}(?:\s?[\dA-Z]{4}){2,7}(?:\s?[\dA-Z]{1,4})?\b/g,
    regions: ["*"],
    normalize: normalizeIBAN,
    validate: validateIBAN,
    priority: 0,
  },

  // Email (§3.4)
  {
    id: "email",
    category: "EMAIL",
    regex: /\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}\b/g,
    regions: ["*"],
    priority: 0,
  },

  // European date DD.MM.YYYY / DD/MM/YYYY (§3.5.1)
  {
    id: "date-eu",
    category: "DATUM",
    regex: /\b\d{1,2}[./]\s?\d{1,2}[./]\s?\d{2,4}\b/g,
    regions: ["*"],
    priority: 2,
  },

  // US date MM/DD/YYYY (§3.5.2) — lower priority than EU date
  {
    id: "date-us",
    category: "DATUM",
    regex: /\b(?:0?[1-9]|1[0-2])\/(?:0?[1-9]|[12]\d|3[01])\/\d{2,4}\b/g,
    regions: ["US"],
    priority: 3,
  },

  // ISO 8601 (§3.5.3)
  {
    id: "date-iso",
    category: "DATUM",
    regex: /\b\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])\b/g,
    regions: ["*"],
    priority: 1,
  },

  // Written dates — multilingual (§3.5.4)
  // "15. Februar 2026", "February 15, 2026", "15 de febrero de 2026"
  {
    id: "date-written",
    category: "DATUM",
    regex: new RegExp(
      `\\b(?:\\d{1,2}\\.?\\s*(?:${ALL_MONTHS})\\s*\\d{2,4}|(?:${ALL_MONTHS})\\s*\\d{1,2}(?:st|nd|rd|th)?,?\\s*\\d{2,4}|\\d{1,2}\\s+de\\s+(?:${ES_MONTHS})\\s+de\\s+\\d{2,4})\\b`,
      "gi",
    ),
    regions: ["*"],
    priority: 0,
  },

  // Generic international phone E.164 fallback (§3.2.6)
  {
    id: "phone-e164",
    category: "TELEFON",
    regex: /\+\d{1,3}\s?\(?\d{1,5}\)?\s?[\d\s.\-]{6,14}/g,
    regions: ["*"],
    normalize: normalizePhone,
    validate: validateE164,
    priority: 10, // Lowest priority — only matches if no country-specific pattern hit
  },
];

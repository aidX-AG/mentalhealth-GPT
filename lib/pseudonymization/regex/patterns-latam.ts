// lib/pseudonymization/regex/patterns-latam.ts
// ============================================================================
// SPEC-007 §3 — Latin America PII Patterns
// ============================================================================

import type { RegexPattern } from "../types";
import {
  normalizePhone,
  normalizeCPF,
  validateCPF,
  normalizeCUIT,
  validateCUIT,
  digitsOnly,
  validateE164,
} from "./validators";

export const latamPatterns: RegexPattern[] = [
  // Brazil CPF (§3.7.5)
  {
    id: "br-cpf",
    category: "STEUERNR",
    regex: /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g,
    regions: ["BR"],
    normalize: normalizeCPF,
    validate: validateCPF,
    priority: 0,
  },

  // Brazil CNPJ (§3.7.5)
  {
    id: "br-cnpj",
    category: "STEUERNR",
    regex: /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g,
    regions: ["BR"],
    normalize: digitsOnly,
    priority: 1,
  },

  // Argentina CUIT (§3.7.5)
  {
    id: "ar-cuit",
    category: "STEUERNR",
    regex: /\b\d{2}-\d{8}-\d{1}\b/g,
    regions: ["AR"],
    normalize: normalizeCUIT,
    validate: validateCUIT,
    priority: 0,
  },

  // Mexico RFC (§3.7.5)
  {
    id: "mx-rfc",
    category: "STEUERNR",
    regex: /\b[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}\b/g,
    regions: ["MX"],
    priority: 1,
  },

  // Colombia NIT (§3.7.5)
  {
    id: "co-nit",
    category: "STEUERNR",
    regex: /\b\d{9}-\d{1}\b/g,
    regions: ["CO"],
    priority: 1,
  },

  // Latin America phone (§3.2.5)
  {
    id: "latam-phone",
    category: "TELEFON",
    regex: /\+(?:52|55|54|57|56|51)\s?\(?\d{1,4}\)?\s?[\d\s.\-]{7,12}/g,
    regions: ["MX", "BR", "AR", "CO", "CL", "PE"],
    normalize: normalizePhone,
    validate: validateE164,
    priority: 2,
  },

  // Brazil CEP (§3.6.6)
  {
    id: "br-cep",
    category: "PLZ",
    regex: /\b\d{5}-?\d{3}\b/g,
    regions: ["BR"],
    contextRequired: /(?:CEP|cep|C\.?E\.?P\.?)/i,
    contextWindow: 30,
    priority: 5,
  },

  // Mexico CP (§3.6.5)
  {
    id: "mx-cp",
    category: "PLZ",
    regex: /\b(?:C\.?P\.?\s?)?\d{5}\b/g,
    regions: ["MX"],
    contextRequired: /(?:C\.?P\.?|[Cc]ódigo\s*[Pp]ostal|[Cc]olonia)/,
    contextWindow: 30,
    priority: 5,
  },
];

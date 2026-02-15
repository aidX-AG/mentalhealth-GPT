// lib/pseudonymization/regex/validators.ts
// ============================================================================
// SPEC-007 §3 — Checksum & Plausibility Validators
//
// Pure functions: normalize → validate. No side effects.
// ============================================================================

// ---------------------------------------------------------------------------
// Normalization helpers
// ---------------------------------------------------------------------------

/** Strip all non-digit characters. */
export function digitsOnly(s: string): string {
  return s.replace(/\D/g, "");
}

/** Strip spaces, dots, hyphens. */
export function stripSeparators(s: string): string {
  return s.replace(/[\s.\-]/g, "");
}

/** Strip spaces only. */
export function stripSpaces(s: string): string {
  return s.replace(/\s/g, "");
}

// ---------------------------------------------------------------------------
// EAN-13 Checksum (Swiss AHV — §3.1.1)
// ---------------------------------------------------------------------------

/**
 * Validate EAN-13 checksum.
 * Weights alternate ×1, ×3 for first 12 digits; check digit makes sum mod 10 = 0.
 */
export function validateEAN13(digits: string): boolean {
  if (digits.length !== 13 || !/^\d{13}$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 13; i++) {
    const d = parseInt(digits[i], 10);
    sum += i % 2 === 0 ? d : d * 3;
  }
  return sum % 10 === 0;
}

/**
 * Normalize and validate Swiss AHV number.
 * Input: "756.1234.5678.97" or "756 1234 5678 97" etc.
 * Returns true if 13-digit number starting with 756 passes EAN-13 checksum.
 */
export function validateAHV(raw: string): boolean {
  const digits = digitsOnly(raw);
  if (digits.length !== 13) return false;
  if (!digits.startsWith("756")) return false;
  return validateEAN13(digits);
}

export function normalizeAHV(raw: string): string {
  return digitsOnly(raw);
}

// ---------------------------------------------------------------------------
// IBAN Mod-97 (§3.3)
// ---------------------------------------------------------------------------

/** Country-specific IBAN lengths (ISO 13616). */
const IBAN_LENGTHS: Record<string, number> = {
  AD: 24, AE: 23, AL: 28, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22,
  BH: 22, BR: 29, BY: 28, CH: 21, CR: 22, CY: 28, CZ: 24, DE: 22,
  DK: 18, DO: 28, EE: 20, EG: 29, ES: 24, FI: 18, FO: 18, FR: 27,
  GB: 22, GE: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21, HU: 28,
  IE: 22, IL: 23, IQ: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20,
  LB: 28, LC: 32, LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24,
  ME: 22, MK: 19, MR: 27, MT: 31, MU: 30, MX: 18, NL: 18, NO: 15,
  PK: 24, PL: 28, PS: 29, PT: 25, QA: 29, RO: 24, RS: 22, SA: 24,
  SC: 31, SE: 24, SI: 19, SK: 24, SM: 27, ST: 25, SV: 28, TL: 23,
  TN: 24, TR: 26, UA: 29, VA: 22, VG: 24, XK: 20,
};

/**
 * Mod 97 of an arbitrary-length numeric string.
 * Processes digit-by-digit to avoid BigInt / precision issues.
 */
export function mod97(numStr: string): number {
  let remainder = 0;
  for (let i = 0; i < numStr.length; i++) {
    remainder = (remainder * 10 + parseInt(numStr[i], 10)) % 97;
  }
  return remainder;
}

/**
 * Normalize IBAN: strip spaces, uppercase.
 */
export function normalizeIBAN(raw: string): string {
  return raw.replace(/\s/g, "").toUpperCase();
}

/**
 * Validate IBAN per ISO 13616:
 * 1. Strip spaces, uppercase
 * 2. Check country-specific length
 * 3. Move first 4 chars to end
 * 4. Convert letters → numbers (A=10..Z=35)
 * 5. Mod 97 must equal 1
 */
export function validateIBAN(raw: string): boolean {
  const iban = normalizeIBAN(raw);
  const country = iban.slice(0, 2);
  const expectedLen = IBAN_LENGTHS[country];

  if (!expectedLen) return false;
  if (iban.length !== expectedLen) return false;
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) return false;

  // Rearrange: move first 4 to end
  const rearranged = iban.slice(4) + iban.slice(0, 4);

  // Convert letters to numbers
  const numeric = rearranged.replace(/[A-Z]/g, (c) =>
    String(c.charCodeAt(0) - 55),
  );

  return mod97(numeric) === 1;
}

// ---------------------------------------------------------------------------
// US SSN (§3.1.4)
// ---------------------------------------------------------------------------

export function normalizeSSN(raw: string): string {
  return digitsOnly(raw);
}

/**
 * Validate US SSN structure (post-2011 randomization rules).
 * Area ≠ 000/666/9xx, group ≠ 00, serial ≠ 0000.
 */
export function validateUSSSN(raw: string): boolean {
  const digits = normalizeSSN(raw);
  if (digits.length !== 9) return false;

  const area = parseInt(digits.slice(0, 3), 10);
  const group = parseInt(digits.slice(3, 5), 10);
  const serial = parseInt(digits.slice(5, 9), 10);

  if (area === 0 || area === 666) return false;
  if (area >= 900) return false;
  if (group === 0) return false;
  if (serial === 0) return false;

  return true;
}

// ---------------------------------------------------------------------------
// Brazilian CPF (§3.7.5)
// ---------------------------------------------------------------------------

export function normalizeCPF(raw: string): string {
  return digitsOnly(raw);
}

/**
 * Validate Brazilian CPF check digits.
 * 11-digit number with 2 check digits at the end.
 */
export function validateCPF(raw: string): boolean {
  const digits = normalizeCPF(raw);
  if (digits.length !== 11) return false;

  // Reject all-same digits (e.g., 111.111.111-11)
  if (/^(\d)\1{10}$/.test(digits)) return false;

  // First check digit
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i], 10) * (10 - i);
  }
  let check1 = (sum * 10) % 11;
  if (check1 === 10) check1 = 0;
  if (check1 !== parseInt(digits[9], 10)) return false;

  // Second check digit
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i], 10) * (11 - i);
  }
  let check2 = (sum * 10) % 11;
  if (check2 === 10) check2 = 0;
  if (check2 !== parseInt(digits[10], 10)) return false;

  return true;
}

// ---------------------------------------------------------------------------
// Argentine CUIT (§3.7.5)
// ---------------------------------------------------------------------------

export function normalizeCUIT(raw: string): string {
  return digitsOnly(raw);
}

/**
 * Validate Argentine CUIT verification digit.
 * Format: XX-XXXXXXXX-X (11 digits)
 */
export function validateCUIT(raw: string): boolean {
  const digits = normalizeCUIT(raw);
  if (digits.length !== 11) return false;

  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i], 10) * weights[i];
  }
  const remainder = sum % 11;
  let check: number;
  if (remainder === 0) check = 0;
  else if (remainder === 1) check = 9; // special case for type 23
  else check = 11 - remainder;

  return check === parseInt(digits[10], 10);
}

// ---------------------------------------------------------------------------
// Phone Plausibility (§3.2)
// ---------------------------------------------------------------------------

export function normalizePhone(raw: string): string {
  return raw.replace(/[\s()\-.]/g, "");
}

/**
 * Check phone number plausibility based on digit count.
 * E.164: country code + subscriber = 7-15 digits total.
 */
export function validatePhonePlausibility(
  normalized: string,
  minDigits: number,
  maxDigits: number,
): boolean {
  const digits = digitsOnly(normalized);
  return digits.length >= minDigits && digits.length <= maxDigits;
}

/**
 * Swiss phone: 10 digits (national 0xx) or 11 digits (+41xx).
 */
export function validateSwissPhone(raw: string): boolean {
  const normalized = normalizePhone(raw);
  const digits = digitsOnly(normalized);

  if (normalized.startsWith("+41") || normalized.startsWith("0041")) {
    return digits.length === 11;
  }
  if (normalized.startsWith("0")) {
    return digits.length === 10;
  }
  return false;
}

/**
 * US/Canada phone: exactly 10 digits after +1 prefix.
 * Area code must not start with 0 or 1.
 */
export function validateUSPhone(raw: string): boolean {
  const normalized = normalizePhone(raw);
  const digits = digitsOnly(normalized);

  // Strip leading 1 for +1 prefix
  const national = digits.startsWith("1") && digits.length === 11
    ? digits.slice(1)
    : digits;

  if (national.length !== 10) return false;

  // Area code (first 3 digits) must not start with 0 or 1
  const areaFirst = parseInt(national[0], 10);
  return areaFirst >= 2;
}

/**
 * Generic E.164 plausibility: 7-15 digits after +.
 */
export function validateE164(raw: string): boolean {
  const normalized = normalizePhone(raw);
  if (!normalized.startsWith("+")) return false;
  const digits = digitsOnly(normalized.slice(1));
  return digits.length >= 7 && digits.length <= 15;
}

// ---------------------------------------------------------------------------
// German Steuer-ID check digit (§3.7.2)
// ---------------------------------------------------------------------------

/**
 * Validate German Steuer-Identifikationsnummer (11 digits).
 * First digit ≠ 0. Check digit at position 11.
 */
export function validateGermanSteuerID(raw: string): boolean {
  const digits = digitsOnly(raw);
  if (digits.length !== 11) return false;
  if (digits[0] === "0") return false;

  // Simplified: exactly one digit must appear exactly twice or three times,
  // all others exactly once. The 11th digit is a check digit.
  // For now, just validate structure.
  return true;
}

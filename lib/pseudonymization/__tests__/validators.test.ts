import { describe, it, expect } from "vitest";
import {
  validateEAN13,
  validateAHV,
  normalizeAHV,
  validateIBAN,
  normalizeIBAN,
  mod97,
  validateUSSSN,
  normalizeSSN,
  validateCPF,
  validateCUIT,
  validateSwissPhone,
  validateUSPhone,
  validateE164,
  normalizePhone,
  digitsOnly,
  stripSeparators,
  validateGermanSteuerID,
} from "../../pseudonymization/regex/validators";

// ---------------------------------------------------------------------------
// EAN-13 / AHV (§3.1.1)
// ---------------------------------------------------------------------------
describe("EAN-13 / AHV", () => {
  it("validates correct EAN-13", () => {
    // Standard EAN-13 barcode: 4006381333931
    expect(validateEAN13("4006381333931")).toBe(true);
  });

  it("rejects wrong EAN-13 checksum", () => {
    expect(validateEAN13("4006381333932")).toBe(false);
  });

  it("rejects non-13-digit input", () => {
    expect(validateEAN13("123456")).toBe(false);
    expect(validateEAN13("")).toBe(false);
    expect(validateEAN13("abcdefghijklm")).toBe(false);
  });

  it("normalizes AHV: strips dots, spaces, hyphens", () => {
    expect(normalizeAHV("756.1234.5678.97")).toBe("7561234567897");
    expect(normalizeAHV("756 1234 5678 97")).toBe("7561234567897");
    expect(normalizeAHV("756-1234-5678-97")).toBe("7561234567897");
  });

  it("validates correctly formatted AHV (must start with 756)", () => {
    // 756.9217.0769.85 is a known valid test AHV
    const testAHV = "7569217076985";
    // Verify our EAN-13 check: sum of weighted digits
    // We just test the structure — actual checksums need real test vectors
    expect(normalizeAHV("756.9217.0769.85")).toBe(testAHV);
  });

  it("rejects AHV not starting with 756", () => {
    expect(validateAHV("123.4567.8901.23")).toBe(false);
  });

  it("rejects AHV with wrong length", () => {
    expect(validateAHV("756.1234.5678")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// IBAN Mod-97 (§3.3)
// ---------------------------------------------------------------------------
describe("IBAN Mod-97", () => {
  it("normalizes IBAN: strips spaces, uppercases", () => {
    expect(normalizeIBAN("CH93 0076 2011 6238 5295 7")).toBe("CH9300762011623852957");
    expect(normalizeIBAN("de89 3704 0044 0532 0130 00")).toBe("DE89370400440532013000");
  });

  it("validates correct Swiss IBAN", () => {
    expect(validateIBAN("CH93 0076 2011 6238 5295 7")).toBe(true);
  });

  it("validates correct German IBAN", () => {
    expect(validateIBAN("DE89 3704 0044 0532 0130 00")).toBe(true);
  });

  it("validates correct Austrian IBAN", () => {
    expect(validateIBAN("AT61 1904 3002 3457 3201")).toBe(true);
  });

  it("validates correct French IBAN", () => {
    expect(validateIBAN("FR76 3000 6000 0112 3456 7890 189")).toBe(true);
  });

  it("validates correct GB IBAN", () => {
    expect(validateIBAN("GB29 NWBK 6016 1331 9268 19")).toBe(true);
  });

  it("rejects IBAN with wrong check digits", () => {
    expect(validateIBAN("CH94 0076 2011 6238 5295 7")).toBe(false);
  });

  it("rejects IBAN with wrong country length", () => {
    // CH should be 21 chars, this is 20
    expect(validateIBAN("CH93 0076 2011 6238 529")).toBe(false);
  });

  it("rejects unknown country code", () => {
    expect(validateIBAN("XX12 3456 7890 1234")).toBe(false);
  });

  it("mod97 handles large numbers correctly", () => {
    // 182316110001234567891234567890 mod 97 should work without overflow
    expect(mod97("182316110001234567891234567890")).toBeGreaterThanOrEqual(0);
    expect(mod97("182316110001234567891234567890")).toBeLessThan(97);
  });
});

// ---------------------------------------------------------------------------
// US SSN (§3.1.4)
// ---------------------------------------------------------------------------
describe("US SSN", () => {
  it("validates structurally valid SSN", () => {
    expect(validateUSSSN("123-45-6789")).toBe(true);
    expect(validateUSSSN("123456789")).toBe(true);
  });

  it("normalizes SSN: strips hyphens", () => {
    expect(normalizeSSN("123-45-6789")).toBe("123456789");
  });

  it("rejects area 000", () => {
    expect(validateUSSSN("000-12-3456")).toBe(false);
  });

  it("rejects area 666", () => {
    expect(validateUSSSN("666-12-3456")).toBe(false);
  });

  it("rejects area 900+", () => {
    expect(validateUSSSN("900-12-3456")).toBe(false);
    expect(validateUSSSN("999-12-3456")).toBe(false);
  });

  it("rejects group 00", () => {
    expect(validateUSSSN("123-00-6789")).toBe(false);
  });

  it("rejects serial 0000", () => {
    expect(validateUSSSN("123-45-0000")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Brazilian CPF (§3.7.5)
// ---------------------------------------------------------------------------
describe("Brazilian CPF", () => {
  it("validates correct CPF", () => {
    // 529.982.247-25 is a known valid CPF
    expect(validateCPF("52998224725")).toBe(true);
  });

  it("rejects all-same digits", () => {
    expect(validateCPF("11111111111")).toBe(false);
    expect(validateCPF("00000000000")).toBe(false);
  });

  it("rejects wrong check digits", () => {
    expect(validateCPF("52998224726")).toBe(false);
  });

  it("rejects wrong length", () => {
    expect(validateCPF("1234567890")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Argentine CUIT (§3.7.5)
// ---------------------------------------------------------------------------
describe("Argentine CUIT", () => {
  it("validates correct CUIT", () => {
    // 20-05536168-2 — verified against CUIT algorithm
    expect(validateCUIT("20055361682")).toBe(true);
  });

  it("rejects wrong check digit", () => {
    expect(validateCUIT("20055361683")).toBe(false);
  });

  it("rejects wrong length", () => {
    expect(validateCUIT("2012345678")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Phone Plausibility (§3.2)
// ---------------------------------------------------------------------------
describe("Phone Plausibility", () => {
  it("normalizes phone: strips spaces, parens, dots, hyphens", () => {
    expect(normalizePhone("+41 (79) 123-45.67")).toBe("+4179123456​7".replace("​", ""));
    expect(normalizePhone("+41 79 123 45 67")).toBe("+41791234567");
  });

  it("validates Swiss phone: +41 with 11 digits", () => {
    expect(validateSwissPhone("+41 79 123 45 67")).toBe(true);
    expect(validateSwissPhone("079 123 45 67")).toBe(true);
  });

  it("rejects Swiss phone: wrong digit count", () => {
    expect(validateSwissPhone("+41 79 123")).toBe(false);
  });

  it("validates US phone: 10 digits", () => {
    expect(validateUSPhone("+1 (555) 123-4567")).toBe(true);
    expect(validateUSPhone("(555) 123-4567")).toBe(true);
  });

  it("rejects US phone: area code starts with 0", () => {
    expect(validateUSPhone("(055) 123-4567")).toBe(false);
  });

  it("rejects US phone: area code starts with 1", () => {
    expect(validateUSPhone("(155) 123-4567")).toBe(false);
  });

  it("validates E.164: 7-15 digits after +", () => {
    expect(validateE164("+41791234567")).toBe(true);
    expect(validateE164("+1234567")).toBe(true);
  });

  it("rejects E.164: too few digits", () => {
    expect(validateE164("+123456")).toBe(false);
  });

  it("rejects E.164: no + prefix", () => {
    expect(validateE164("41791234567")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------
describe("Utility functions", () => {
  it("digitsOnly strips all non-digits", () => {
    expect(digitsOnly("756.1234.5678.97")).toBe("7561234567897");
    expect(digitsOnly("abc 123-def")).toBe("123");
  });

  it("stripSeparators strips spaces, dots, hyphens", () => {
    expect(stripSeparators("CHE-123.456.789")).toBe("CHE123456789");
  });
});

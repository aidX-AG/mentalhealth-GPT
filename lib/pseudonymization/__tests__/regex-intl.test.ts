import { describe, it, expect } from "vitest";
import { detectRegex } from "../regex";

describe("International Regex Patterns (§3)", () => {
  describe("IBAN (iban-mod97)", () => {
    it("detects valid Swiss IBAN", () => {
      const text = "IBAN: CH93 0076 2011 6238 5295 7";
      const results = detectRegex(text).filter((d) => d.patternId === "iban-mod97");
      expect(results).toHaveLength(1);
      expect(results[0].category).toBe("IBAN");
      expect(results[0].confidence).toBe(1.0);
    });

    it("detects valid German IBAN", () => {
      const text = "Konto: DE89 3704 0044 0532 0130 00";
      const results = detectRegex(text).filter((d) => d.patternId === "iban-mod97");
      expect(results).toHaveLength(1);
    });

    it("rejects IBAN with invalid Mod-97", () => {
      const text = "IBAN: CH94 0076 2011 6238 5295 7"; // Wrong check digit
      const results = detectRegex(text).filter((d) => d.patternId === "iban-mod97");
      expect(results).toHaveLength(0);
    });
  });

  describe("Email (email)", () => {
    it("detects email address", () => {
      const text = "Mail an max.mueller@example.ch bitte.";
      const results = detectRegex(text).filter((d) => d.patternId === "email");
      expect(results).toHaveLength(1);
      expect(results[0].category).toBe("EMAIL");
      expect(results[0].original).toBe("max.mueller@example.ch");
    });
  });

  describe("Dates", () => {
    it("detects European date (date-eu)", () => {
      const text = "Am 15.02.2026 ist der Termin.";
      const results = detectRegex(text).filter((d) => d.patternId === "date-eu");
      expect(results).toHaveLength(1);
      expect(results[0].category).toBe("DATUM");
    });

    it("detects ISO date (date-iso)", () => {
      const text = "Datum: 2026-02-15";
      const results = detectRegex(text).filter((d) => d.patternId === "date-iso");
      expect(results).toHaveLength(1);
    });

    it("detects written German date (date-written)", () => {
      const text = "Am 15. Februar 2026 hat er Geburtstag.";
      const results = detectRegex(text).filter(
        (d) => d.patternId === "date-written",
      );
      expect(results).toHaveLength(1);
    });

    it("detects written English date (date-written)", () => {
      const text = "Born on February 15, 2026.";
      const results = detectRegex(text).filter(
        (d) => d.patternId === "date-written",
      );
      expect(results).toHaveLength(1);
    });
  });

  describe("US SSN (us-ssn)", () => {
    it("detects valid SSN with hyphens", () => {
      const text = "SSN: 123-45-6789";
      const results = detectRegex(text).filter((d) => d.patternId === "us-ssn");
      expect(results).toHaveLength(1);
      expect(results[0].category).toBe("SOZIALVERS");
    });

    it("rejects SSN with area 000", () => {
      const text = "SSN: 000-45-6789";
      const results = detectRegex(text).filter((d) => d.patternId === "us-ssn");
      expect(results).toHaveLength(0);
    });
  });

  describe("US Phone (us-phone)", () => {
    it("detects US format (xxx) xxx-xxxx", () => {
      const text = "Call (555) 123-4567 today.";
      const results = detectRegex(text).filter((d) => d.patternId === "us-phone");
      expect(results).toHaveLength(1);
      expect(results[0].category).toBe("TELEFON");
    });
  });

  describe("Brazil CPF (br-cpf)", () => {
    it("detects CPF format", () => {
      const text = "CPF: 529.982.247-25";
      const results = detectRegex(text).filter((d) => d.patternId === "br-cpf");
      expect(results).toHaveLength(1);
      expect(results[0].category).toBe("STEUERNR");
    });

    it("rejects CPF with wrong check digits", () => {
      const text = "CPF: 529.982.247-26";
      const results = detectRegex(text).filter((d) => d.patternId === "br-cpf");
      expect(results).toHaveLength(0);
    });
  });

  describe("German Phone (de-phone)", () => {
    it("detects +49 format", () => {
      const text = "Telefon: +49 30 12345678";
      const results = detectRegex(text).filter((d) => d.patternId === "de-phone");
      expect(results).toHaveLength(1);
    });
  });

  describe("E.164 fallback (phone-e164)", () => {
    it("detects generic international format", () => {
      const text = "Nummer: +33 1 42 86 82 69 (Paris)";
      const results = detectRegex(text).filter((d) => d.category === "TELEFON");
      expect(results.length).toBeGreaterThanOrEqual(1);
    });
  });
});

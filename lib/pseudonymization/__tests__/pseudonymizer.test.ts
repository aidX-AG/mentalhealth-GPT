import { describe, it, expect } from "vitest";
import { pseudonymize, depseudonymize, createMapping } from "../pseudonymizer";
import { escapeTokenBrackets } from "../token-escape";
import type { DetectedPII, PseudonymizationMapping } from "../types";

function mockDetection(
  overrides: Partial<DetectedPII> & { start: number; end: number; original: string },
): DetectedPII {
  return {
    category: "PERSON",
    confidence: 1.0,
    source: "ner",
    defaultAccepted: true,
    ...overrides,
  };
}

describe("Pseudonymizer (§9.2)", () => {
  describe("pseudonymize", () => {
    it("replaces single detection with token", () => {
      const text = "Herr Max Müller hat einen Termin.";
      const detections = [
        mockDetection({ start: 5, end: 15, original: "Max Müller" }),
      ];

      const { pseudonymized, mapping } = pseudonymize(text, detections, null);
      expect(pseudonymized).toBe("Herr ⟦PERSON:001⟧ hat einen Termin.");
      expect(mapping.entries["⟦PERSON:001⟧"].original).toBe("Max Müller");
    });

    it("replaces multiple detections", () => {
      const text = "Max Müller wohnt in Zürich.";
      const detections = [
        mockDetection({ start: 0, end: 10, original: "Max Müller", category: "PERSON" }),
        mockDetection({ start: 20, end: 26, original: "Zürich", category: "ORT" }),
      ];

      const { pseudonymized, mapping } = pseudonymize(text, detections, null);
      expect(pseudonymized).toContain("⟦PERSON:001⟧");
      expect(pseudonymized).toContain("⟦ORT:002⟧");
      expect(mapping.next_counter).toBe(3);
    });

    it("token reuse: same original gets same token", () => {
      const text = "Max Müller sagt, Max Müller kommt.";
      const detections = [
        mockDetection({ start: 0, end: 10, original: "Max Müller" }),
        mockDetection({ start: 17, end: 27, original: "Max Müller" }),
      ];

      const { pseudonymized, mapping } = pseudonymize(text, detections, null);
      // Both should get the same token
      expect(pseudonymized).toBe("⟦PERSON:001⟧ sagt, ⟦PERSON:001⟧ kommt.");
      // Only one entry in mapping
      expect(Object.keys(mapping.entries)).toHaveLength(1);
      expect(mapping.next_counter).toBe(2);
    });

    it("category-aware reuse: same text, different category = different token", () => {
      const text = "Zürich als Ort und Zürich als Org.";
      const detections = [
        mockDetection({ start: 0, end: 6, original: "Zürich", category: "ORT" }),
        mockDetection({ start: 19, end: 25, original: "Zürich", category: "ORG" }),
      ];

      const { pseudonymized } = pseudonymize(text, detections, null);
      expect(pseudonymized).toContain("⟦ORT:001⟧");
      expect(pseudonymized).toContain("⟦ORG:002⟧");
    });

    it("preserves existing mapping across calls", () => {
      const text1 = "Max Müller kommt.";
      const det1 = [mockDetection({ start: 0, end: 10, original: "Max Müller" })];
      const { mapping: mapping1 } = pseudonymize(text1, det1, null);

      const text2 = "Anna Schmidt auch.";
      const det2 = [mockDetection({ start: 0, end: 12, original: "Anna Schmidt" })];
      const { pseudonymized, mapping: mapping2 } = pseudonymize(text2, det2, mapping1);

      expect(pseudonymized).toBe("⟦PERSON:002⟧ auch.");
      expect(mapping2.next_counter).toBe(3);
      expect(mapping2.entries["⟦PERSON:001⟧"].original).toBe("Max Müller");
      expect(mapping2.entries["⟦PERSON:002⟧"].original).toBe("Anna Schmidt");
    });

    it("handles empty detections", () => {
      const text = "Kein PII hier.";
      const { pseudonymized, mapping } = pseudonymize(text, [], null);
      expect(pseudonymized).toBe(text);
      expect(Object.keys(mapping.entries)).toHaveLength(0);
    });

    it("counter is zero-padded to 3 digits", () => {
      const text = "A B C";
      const detections = [
        mockDetection({ start: 0, end: 1, original: "A" }),
      ];
      const { pseudonymized } = pseudonymize(text, detections, null);
      expect(pseudonymized).toContain(":001⟧");
    });
  });

  describe("depseudonymize", () => {
    it("replaces tokens with originals", () => {
      const mapping = createMapping();
      mapping.entries["⟦PERSON:001⟧"] = {
        type: "PERSON",
        original: "Max Müller",
        created_at: new Date().toISOString(),
        confidence: 0.95,
        source: "ner",
      };

      const text = "Herr ⟦PERSON:001⟧ hat einen Termin.";
      const result = depseudonymize(text, mapping);
      expect(result).toBe("Herr Max Müller hat einen Termin.");
    });

    it("handles multiple tokens", () => {
      const mapping = createMapping();
      mapping.entries["⟦PERSON:001⟧"] = {
        type: "PERSON", original: "Max Müller",
        created_at: "", confidence: 1, source: "ner",
      };
      mapping.entries["⟦ORT:002⟧"] = {
        type: "ORT", original: "Zürich",
        created_at: "", confidence: 1, source: "ner",
      };

      const text = "⟦PERSON:001⟧ wohnt in ⟦ORT:002⟧.";
      const result = depseudonymize(text, mapping);
      expect(result).toBe("Max Müller wohnt in Zürich.");
    });

    it("leaves unknown tokens unchanged", () => {
      const mapping = createMapping();
      const text = "⟦PERSON:999⟧ ist unbekannt.";
      const result = depseudonymize(text, mapping);
      expect(result).toBe("⟦PERSON:999⟧ ist unbekannt.");
    });

    it("unescapes token brackets in user input", () => {
      const mapping = createMapping();
      // User had typed literal ⟦ which was escaped to ⦃
      const text = "Das Symbol \u2983 ist Unicode.";
      const result = depseudonymize(text, mapping);
      expect(result).toBe("Das Symbol ⟦ ist Unicode.");
    });
  });

  describe("Full roundtrip: escape → pseudonymize → depseudonymize → unescape", () => {
    it("preserves original text with PII replaced and restored", () => {
      const originalText = "Max Müller wohnt in Zürich und nimmt Sertralin.";
      const escaped = escapeTokenBrackets(originalText);
      expect(escaped).toBe(originalText); // No brackets to escape

      const detections = [
        mockDetection({ start: 0, end: 10, original: "Max Müller", category: "PERSON" }),
        mockDetection({ start: 20, end: 26, original: "Zürich", category: "ORT" }),
      ];

      const { pseudonymized, mapping } = pseudonymize(escaped, detections, null);
      expect(pseudonymized).toContain("⟦PERSON:001⟧");
      expect(pseudonymized).toContain("⟦ORT:002⟧");
      expect(pseudonymized).not.toContain("Max Müller");
      expect(pseudonymized).not.toContain("Zürich");

      const restored = depseudonymize(pseudonymized, mapping);
      expect(restored).toBe(originalText);
    });

    it("roundtrip with token brackets in user input", () => {
      const originalText = "Symbol ⟦ ist in Unicode definiert ⟧ Ende.";
      const escaped = escapeTokenBrackets(originalText);

      // No PII detected in this text
      const { pseudonymized, mapping } = pseudonymize(escaped, [], null);
      expect(pseudonymized).toBe(escaped);

      const restored = depseudonymize(pseudonymized, mapping);
      expect(restored).toBe(originalText);
    });
  });

  describe("createMapping", () => {
    it("creates empty mapping with version 1", () => {
      const m = createMapping();
      expect(m.version).toBe(1);
      expect(m.next_counter).toBe(1);
      expect(Object.keys(m.entries)).toHaveLength(0);
      expect(Object.keys(m.original_to_token)).toHaveLength(0);
      expect(m.created_at).toBeTruthy();
      expect(m.updated_at).toBeTruthy();
    });
  });
});

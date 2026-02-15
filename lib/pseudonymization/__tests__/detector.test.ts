import { describe, it, expect } from "vitest";
import { mergeDetections } from "../detector";
import type { DetectedPII } from "../types";

// Helper to create a mock detection
function mockDetection(
  overrides: Partial<DetectedPII> & { start: number; end: number },
): DetectedPII {
  return {
    category: "PERSON",
    original: "test",
    confidence: 1.0,
    source: "regex",
    defaultAccepted: true,
    ...overrides,
  };
}

describe("Merge Algorithm (§11)", () => {
  it("non-overlapping detections: all accepted", () => {
    const regex = [mockDetection({ start: 0, end: 5, original: "Hello" })];
    const ner = [mockDetection({ start: 10, end: 15, original: "World", source: "ner" })];
    const dict = [mockDetection({ start: 20, end: 25, original: "Test", source: "dictionary" })];

    const result = mergeDetections(regex, ner, dict);
    expect(result).toHaveLength(3);
  });

  it("identical spans: regex wins over NER (priority-first)", () => {
    const regex = [mockDetection({ start: 0, end: 10, source: "regex", patternId: "ch-ahv" })];
    const ner = [mockDetection({ start: 0, end: 10, source: "ner" })];

    const result = mergeDetections(regex, ner, []);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("regex");
  });

  it("identical spans: NER wins over dictionary", () => {
    const ner = [mockDetection({ start: 0, end: 10, source: "ner" })];
    const dict = [mockDetection({ start: 0, end: 10, source: "dictionary" })];

    const result = mergeDetections([], ner, dict);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("ner");
  });

  it("structured regex beats NER: IBAN regex inside NER span", () => {
    // Regex matches IBAN "CH93 0076 2011" [12,26], NER matches "Firma CH93 0076 2011" [6,26] as ORG
    const regex = [mockDetection({
      start: 12, end: 26, source: "regex", original: "CH93 0076 2011",
      category: "IBAN", patternId: "iban-mod97",
    })];
    const ner = [mockDetection({
      start: 6, end: 26, source: "ner", original: "Firma CH93 0076 2011",
      category: "ORG",
    })];

    const result = mergeDetections(regex, ner, []);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("regex");
    expect(result[0].category).toBe("IBAN");
  });

  it("NER wins over regex for entity categories (PERSON/ORT/ORG)", () => {
    // Regex matches "Müller" [4,10] as PERSON, NER matches "Max Müller" [0,10] as PERSON
    // For entity categories, regex has no priority advantage — NER wins via longer span
    const regex = [mockDetection({
      start: 4, end: 10, source: "regex", original: "Müller",
      category: "PERSON",
    })];
    const ner = [mockDetection({
      start: 0, end: 10, source: "ner", original: "Max Müller",
      category: "PERSON",
    })];

    const result = mergeDetections(regex, ner, []);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("ner");
    expect(result[0].original).toBe("Max Müller");
  });

  it("within same priority: longer span wins", () => {
    // Both NER: "Max Müller" [0,10] and "Müller" [4,10]
    const ner = [
      mockDetection({ start: 0, end: 10, source: "ner", original: "Max Müller" }),
      mockDetection({ start: 4, end: 10, source: "ner", original: "Müller" }),
    ];

    const result = mergeDetections([], ner, []);
    expect(result).toHaveLength(1);
    expect(result[0].original).toBe("Max Müller");
  });

  it("partial overlap: first accepted blocks second", () => {
    // "kognitive Verhaltenstherapie" [0,28] vs "Verhaltenstherapie" [10,28]
    const dict = [
      mockDetection({
        start: 0, end: 28, source: "dictionary",
        original: "kognitive Verhaltenstherapie",
        category: "THERAPIE",
      }),
    ];
    const ner = [
      mockDetection({
        start: 10, end: 28, source: "ner",
        original: "Verhaltenstherapie",
      }),
    ];

    const result = mergeDetections([], ner, dict);
    // Dictionary match is longer (28 chars) but NER has higher priority.
    // NER "Verhaltenstherapie" [10,28] gets accepted first (priority 1).
    // Then dict "kognitive Verhaltenstherapie" [0,28] overlaps → blocked.
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("ner");
  });

  it("contained span: structural regex subset blocks NER superset", () => {
    // Regex matches AHV "756.1234.5678.97" [10,26] inside NER "Herr Müller 756.1234..." [0,26]
    // SOZIALVERS is a structural category → regex has priority 0, NER has priority 1
    const regex = [mockDetection({
      start: 10, end: 26, source: "regex",
      category: "SOZIALVERS", patternId: "ch-ahv",
    })];
    const ner = [mockDetection({
      start: 0, end: 26, source: "ner",
      category: "PERSON",
    })];

    const result = mergeDetections(regex, ner, []);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("regex");
    expect(result[0].category).toBe("SOZIALVERS");
  });

  it("multiple non-overlapping from different sources", () => {
    const regex = [mockDetection({ start: 0, end: 5, source: "regex" })];
    const ner = [mockDetection({ start: 10, end: 20, source: "ner" })];
    const dict = [
      mockDetection({ start: 25, end: 35, source: "dictionary" }),
      mockDetection({ start: 40, end: 50, source: "dictionary" }),
    ];

    const result = mergeDetections(regex, ner, dict);
    expect(result).toHaveLength(4);
  });

  it("result is sorted by start position", () => {
    const regex = [mockDetection({ start: 20, end: 30, source: "regex" })];
    const ner = [mockDetection({ start: 0, end: 5, source: "ner" })];
    const dict = [mockDetection({ start: 10, end: 15, source: "dictionary" })];

    const result = mergeDetections(regex, ner, dict);
    expect(result).toHaveLength(3);
    expect(result[0].start).toBe(0);
    expect(result[1].start).toBe(10);
    expect(result[2].start).toBe(20);
  });

  it("empty inputs return empty result", () => {
    expect(mergeDetections([], [], [])).toHaveLength(0);
  });

  it("NER dedup with dictionary: same span, NER wins", () => {
    // Both detect "Zürich" at same position
    const ner = [mockDetection({
      start: 20, end: 26, source: "ner",
      category: "ORT", original: "Zürich",
    })];
    const dict = [mockDetection({
      start: 20, end: 26, source: "dictionary",
      category: "ORT", original: "Zürich",
    })];

    const result = mergeDetections([], ner, dict);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("ner");
  });
});

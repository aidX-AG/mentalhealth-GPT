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

  it("priority beats length: short regex beats long NER", () => {
    // Regex matches "Müller" [4,10], NER matches "Max Müller" [0,10]
    const regex = [mockDetection({ start: 4, end: 10, source: "regex", original: "Müller" })];
    const ner = [mockDetection({ start: 0, end: 10, source: "ner", original: "Max Müller" })];

    const result = mergeDetections(regex, ner, []);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("regex");
    expect(result[0].original).toBe("Müller");
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

  it("contained span: regex subset occupies range, blocks NER superset", () => {
    // Regex matches "079 123 45 67" [0,14], NER matches "Herr 079 123 45 67" [-4,14] — absurd but tests containment
    // More realistic: regex "756.1234.5678.97" [10,26] inside NER "Herr Müller 756.1234..." [0,26]
    const regex = [mockDetection({ start: 10, end: 26, source: "regex" })];
    const ner = [mockDetection({ start: 0, end: 26, source: "ner" })];

    const result = mergeDetections(regex, ner, []);
    expect(result).toHaveLength(1);
    expect(result[0].source).toBe("regex");
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

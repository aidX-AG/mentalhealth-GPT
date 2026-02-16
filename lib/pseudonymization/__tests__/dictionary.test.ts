import { describe, it, expect } from "vitest";
import { detectDictionary } from "../dictionary";

describe("Dictionary Detection (§5)", () => {
  it("detects German diagnosis terms", () => {
    const text = "Der Patient hat eine Depression und Angststörung.";
    const results = detectDictionary(text);
    const diagnoses = results.filter((d) => d.category === "DIAGNOSE");
    expect(diagnoses.length).toBe(2);
    expect(diagnoses.map((d) => d.original)).toContain("Depression");
    expect(diagnoses.map((d) => d.original)).toContain("Angststörung");
  });

  it("detects medications", () => {
    const text = "Er nimmt Sertralin 50mg und Lorazepam 1mg.";
    const results = detectDictionary(text);
    const meds = results.filter((d) => d.category === "MEDIKAMENT");
    expect(meds.length).toBe(2);
    expect(meds.map((d) => d.original)).toContain("Sertralin");
    expect(meds.map((d) => d.original)).toContain("Lorazepam");
  });

  it("detects therapy forms", () => {
    const text = "Sie macht eine kognitive Verhaltenstherapie und EMDR.";
    const results = detectDictionary(text);
    const therapies = results.filter((d) => d.category === "THERAPIE");
    expect(therapies.length).toBe(2);
    expect(therapies.map((d) => d.original)).toContain(
      "kognitive Verhaltenstherapie",
    );
    expect(therapies.map((d) => d.original)).toContain("EMDR");
  });

  it("case-insensitive matching", () => {
    const text = "depression und DEPRESSION und Depression";
    const results = detectDictionary(text);
    expect(results.length).toBe(3);
  });

  it("longest-match-first prevents partial matches", () => {
    // "kognitive Verhaltenstherapie" should be one match, not "Verhaltenstherapie" alone
    const text = "Die kognitive Verhaltenstherapie ist wirksam.";
    const results = detectDictionary(text);
    expect(results.length).toBe(1);
    expect(results[0].original).toBe("kognitive Verhaltenstherapie");
  });

  it("word boundary: no substring matches", () => {
    // "Depression" should not match inside "Depressionserkennung" (not a real word, but tests boundary)
    // Actually let's test a more realistic case
    const text = "Das Medikament Lithiumcarbonat";
    const results = detectDictionary(text);
    // "Lithium" should match if it's a word boundary
    // "Lithiumcarbonat" — "Lithium" is at position 15, followed by "carbonat" (no word boundary)
    // So Lithium should NOT match inside compound word
    const lithium = results.filter((d) => d.original.toLowerCase() === "lithium");
    expect(lithium.length).toBe(0);
  });

  it("detects English terms", () => {
    const text = "Diagnosed with major depressive disorder and ADHD.";
    const results = detectDictionary(text);
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it("detects French terms", () => {
    const text = "Il souffre de dépression et de trouble anxieux.";
    const results = detectDictionary(text);
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it("detects Spanish terms", () => {
    const text = "Diagnóstico: depresión y trastorno de ansiedad.";
    const results = detectDictionary(text);
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it("detects brand names", () => {
    const text = "Patient nimmt Zoloft und Cipralex.";
    const results = detectDictionary(text);
    const meds = results.filter((d) => d.category === "MEDIKAMENT");
    expect(meds.length).toBe(2);
  });

  it("all detections have source=dictionary and confidence=1.0", () => {
    const text = "Depression und Sertralin und CBT.";
    const results = detectDictionary(text);
    for (const d of results) {
      expect(d.source).toBe("dictionary");
      expect(d.confidence).toBe(1.0);
      expect(d.defaultAccepted).toBe(true);
    }
  });

  it("returns correct start/end offsets", () => {
    const text = "Hat Depression.";
    const results = detectDictionary(text);
    expect(results).toHaveLength(1);
    expect(results[0].start).toBe(4);
    expect(results[0].end).toBe(14);
    expect(text.slice(results[0].start, results[0].end)).toBe("Depression");
  });

  it("handles empty text", () => {
    expect(detectDictionary("")).toHaveLength(0);
  });

  it("handles text with no matches", () => {
    expect(
      detectDictionary("Das Wetter ist heute schön."),
    ).toHaveLength(0);
  });
});

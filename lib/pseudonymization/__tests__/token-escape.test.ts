import { describe, it, expect } from "vitest";
import {
  escapeTokenBrackets,
  unescapeTokenBrackets,
  containsTokenBrackets,
} from "../token-escape";
import {
  TOKEN_OPEN, TOKEN_CLOSE,
  ESCAPE_OPEN, ESCAPE_CLOSE,
  ESCAPE2_OPEN, ESCAPE2_CLOSE,
} from "../types";

describe("Token Escape (§12)", () => {
  it("escapes ⟦ to ⦃", () => {
    expect(escapeTokenBrackets("Das Symbol ⟦ kommt vor")).toBe(
      `Das Symbol ${ESCAPE_OPEN} kommt vor`,
    );
  });

  it("escapes ⟧ to ⦄", () => {
    expect(escapeTokenBrackets("Ende ⟧ hier")).toBe(
      `Ende ${ESCAPE_CLOSE} hier`,
    );
  });

  it("escapes both brackets", () => {
    const input = "⟦test⟧";
    const escaped = escapeTokenBrackets(input);
    expect(escaped).toBe(`${ESCAPE_OPEN}test${ESCAPE_CLOSE}`);
    expect(escaped).not.toContain(TOKEN_OPEN);
    expect(escaped).not.toContain(TOKEN_CLOSE);
  });

  it("leaves normal text untouched", () => {
    const text = "Hello World! [brackets] {curly}";
    expect(escapeTokenBrackets(text)).toBe(text);
  });

  it("unescapes ⦃ back to ⟦", () => {
    expect(unescapeTokenBrackets(`${ESCAPE_OPEN}test`)).toBe("⟦test");
  });

  it("unescapes ⦄ back to ⟧", () => {
    expect(unescapeTokenBrackets(`test${ESCAPE_CLOSE}`)).toBe("test⟧");
  });

  it("roundtrip: escape → unescape = original", () => {
    const original = "Text mit ⟦Klammern⟧ und normalem Text";
    const escaped = escapeTokenBrackets(original);
    const restored = unescapeTokenBrackets(escaped);
    expect(restored).toBe(original);
  });

  it("2-step: literal ⦃/⦄ in user input are preserved through roundtrip", () => {
    const input = `User typed ${ESCAPE_OPEN}curly${ESCAPE_CLOSE} brackets`;
    const escaped = escapeTokenBrackets(input);
    // ⦃ should be escaped to ⦅ (level 2), not left as-is
    expect(escaped).toContain(ESCAPE2_OPEN);
    expect(escaped).toContain(ESCAPE2_CLOSE);
    // Roundtrip restores original
    expect(unescapeTokenBrackets(escaped)).toBe(input);
  });

  it("2-step: mixed ⟦ and ⦃ in same input", () => {
    const input = `⟦token⟧ and ⦃curly⦄`;
    const escaped = escapeTokenBrackets(input);
    // No ⟦/⟧ remain (escaped to ⦃/⦄)
    expect(escaped).not.toContain(TOKEN_OPEN);
    expect(escaped).not.toContain(TOKEN_CLOSE);
    // Roundtrip restores both
    expect(unescapeTokenBrackets(escaped)).toBe(input);
  });

  it("handles empty string", () => {
    expect(escapeTokenBrackets("")).toBe("");
    expect(unescapeTokenBrackets("")).toBe("");
  });

  it("handles multiple brackets in one string", () => {
    const input = "⟦a⟧ und ⟦b⟧";
    const escaped = escapeTokenBrackets(input);
    expect(escaped).not.toContain(TOKEN_OPEN);
    expect(escaped).not.toContain(TOKEN_CLOSE);
    expect(unescapeTokenBrackets(escaped)).toBe(input);
  });
});

describe("containsTokenBrackets", () => {
  it("returns true for ⟦", () => {
    expect(containsTokenBrackets("text ⟦ more")).toBe(true);
  });

  it("returns true for ⟧", () => {
    expect(containsTokenBrackets("text ⟧ more")).toBe(true);
  });

  it("returns false for normal text", () => {
    expect(containsTokenBrackets("normal text")).toBe(false);
  });

  it("returns false for escaped brackets", () => {
    expect(containsTokenBrackets(`${ESCAPE_OPEN}${ESCAPE_CLOSE}`)).toBe(false);
  });
});

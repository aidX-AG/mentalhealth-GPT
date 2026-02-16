// lib/pseudonymization/__tests__/file-extract.test.ts
import { describe, it, expect, vi } from "vitest";
import {
  validateFile,
  extractText,
  getPageForOffset,
  FILE_CONSTANTS,
  type PageBoundary,
} from "../file-extract";

// ---------------------------------------------------------------------------
// Mock pdfjs-dist and pdfjs-init
// ---------------------------------------------------------------------------

vi.mock("../pdfjs-init", () => ({
  pdfjsLib: {
    getDocument: vi.fn((data) => ({
      promise: Promise.resolve({
        numPages: 3,
        getPage: vi.fn((pageNum) =>
          Promise.resolve({
            getTextContent: vi.fn(() =>
              Promise.resolve({
                items: [{ str: `Page ${pageNum} text content` }],
              }),
            ),
          }),
        ),
      }),
    })),
    GlobalWorkerOptions: { workerSrc: "" },
  },
}));

// ---------------------------------------------------------------------------
// Validation Tests (§3)
// ---------------------------------------------------------------------------

describe("validateFile", () => {
  it("accepts valid .txt file", () => {
    const file = new File(["test"], "test.txt", { type: "text/plain" });
    const result = validateFile(file);
    expect(result.valid).toBe(true);
    expect(result.errorKey).toBeUndefined();
  });

  it("accepts valid .pdf file", () => {
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    const result = validateFile(file);
    expect(result.valid).toBe(true);
  });

  it("rejects empty file", () => {
    const file = new File([], "empty.txt", { type: "text/plain" });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.errorKey).toBe("pseudonymization.file.error-empty");
  });

  it("rejects oversized .txt file", () => {
    const largeContent = "x".repeat(11 * 1024 * 1024); // 11 MB
    const file = new File([largeContent], "large.txt", { type: "text/plain" });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.errorKey).toBe("pseudonymization.file.error-size");
  });

  it("rejects unsupported file type", () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.errorKey).toBe("pseudonymization.file.error-type");
  });

  // SF-6: Extension fallback when file.type is empty
  it("falls back to extension when MIME type is empty", () => {
    const file = new File(["test"], "test.txt", { type: "" });
    const result = validateFile(file);
    expect(result.valid).toBe(true);
  });

  // SF-6: Extension fallback when MIME type is generic
  it("falls back to extension when MIME type is application/octet-stream", () => {
    const file = new File(["test"], "test.pdf", {
      type: "application/octet-stream",
    });
    const result = validateFile(file);
    expect(result.valid).toBe(true);
  });

  // SF-6: Rejects unknown extension
  it("rejects file with empty MIME and unknown extension", () => {
    const file = new File(["test"], "test.unknown", { type: "" });
    const result = validateFile(file);
    expect(result.valid).toBe(false);
    expect(result.errorKey).toBe("pseudonymization.file.error-type");
  });
});

// ---------------------------------------------------------------------------
// Extraction Tests (§2)
// ---------------------------------------------------------------------------

describe("extractText", () => {
  it("extracts text from .txt file", async () => {
    const content = "Hello world\nThis is a test";
    const file = new File([content], "test.txt", { type: "text/plain" });

    const result = await extractText(file);

    expect(result.text).toBe(content);
    expect(result.boundaries).toHaveLength(1);
    expect(result.boundaries[0]).toEqual({
      page: 1,
      startOffset: 0,
      endOffset: content.length,
    });
    expect(result.truncatedAtPage).toBeUndefined();
  });

  // SF-4: NFC normalization
  it("normalizes text to NFC", async () => {
    // "ü" as decomposed (u + combining diaeresis)
    const decomposed = "M\u0075\u0308ller"; // Müller in NFD
    const file = new File([decomposed], "test.txt", { type: "text/plain" });

    const result = await extractText(file);

    // Should be normalized to NFC (composed ü)
    expect(result.text).toBe("Müller");
    expect(result.text.normalize("NFC")).toBe(result.text);
  });

  it("extracts text from .pdf file (mocked)", async () => {
    const file = new File(["mock pdf"], "test.pdf", {
      type: "application/pdf",
    });

    const progressCallback = vi.fn();
    const result = await extractText(file, progressCallback);

    expect(result.text).toContain("Page 1 text content");
    expect(result.text).toContain("Page 2 text content");
    expect(result.text).toContain("Page 3 text content");
    expect(result.boundaries).toHaveLength(3);
    expect(progressCallback).toHaveBeenCalledWith(1, 3);
    expect(progressCallback).toHaveBeenCalledWith(2, 3);
    expect(progressCallback).toHaveBeenCalledWith(3, 3);
  });

  it("truncates text exceeding MAX_EXTRACTED_CHARS", async () => {
    const largeContent = "x".repeat(FILE_CONSTANTS.MAX_EXTRACTED_CHARS + 1000);
    const file = new File([largeContent], "large.txt", { type: "text/plain" });

    const result = await extractText(file);

    expect(result.text.length).toBeLessThanOrEqual(
      FILE_CONSTANTS.MAX_EXTRACTED_CHARS,
    );
    expect(result.truncatedAtPage).toBeDefined();
  });

  // SF-5: pageBoundaries truncated to processed subset
  it("truncates pageBoundaries to match processed text", async () => {
    // Create a large enough content to trigger truncation
    const largeContent = "a".repeat(FILE_CONSTANTS.MAX_EXTRACTED_CHARS + 1000);
    const file = new File([largeContent], "large.txt", { type: "text/plain" });

    const result = await extractText(file);

    // All boundaries should be within processed text
    for (const boundary of result.boundaries) {
      expect(boundary.endOffset).toBeLessThanOrEqual(result.text.length);
    }
  });

  it("throws error for unsupported file type", async () => {
    const file = new File(["test"], "test.jpg", { type: "image/jpeg" });

    await expect(extractText(file)).rejects.toThrow(
      "Unsupported MIME type: image/jpeg",
    );
  });
});

// ---------------------------------------------------------------------------
// Utility Tests (§4.4)
// ---------------------------------------------------------------------------

describe("getPageForOffset", () => {
  const boundaries: PageBoundary[] = [
    { page: 1, startOffset: 0, endOffset: 100 },
    { page: 2, startOffset: 100, endOffset: 250 },
    { page: 3, startOffset: 250, endOffset: 400 },
  ];

  it("returns correct page for offset in first page", () => {
    expect(getPageForOffset(50, boundaries)).toBe(1);
  });

  it("returns correct page for offset in middle page", () => {
    expect(getPageForOffset(150, boundaries)).toBe(2);
  });

  it("returns correct page for offset in last page", () => {
    expect(getPageForOffset(300, boundaries)).toBe(3);
  });

  it("returns last page for offset beyond boundaries", () => {
    expect(getPageForOffset(500, boundaries)).toBe(3);
  });

  it("returns 1 for empty boundaries", () => {
    expect(getPageForOffset(50, [])).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// Constants Tests
// ---------------------------------------------------------------------------

describe("FILE_CONSTANTS", () => {
  it("exports expected constants", () => {
    expect(FILE_CONSTANTS.MAX_EXTRACTED_CHARS).toBe(500_000);
    expect(FILE_CONSTANTS.MAX_PDF_PAGES).toBe(500);
    expect(FILE_CONSTANTS.ALLOWED_FILE_TYPES).toHaveProperty("text/plain");
    expect(FILE_CONSTANTS.ALLOWED_FILE_TYPES).toHaveProperty("application/pdf");
  });
});

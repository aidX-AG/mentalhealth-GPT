// lib/pseudonymization/file-extract.ts
// ============================================================================
// SPEC-007a v1.1 — File Upload Text Extraction & Validation
// ============================================================================

// ---------------------------------------------------------------------------
// Types & Constants
// ---------------------------------------------------------------------------

export interface PageBoundary {
  page: number; // 1-indexed
  startOffset: number;
  endOffset: number;
}

export interface FileValidationResult {
  valid: boolean;
  errorKey?: string; // i18n key for user-facing error
}

export interface ExtractionResult {
  text: string;
  boundaries: PageBoundary[];
  truncatedAtPage?: number;
}

// MIME whitelist with size limits (§1.3)
const ALLOWED_FILE_TYPES: Record<string, { maxBytes: number; label: string }> = {
  "text/plain": { maxBytes: 10 * 1024 * 1024, label: "Text (.txt)" },
  "application/pdf": { maxBytes: 50 * 1024 * 1024, label: "PDF (.pdf)" },
};

// Extraction limits (§2.4)
const MAX_EXTRACTED_CHARS = 500_000;
const MAX_PDF_PAGES = 500;

// Extension-to-MIME fallback (§3.1, SF-6)
// file.type is unreliable on some OS/browser combinations
const EXT_MIME_FALLBACK: Record<string, string> = {
  ".txt": "text/plain",
  ".pdf": "application/pdf",
};

// ---------------------------------------------------------------------------
// Validation (§3)
// ---------------------------------------------------------------------------

/**
 * Resolve MIME type with extension fallback.
 * SF-6: file.type can be empty or "application/octet-stream" on Windows/some browsers.
 */
function resolveMimeType(file: File): string {
  // Prefer file.type if present and not generic
  if (file.type && file.type !== "application/octet-stream") {
    return file.type;
  }

  // Fallback: extract extension and lookup
  const lastDot = file.name.lastIndexOf(".");
  if (lastDot === -1) return "";

  const ext = file.name.slice(lastDot).toLowerCase();
  return EXT_MIME_FALLBACK[ext] ?? "";
}

/**
 * Validate file type and size (§3.1).
 */
export function validateFile(file: File): FileValidationResult {
  // 1. MIME type check (with extension fallback — SF-6)
  const mime = resolveMimeType(file);
  const allowed = ALLOWED_FILE_TYPES[mime];
  if (!allowed) {
    return { valid: false, errorKey: "pseudonymization.file.error-type" };
  }

  // 2. Size check
  if (file.size > allowed.maxBytes) {
    return { valid: false, errorKey: "pseudonymization.file.error-size" };
  }

  // 3. Empty file check
  if (file.size === 0) {
    return { valid: false, errorKey: "pseudonymization.file.error-empty" };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Plain Text Extraction (§2.2)
// ---------------------------------------------------------------------------

async function extractTextFromTxt(file: File): Promise<ExtractionResult> {
  const text = await file.text(); // Web API standard, defaults to UTF-8

  // NFC normalize (SF-4) — accent-safe matching
  const normalized = text.normalize("NFC");

  // .txt is a single "page"
  const boundaries: PageBoundary[] = [
    { page: 1, startOffset: 0, endOffset: normalized.length },
  ];

  return { text: normalized, boundaries };
}

// ---------------------------------------------------------------------------
// PDF Text Extraction (§2.3)
// ---------------------------------------------------------------------------

/**
 * Extract text from PDF using pdfjs-dist.
 * Worker is configured in pdfjs-init.ts (must be imported with ssr: false).
 */
async function extractTextFromPdf(
  file: File,
  onProgress?: (page: number, total: number) => void,
): Promise<ExtractionResult> {
  // Dynamic import to avoid SSR issues + initialize worker
  const { pdfjsLib } = await import("./pdfjs-init");

  const buffer = await file.arrayBuffer();
  const doc = await pdfjsLib.getDocument({ data: buffer }).promise;

  const pages: string[] = [];
  const boundaries: PageBoundary[] = [];
  let cumulativeOffset = 0;

  const totalPages = Math.min(doc.numPages, MAX_PDF_PAGES);

  for (let i = 1; i <= totalPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();

    const text = content.items
      .filter((item: any) => item.str !== undefined)
      .map((item: any) => item.str)
      .join(" ");

    pages.push(text);
    onProgress?.(i, totalPages);

    // Track page boundaries (§4.4)
    const pageStart = cumulativeOffset;
    const pageEnd = pageStart + text.length + 2; // +2 for "\n\n" separator
    boundaries.push({ page: i, startOffset: pageStart, endOffset: pageEnd });
    cumulativeOffset = pageEnd;
  }

  // Join pages with double newline separator (§2.3)
  const rawText = pages.join("\n\n");

  // NFC normalize (SF-4) — accent-safe matching
  const normalized = rawText.normalize("NFC");

  // SF-5: If truncated, return truncatedAtPage
  const truncatedAtPage = doc.numPages > MAX_PDF_PAGES ? totalPages : undefined;

  return { text: normalized, boundaries, truncatedAtPage };
}

// ---------------------------------------------------------------------------
// Unified Extraction Entry Point (§2.1)
// ---------------------------------------------------------------------------

/**
 * Extract text from supported file types (.txt, .pdf).
 * Applies NFC normalization and enforces size limits.
 */
export async function extractText(
  file: File,
  onProgress?: (page: number, total: number) => void,
): Promise<ExtractionResult> {
  const mime = resolveMimeType(file);

  let result: ExtractionResult;

  if (mime === "text/plain") {
    result = await extractTextFromTxt(file);
  } else if (mime === "application/pdf") {
    result = await extractTextFromPdf(file, onProgress);
  } else {
    throw new Error(`Unsupported MIME type: ${mime}`);
  }

  // Truncate if extracted text exceeds MAX_EXTRACTED_CHARS (§2.4)
  if (result.text.length > MAX_EXTRACTED_CHARS) {
    const truncated = result.text.slice(0, MAX_EXTRACTED_CHARS);

    // SF-5: Truncate boundaries to match processed text
    let truncatedBoundaries = result.boundaries.filter(
      (b) => b.startOffset < MAX_EXTRACTED_CHARS,
    );

    // Adjust the last boundary's endOffset to match truncated text length
    if (truncatedBoundaries.length > 0) {
      const lastIdx = truncatedBoundaries.length - 1;
      truncatedBoundaries = truncatedBoundaries.map((b, idx) =>
        idx === lastIdx && b.endOffset > MAX_EXTRACTED_CHARS
          ? { ...b, endOffset: MAX_EXTRACTED_CHARS }
          : b,
      );
    }

    return {
      text: truncated,
      boundaries: truncatedBoundaries,
      truncatedAtPage: truncatedBoundaries[truncatedBoundaries.length - 1]?.page,
    };
  }

  return result;
}

// ---------------------------------------------------------------------------
// Utility: Get Page for Character Offset (§4.4)
// ---------------------------------------------------------------------------

/**
 * Find which page a character offset belongs to.
 * Used to display "Seite X" in the review modal.
 */
export function getPageForOffset(
  offset: number,
  boundaries: PageBoundary[],
): number {
  for (const b of boundaries) {
    if (offset >= b.startOffset && offset < b.endOffset) {
      return b.page;
    }
  }
  // Fallback: last page
  return boundaries[boundaries.length - 1]?.page ?? 1;
}

// ---------------------------------------------------------------------------
// Constants Export (for tests and UI)
// ---------------------------------------------------------------------------

export const FILE_CONSTANTS = {
  MAX_EXTRACTED_CHARS,
  MAX_PDF_PAGES,
  ALLOWED_FILE_TYPES,
} as const;

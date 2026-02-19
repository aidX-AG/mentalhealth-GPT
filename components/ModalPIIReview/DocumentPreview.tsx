// components/ModalPIIReview/DocumentPreview.tsx
// ============================================================================
// SPEC-007b v1.2 §2.3 / §2.6 — Full-document view with inline highlights
//
// Accepts ReviewItem[] directly — no unsafe cast from DetectedPII[].
// ReviewItem.id and ReviewItem.accepted are the single source of truth;
// IDs are produced by makeReviewId() in usePIIReview.ts (exported).
//
// Segmentation algorithm (§2.3):
//   1. Filter items by overlap (not strictly "inside") so spans at slice edges render
//   2. Sort by start ascending; walk text, emit plain + DetectionSpan segments
//   3. cursor = Math.max(cursor, item.end) for robustness
//
// Pagination (§2.6):
//   - hasBoundaryPages (totalPages > 1): use real PageBoundary slices
//   - hasChunkPages (large text, single boundary): chunk at 100 k chars
//   - no pagination for short single-page text
//   - currentPage resets to 0 when text or boundaries change (new document)
// ============================================================================

import { useMemo, useState, useCallback, useEffect } from "react";
import type { ReviewItem } from "../../src/hooks/usePIIReview";
import type { PageBoundary } from "../../lib/pseudonymization/file-extract";
import { useI18n } from "@/lib/i18n-client";
import DetectionSpan from "./DetectionSpan";
import Legend from "./Legend";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TextSegment =
  | { type: "plain"; text: string; key: string }
  | { type: "item"; item: ReviewItem; key: string };

interface DocumentPreviewProps {
  text: string;
  items: ReviewItem[];           // from usePIIReview — has id, accepted, start, end
  pageBoundaries: PageBoundary[];
  onToggle: (id: string) => void;
  readOnly?: boolean;
}

// ---------------------------------------------------------------------------
// Segment builder
// ---------------------------------------------------------------------------

function buildSegments(
  text: string,
  items: ReviewItem[],
  sliceStart: number,
  sliceEnd: number,
): TextSegment[] {
  const segments: TextSegment[] = [];

  // Overlap filter: include items that overlap the slice (not just "fully inside"),
  // so detections at slice boundaries are never silently dropped.
  const visible = items.filter((i) => i.end > sliceStart && i.start < sliceEnd);

  // Sort by start offset (already merged/non-overlapping, but sort defensively)
  const sorted = [...visible].sort((a, b) => a.start - b.start);

  let cursor = sliceStart;
  let plainKey = 0;

  for (const item of sorted) {
    if (cursor < item.start) {
      segments.push({
        type: "plain",
        text: text.slice(cursor, item.start),
        key: `plain-${plainKey++}`,
      });
    }
    segments.push({
      type: "item",
      item,
      key: `item-${item.id}`,
    });
    // Robust cursor advance: skip past the item end even if items overlap slice edge
    cursor = Math.max(cursor, item.end);
  }

  if (cursor < sliceEnd) {
    segments.push({
      type: "plain",
      text: text.slice(cursor, sliceEnd),
      key: `plain-${plainKey++}`,
    });
  }

  return segments;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const LARGE_TEXT_THRESHOLD = 100_000;

const DocumentPreview = ({
  text,
  items,
  pageBoundaries,
  onToggle,
  readOnly = false,
}: DocumentPreviewProps) => {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(0);

  // Reset to page 0 when a new document is loaded
  useEffect(() => {
    setCurrentPage(0);
  }, [text, pageBoundaries.length]);

  const totalPages = pageBoundaries.length;
  const isLarge = text.length > LARGE_TEXT_THRESHOLD;

  const hasBoundaryPages = totalPages > 1;
  const hasChunkPages = !hasBoundaryPages && isLarge;
  const usePagination = hasBoundaryPages || hasChunkPages;

  const displayedTotalPages = useMemo(() => {
    if (!usePagination) return 1;
    if (hasBoundaryPages) return totalPages;
    return Math.max(1, Math.ceil(text.length / LARGE_TEXT_THRESHOLD));
  }, [usePagination, hasBoundaryPages, totalPages, text.length]);

  const safePage = Math.min(currentPage, Math.max(0, displayedTotalPages - 1));

  const { sliceStart, sliceEnd } = useMemo(() => {
    if (!usePagination) return { sliceStart: 0, sliceEnd: text.length };
    if (hasBoundaryPages) {
      const page = pageBoundaries[safePage];
      return { sliceStart: page.startOffset, sliceEnd: page.endOffset };
    }
    const start = safePage * LARGE_TEXT_THRESHOLD;
    return { sliceStart: start, sliceEnd: Math.min(start + LARGE_TEXT_THRESHOLD, text.length) };
  }, [usePagination, hasBoundaryPages, pageBoundaries, safePage, text.length]);

  const segments = useMemo(
    () => buildSegments(text, items, sliceStart, sliceEnd),
    [text, items, sliceStart, sliceEnd],
  );

  const handlePrev = useCallback(() => setCurrentPage((p: number) => Math.max(0, p - 1)), []);
  const handleNext = useCallback(
    () => setCurrentPage((p: number) => Math.min(displayedTotalPages - 1, p + 1)),
    [displayedTotalPages],
  );

  const pageIndicatorText = t("pseudonymization.review.page-indicator")
    .replace("{{current}}", String(safePage + 1))
    .replace("{{total}}", String(displayedTotalPages));

  return (
    <div className="flex flex-col gap-3">
      {/* Document text area */}
      <div className="relative rounded-xl border border-n-3 dark:border-n-5 bg-n-1 dark:bg-n-7 p-4 min-h-32 max-h-72 overflow-y-auto">
        <p className="text-sm leading-relaxed text-n-7 dark:text-n-1 whitespace-pre-wrap break-words">
          {segments.map((seg: TextSegment) =>
            seg.type === "plain" ? (
              <span key={seg.key}>{seg.text}</span>
            ) : (
              <DetectionSpan
                key={seg.key}
                item={seg.item}
                onToggle={onToggle}
                readOnly={readOnly}
              />
            ),
          )}
        </p>

        {/* Page indicator — sticky bottom-right */}
        {usePagination && (
          <div className="sticky bottom-0 right-0 flex justify-end pt-2 pointer-events-none">
            <span className="text-xs text-n-4 dark:text-n-3 bg-n-1 dark:bg-n-7 px-2 py-0.5 rounded-full border border-n-3 dark:border-n-5 pointer-events-auto">
              {pageIndicatorText}
            </span>
          </div>
        )}
      </div>

      {/* Page navigation */}
      {usePagination && displayedTotalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            disabled={safePage === 0}
            className="px-3 py-1 rounded-lg bg-n-2 dark:bg-n-6 text-n-6 dark:text-n-2 hover:bg-n-3 dark:hover:bg-n-5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
            aria-label={t("pseudonymization.review.prev-page")}
          >
            ← {t("pseudonymization.review.prev-page")}
          </button>

          <span className="text-xs text-n-4 dark:text-n-3">
            {safePage + 1} / {displayedTotalPages}
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={safePage >= displayedTotalPages - 1}
            className="px-3 py-1 rounded-lg bg-n-2 dark:bg-n-6 text-n-6 dark:text-n-2 hover:bg-n-3 dark:hover:bg-n-5 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
            aria-label={t("pseudonymization.review.next-page")}
          >
            {t("pseudonymization.review.next-page")} →
          </button>
        </div>
      )}

      {/* Legend — interactive mode only */}
      {!readOnly && <Legend />}
    </div>
  );
};

export default DocumentPreview;

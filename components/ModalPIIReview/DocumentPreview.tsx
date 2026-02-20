// components/ModalPIIReview/DocumentPreview.tsx
// ============================================================================
// SPEC-007b v1.2 §2.3 / §2.6 — Full-document view with inline highlights
// SPEC-007a §4.5  v1.1       — Manual PII marking via text selection
//
// Segmentation algorithm (§2.3):
//   1. Filter items by overlap so spans at slice edges render
//   2. Sort by start ascending; walk text, emit plain + DetectionSpan segments
//   3. cursor = Math.max(cursor, item.end) for robustness
//   Each plain segment carries a start offset in the full text (data-offset).
//
// Pagination (§2.6):
//   - hasBoundaryPages (totalPages > 1): use real PageBoundary slices
//   - hasChunkPages (large text, no boundaries): chunk at 100 k chars
//   - currentPage resets to 0 when text or boundaries change
//
// Manual marking (§4.5) — 5 hardening constraints:
//   1. NaN-safe resolveOffset via Number.isFinite()
//   2. Selection must be inside containerRef (no cross-modal selections)
//   3. Backward selection normalized (docStart/docEnd swapped if inverted)
//   4. Offsets clamped to current slice (sliceStart..sliceEnd)
//   5. Popup left/top viewport-clamped with fixed POPUP_W
// ============================================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReviewItem } from "../../src/hooks/usePIIReview";
import type { PageBoundary } from "../../lib/pseudonymization/file-extract";
import { useI18n } from "@/lib/i18n/I18nContext";
import DetectionSpan from "./DetectionSpan";
import Legend from "./Legend";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type TextSegment =
  | { type: "plain"; text: string; key: string; start: number }
  | { type: "item"; item: ReviewItem; key: string };

interface SelectionPopup {
  text: string;
  start: number;
  end: number;
  top: number;
  left: number;
}

interface DocumentPreviewProps {
  text: string;
  items: ReviewItem[];
  pageBoundaries: PageBoundary[];
  onToggle: (id: string) => void;
  onManualAdd?: (start: number, end: number, original: string) => void;
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
  const visible = items.filter((i) => i.end > sliceStart && i.start < sliceEnd);
  const sorted = [...visible].sort((a, b) => a.start - b.start);

  let cursor = sliceStart;
  let plainKey = 0;

  for (const item of sorted) {
    if (cursor < item.start) {
      segments.push({
        type: "plain",
        text: text.slice(cursor, item.start),
        key: `plain-${plainKey++}`,
        start: cursor, // absolute offset in full text — drives data-offset (§4.5.3)
      });
    }
    segments.push({ type: "item", item, key: `item-${item.id}` });
    cursor = Math.max(cursor, item.end);
  }

  if (cursor < sliceEnd) {
    segments.push({
      type: "plain",
      text: text.slice(cursor, sliceEnd),
      key: `plain-${plainKey++}`,
      start: cursor,
    });
  }

  return segments;
}

// ---------------------------------------------------------------------------
// Offset resolver — SPEC-007a §4.5.3, hardening fix #1 (NaN-safe)
// ---------------------------------------------------------------------------

function resolveOffset(node: Node, intraOffset: number): number | null {
  let el: Element | null =
    node.nodeType === Node.TEXT_NODE
      ? (node as Text).parentElement
      : (node as Element);
  while (el) {
    const attr = el.getAttribute("data-offset");
    if (attr !== null) {
      const base = Number(attr);
      if (!Number.isFinite(base)) return null; // NaN/Infinity guard
      return base + intraOffset;
    }
    el = el.parentElement;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const LARGE_TEXT_THRESHOLD = 100_000;
const POPUP_W = 220; // px — used for viewport clamping (hardening fix #5), sized for longest translation

const DocumentPreview = ({
  text,
  items,
  pageBoundaries,
  onToggle,
  onManualAdd,
  readOnly = false,
}: DocumentPreviewProps) => {
  const { t } = useI18n();
  const [currentPage, setCurrentPage] = useState(0);
  const [popup, setPopup] = useState<SelectionPopup | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(0);
  }, [text, pageBoundaries.length]);

  // Dismiss popup on outside click
  useEffect(() => {
    if (!popup) return;
    const dismiss = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-manual-popup]")) return;
      setPopup(null);
    };
    document.addEventListener("mousedown", dismiss);
    return () => document.removeEventListener("mousedown", dismiss);
  }, [popup]);

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

  // -------------------------------------------------------------------------
  // Manual marking — SPEC-007a §4.5 with all 5 hardening fixes
  // -------------------------------------------------------------------------

  const handleMouseUp = useCallback(() => {
    if (readOnly || !onManualAdd) return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setPopup(null);
      return;
    }

    const selectedText = sel.toString().trim();
    if (selectedText.length < 1) {
      setPopup(null);
      return;
    }

    const range = sel.getRangeAt(0);

    // Hardening fix #2: selection must be inside the preview container
    const container = containerRef.current;
    if (!container) { setPopup(null); return; }
    const commonNode = range.commonAncestorContainer;
    const commonEl =
      commonNode.nodeType === Node.ELEMENT_NODE
        ? (commonNode as Element)
        : commonNode.parentElement;
    if (!commonEl || !container.contains(commonEl)) {
      setPopup(null);
      return;
    }

    // Resolve endpoints to absolute text offsets
    const rawStart = resolveOffset(range.startContainer, range.startOffset);
    const rawEnd   = resolveOffset(range.endContainer,   range.endOffset);
    if (rawStart === null || rawEnd === null) {
      setPopup(null); // inside DetectionSpan or unresolvable
      return;
    }

    // Hardening fix #3: normalize backward selections
    const start = Math.min(rawStart, rawEnd);
    const end   = Math.max(rawStart, rawEnd);
    if (start === end) { setPopup(null); return; }

    // Hardening fix #4: clamp to current slice
    if (start < sliceStart || end > sliceEnd) {
      setPopup(null);
      return;
    }

    // Hardening fix #5: viewport-clamped popup position
    const rect = range.getBoundingClientRect();
    const xCenter = rect.left + (rect.width || 0) / 2;
    const left = Math.min(
      window.innerWidth - POPUP_W - 8,
      Math.max(8, xCenter - POPUP_W / 2),
    );
    const top = Math.max(8, rect.top - 44);

    setPopup({ text: selectedText, start, end, top, left });
  }, [readOnly, onManualAdd, sliceStart, sliceEnd]);

  const handleManualAdd = useCallback(() => {
    if (!popup || !onManualAdd) return;
    onManualAdd(popup.start, popup.end, popup.text);
    setPopup(null);
    window.getSelection()?.removeAllRanges();
  }, [popup, onManualAdd]);

  const pageIndicatorText = t("pseudonymization.review.page-indicator")
    .replace("{{current}}", String(safePage + 1))
    .replace("{{total}}", String(displayedTotalPages));

  return (
    <div className="flex flex-col gap-3">

      {/* Floating popup — fixed in viewport, above selection */}
      {popup && !readOnly && onManualAdd && (
        <div
          data-manual-popup="true"
          style={{ position: "fixed", top: popup.top, left: popup.left, zIndex: 9999 }}
          onMouseDown={(e: any) => e.preventDefault()} // prevent deselection on click
        >
          <button
            type="button"
            onClick={handleManualAdd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary-2 text-white text-xs font-medium shadow-lg hover:bg-primary-1 transition-colors"
          >
            <span aria-hidden="true">✎</span>
            {t("pseudonymization.review.mark-as-pii")}
          </button>
        </div>
      )}

      {/* Document text area */}
      <div
        ref={containerRef}
        className="relative rounded-xl border border-n-3 dark:border-n-5 bg-n-1 dark:bg-n-7 p-4 min-h-32 max-h-[22rem] overflow-y-auto"
        onMouseUp={handleMouseUp}
      >
        <p className="text-sm leading-relaxed text-n-7 dark:text-n-1 whitespace-pre-wrap break-words">
          {segments.map((seg: TextSegment) =>
            seg.type === "plain" ? (
              // data-offset enables offset resolution for manual marking (§4.5.3)
              <span key={seg.key} data-offset={seg.start}>{seg.text}</span>
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

        {usePagination && (
          <div className="sticky bottom-0 right-0 flex justify-end pt-2 pointer-events-none">
            <span className="text-xs text-n-4 dark:text-n-3 bg-n-1 dark:bg-n-7 px-2 py-0.5 rounded-full border border-n-3 dark:border-n-5 pointer-events-auto">
              {pageIndicatorText}
            </span>
          </div>
        )}
      </div>

      {/* Manual marking hint */}
      {!readOnly && onManualAdd && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span aria-hidden="true">✎</span>
          {t("pseudonymization.review.manual-hint")}
        </p>
      )}

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

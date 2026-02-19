// components/ModalPIIReview/index.tsx
// ============================================================================
// SPEC-007 v1.4 / SPEC-007a v1.1 / SPEC-007b v1.1 — PII Review Modal
//
// Phase 1 (SPEC-007b): Replaced word-list with full DocumentPreview.
// When `extractedText` is supplied (file mode) → DocumentPreview with inline
// highlights. Fallback (no extractedText) → word-list (chat mode compat).
//
// SF-8: documentLabel is generated metadata — NEVER file.name.
// CTA: "Pseudonymisieren & Anhängen" (file) / "Send" (chat).
// UX: Send button disabled + hint when acceptedCount === 0.
// ============================================================================

import Modal from "@/components/Modal";
import Checkbox from "@/components/Checkbox";
import { useI18n } from "@/lib/i18n/I18nContext";
import type { ReviewItem } from "../../src/hooks/usePIIReview";
import type { PageBoundary } from "../../lib/pseudonymization/file-extract";
import DocumentPreview from "./DocumentPreview";

type ModalPIIReviewProps = {
  visible: boolean;
  onClose: () => void;
  items: ReviewItem[];
  onToggle: (id: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSend: () => void;
  sending?: boolean;
  mode?: "chat" | "file";
  // SPEC-007b Phase 1: document preview (file mode)
  documentLabel?: string;      // SF-8: generated label, never file.name
  extractedText?: string;      // if provided → DocumentPreview instead of word-list
  pageBoundaries?: PageBoundary[];
  // SPEC-007a: page numbers in word-list fallback
  getPageNumber?: (item: ReviewItem) => number | undefined;
};

const ModalPIIReview = ({
  visible,
  onClose,
  items,
  onToggle,
  onAcceptAll,
  onRejectAll,
  onSend,
  sending = false,
  mode = "chat",
  documentLabel,
  extractedText,
  pageBoundaries = [],
  getPageNumber,
}: ModalPIIReviewProps) => {
  const { t } = useI18n();

  const showDocumentPreview = mode === "file" && !!extractedText;

  const buttonLabel =
    mode === "file"
      ? t("pseudonymization.review.attach-button")
      : t("pseudonymization.buttons.send");

  const acceptedCount = items.filter((i) => i.accepted).length;
  const noAccepted = acceptedCount === 0 && items.length > 0;

  // Word-list fallback helpers
  const truncateText = (text: string): string =>
    text.length <= 40 ? text : text.slice(0, 37) + "...";

  const getCategoryLabel = (category: string): string =>
    t(`pseudonymization.labels.category-${category.toLowerCase()}`);

  const getConfidenceIndicator = (item: ReviewItem) => {
    if (item.source === "regex" || (item.source === "ner" && item.confidence >= 0.85)) {
      return { color: "bg-primary-2", label: t("pseudonymization.labels.pii-secure") };
    }
    if (item.source === "ner" && item.confidence >= 0.6) {
      return { color: "bg-accent-5", label: t("pseudonymization.labels.pii-uncertain") };
    }
    if (item.source === "dictionary") {
      return { color: "bg-primary-1", label: t("pseudonymization.labels.fachbegriff") };
    }
    return { color: "bg-n-4", label: t("pseudonymization.labels.pii-secure") };
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="p-8 md:p-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-1 text-n-7 dark:text-n-1">
          {t("pseudonymization.review.title")}
        </h2>

        {/* Document label + count — SF-8: no filename */}
        {documentLabel && (
          <p className="text-sm text-n-4 dark:text-n-3 mb-4">
            {documentLabel}
            {items.length > 0 && (
              <span className="ml-2">
                {"· "}
                {items.length === 1
                  ? t("pseudonymization.review.detection-singular")
                  : t("pseudonymization.review.detection-plural").replace(
                      "{{count}}",
                      String(items.length),
                    )}
              </span>
            )}
          </p>
        )}

        {/* Description — word-list mode only */}
        {!showDocumentPreview && (
          <p className="text-base text-n-4 dark:text-n-3 mb-6">
            {t("pseudonymization.review.description")}
          </p>
        )}

        {/* ── DOCUMENT PREVIEW (SPEC-007b Phase 1) ────────────────────── */}
        {showDocumentPreview ? (
          <div className="mb-4">
            <DocumentPreview
              text={extractedText!}
              items={items}
              pageBoundaries={pageBoundaries}
              onToggle={onToggle}
            />
          </div>
        ) : (
          /* ── WORD-LIST FALLBACK (chat mode / no extractedText) ──────── */
          <>
            {items.length === 0 ? (
              <div className="p-6 text-center text-n-4 dark:text-n-3 bg-n-2 dark:bg-n-6 rounded-xl mb-6">
                {t("pseudonymization.review.no-detections")}
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto mb-6 space-y-3">
                {items.map((item) => {
                  const indicator = getConfidenceIndicator(item);
                  const pageNum =
                    mode === "file" && getPageNumber ? getPageNumber(item) : undefined;
                  return (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 p-3 bg-n-2 dark:bg-n-6 rounded-xl hover:bg-n-3 dark:hover:bg-n-5/50 transition-colors"
                    >
                      <div className="pt-0.5">
                        <Checkbox
                          checked={item.accepted}
                          onCheckedChange={() => onToggle(item.id)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span
                            className="font-medium text-n-7 dark:text-n-1 break-words"
                            title={item.original}
                          >
                            {truncateText(item.original)}
                          </span>
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-n-3 dark:bg-n-5 text-n-6 dark:text-n-3 whitespace-nowrap">
                            [{getCategoryLabel(item.category)}]
                          </span>
                          {pageNum !== undefined && (
                            <span className="text-xs text-n-4 whitespace-nowrap">
                              S.{pageNum}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-n-4 dark:text-n-3">
                          <span
                            className={`inline-block w-2 h-2 rounded-full ${indicator.color}`}
                          />
                          <span>{indicator.label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* UX hint when all detections rejected → explains why Send is disabled */}
        {noAccepted && (
          <p className="text-xs text-accent-5 mb-3">
            {t("pseudonymization.review.hint-select-one")}
          </p>
        )}

        {/* Footer Buttons */}
        <div className="flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={onAcceptAll}
            disabled={sending || items.length === 0}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-n-3 text-n-7 hover:bg-n-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-n-5 dark:text-n-1 dark:hover:bg-n-4"
          >
            {t("pseudonymization.buttons.accept-all")}
          </button>

          <button
            type="button"
            onClick={onRejectAll}
            disabled={sending || items.length === 0}
            className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-n-3 text-n-6 hover:border-n-4 hover:text-n-7 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-n-5 dark:text-n-3 dark:hover:border-n-4 dark:hover:text-n-1"
          >
            {t("pseudonymization.buttons.reject-all")}
          </button>

          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-n-3 text-n-6 hover:border-n-4 hover:text-n-7 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-n-5 dark:text-n-3 dark:hover:border-n-4 dark:hover:text-n-1"
          >
            {t("pseudonymization.buttons.cancel")}
          </button>

          {/* "Pseudonymisieren & Anhängen" (file) / "Send" (chat) */}
          <button
            type="button"
            onClick={onSend}
            disabled={sending || acceptedCount === 0}
            className="px-6 py-2 text-sm font-medium rounded-xl bg-primary-1 text-n-1 hover:bg-primary-1/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {sending ? t("pseudonymization.status.processing") : buttonLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalPIIReview;

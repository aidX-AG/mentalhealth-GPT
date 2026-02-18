// components/ModalPIIReview/index.tsx
// ============================================================================
// SPEC-007 v1.4 / SPEC-007a v1.1 — PII Review Modal
//
// Shows detected PII for user review before sending/uploading.
// Supports both chat messages (SPEC-007) and file uploads (SPEC-007a).
//
// Features:
//   - Checkbox per item (id-based toggle — SF-2)
//   - Category badges ([PERSON], [DATUM], etc.)
//   - Confidence indicators (green/gold/blue dots)
//   - Truncated text with full tooltip (title attribute — SF-3)
//   - Accept All / Reject All / Cancel / Send buttons
//   - File mode: Shows page numbers (S.1, S.2, etc.) + "Upload" button
//   - Chat mode: "Send" button
// ============================================================================

import Modal from "@/components/Modal";
import Checkbox from "@/components/Checkbox";
import { useI18n } from "@/lib/i18n-client";
import type { ReviewItem } from "../../src/hooks/usePIIReview";

type ModalPIIReviewProps = {
  visible: boolean;
  onClose: () => void;
  items: ReviewItem[];
  onToggle: (id: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onSend: () => void;
  sending?: boolean;
  mode?: "chat" | "file"; // SPEC-007a: file mode shows page numbers + "Upload" button
  getPageNumber?: (item: ReviewItem) => number | undefined; // SPEC-007a §4.4
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
  getPageNumber,
}: ModalPIIReviewProps) => {
  const { t } = useI18n();

  // Button label: "Send" (chat) vs "Upload" (file)
  const buttonLabel =
    mode === "file"
      ? t("pseudonymization.file.upload-button")
      : t("pseudonymization.buttons.send");

  // Truncate text if > 40 chars, show full in tooltip (SF-3)
  const truncateText = (text: string): string => {
    if (text.length <= 40) return text;
    return text.slice(0, 37) + "...";
  };

  // Category label key
  const getCategoryLabel = (category: string): string => {
    return t(`pseudonymization.labels.category-${category.toLowerCase()}`);
  };

  // Confidence indicator
  const getConfidenceIndicator = (item: ReviewItem) => {
    const isRegex = item.source === "regex";
    const isNER = item.source === "ner";
    const isDictionary = item.source === "dictionary";

    // Green: Regex or high-confidence NER
    if (isRegex || (isNER && item.confidence >= 0.85)) {
      return {
        color: "bg-primary-2",
        label: t("pseudonymization.labels.pii-secure"),
      };
    }

    // Gold: Medium-confidence NER (0.60-0.85)
    if (isNER && item.confidence >= 0.6) {
      return {
        color: "bg-accent-5",
        label: t("pseudonymization.labels.pii-uncertain"),
      };
    }

    // Blue: Dictionary
    if (isDictionary) {
      return {
        color: "bg-primary-1",
        label: t("pseudonymization.labels.fachbegriff"),
      };
    }

    // Fallback
    return {
      color: "bg-n-4",
      label: t("pseudonymization.labels.pii-secure"),
    };
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="p-8 md:p-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-2 text-n-7 dark:text-n-1">
          {t("pseudonymization.review.title")}
        </h2>

        {/* Description */}
        <p className="text-base text-n-4 dark:text-n-3 mb-6">
          {t("pseudonymization.review.description")}
        </p>

        {/* Detection List */}
        {items.length === 0 ? (
          <div className="p-6 text-center text-n-4 dark:text-n-3 bg-n-2 dark:bg-n-6 rounded-xl">
            {t("pseudonymization.review.no-detections")}
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto mb-6 space-y-3">
            {items.map((item) => {
              const indicator = getConfidenceIndicator(item);
              const pageNum = mode === "file" && getPageNumber ? getPageNumber(item) : undefined;

              return (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 bg-n-2 dark:bg-n-6 rounded-xl hover:bg-n-3 dark:hover:bg-n-5/50 transition-colors"
                >
                  {/* Checkbox */}
                  <div className="pt-0.5">
                    <Checkbox
                      checked={item.accepted}
                      onCheckedChange={() => onToggle(item.id)}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    {/* Original text + Category badge */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="font-medium text-n-7 dark:text-n-1 break-words"
                        title={item.original} // SF-3: Full text in tooltip
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

                    {/* Confidence indicator */}
                    <div className="flex items-center gap-2 text-xs text-n-4 dark:text-n-3">
                      <span className={`inline-block w-2 h-2 rounded-full ${indicator.color}`} />
                      <span>{indicator.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex flex-wrap gap-3 justify-end">
          {/* Accept All */}
          <button
            onClick={onAcceptAll}
            disabled={sending || items.length === 0}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-n-3 text-n-7 hover:bg-n-4 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-n-5 dark:text-n-1 dark:hover:bg-n-4"
          >
            {t("pseudonymization.buttons.accept-all")}
          </button>

          {/* Reject All */}
          <button
            onClick={onRejectAll}
            disabled={sending || items.length === 0}
            className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-n-3 text-n-6 hover:border-n-4 hover:text-n-7 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-n-5 dark:text-n-3 dark:hover:border-n-4 dark:hover:text-n-1"
          >
            {t("pseudonymization.buttons.reject-all")}
          </button>

          {/* Cancel */}
          <button
            onClick={onClose}
            disabled={sending}
            className="px-4 py-2 text-sm font-medium rounded-xl border-2 border-n-3 text-n-6 hover:border-n-4 hover:text-n-7 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:border-n-5 dark:text-n-3 dark:hover:border-n-4 dark:hover:text-n-1"
          >
            {t("pseudonymization.buttons.cancel")}
          </button>

          {/* Send / Upload */}
          <button
            onClick={onSend}
            disabled={sending || items.filter((i) => i.accepted).length === 0}
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

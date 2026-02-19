// components/AttachmentChip/index.tsx
// ============================================================================
// SPEC-007b §3.3 — Post-confirm attachment chip above prompt field
//
// Shown ONLY after a successful file upload + pseudonymization.
// PRECONDITION: Parent must guard with `pseudonymizedText !== null` before
// rendering this chip — documentLabel alone is NOT a success signal.
//
// SF-8: documentLabel is generated metadata (mimeType + pageCount).
//       file.name must NEVER reach this component.
//
// Accessibility:
// - Chip <button>: opens read-only preview (onClick), aria-label with label
// - Remove <button>: clears attachment (onRemove), i18n aria-label
// ============================================================================

import { useI18n } from "@/lib/i18n/I18nContext";

interface AttachmentChipProps {
  documentLabel: string; // e.g. "PDF-Dokument (12 Seiten)" — never file.name (SF-8)
  onRemove: () => void; // clears attachment state (pseudonymizedText + documentLabel)
  onClick: () => void; // opens read-only ModalDocumentPreview
}

const AttachmentChip = ({ documentLabel, onRemove, onClick }: AttachmentChipProps) => {
  const { t } = useI18n();

  return (
    <div className="mx-10 mb-2 2xl:mx-6 md:mx-4 flex items-center gap-1">
      {/* Chip — click opens read-only preview */}
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-n-2 dark:bg-n-6 border border-n-3 dark:border-n-5 text-n-6 dark:text-n-3 text-sm hover:bg-n-3 dark:hover:bg-n-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 transition-colors max-w-xs"
        aria-label={`${t("pseudonymization.attachment.preview")}: ${documentLabel}`}
      >
        {/* Inline document SVG — no file icon in the project's Icon component */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-4 h-4 flex-shrink-0 text-primary-1"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8 17a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2H8zm0-4a1 1 0 1 1 0-2h8a1 1 0 1 1 0 2H8z" />
        </svg>

        <span className="truncate">{documentLabel}</span>
      </button>

      {/* Remove button — ✕ clears attachment state */}
      <button
        type="button"
        onClick={onRemove}
        className="p-1.5 rounded-lg text-n-4 hover:text-accent-1 hover:bg-accent-1/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-1 transition-colors flex-shrink-0"
        aria-label={t("pseudonymization.attachment.remove")}
      >
        {/* close-fat SVG path from the project's Icon component */}
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          <path d="M6.919 4.815l.141.125L12 9.878l4.939-4.938a1.5 1.5 0 0 1 2.246 1.98l-.125.141L14.121 12l4.94 4.939a1.5 1.5 0 0 1-1.98 2.246l-.141-.125L12 14.121l-4.939 4.94a1.5 1.5 0 0 1-2.246-1.98l.125-.141L9.878 12 4.939 7.061a1.5 1.5 0 0 1 1.828-2.35l.152.104z" />
        </svg>
      </button>
    </div>
  );
};

export default AttachmentChip;

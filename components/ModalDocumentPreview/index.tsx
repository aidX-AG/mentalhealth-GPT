// components/ModalDocumentPreview/index.tsx
// ============================================================================
// SPEC-007b §3.4 — Read-only post-confirm document preview modal
//
// Opened from the AttachmentChip (post-upload, post-review success).
//
// Owner re-personalization (ADR-003 / SPEC-007b §3.4):
//   - mapping prop is available only for the owner (same client, has MK).
//   - When mapping != null → toggle "Originale anzeigen" re-personalizes client-side.
//   - Depseudonymization is client-only — mapping never sent to server.
//   - When mapping is null (forwarded/other user) → pseudonymized text only.
//
// SF-8: documentLabel is generated metadata — NEVER file.name.
// ============================================================================

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { useI18n } from "@/lib/i18n-client";
import { depseudonymize } from "../../lib/pseudonymization";
import type { PseudonymizationMapping } from "../../lib/pseudonymization";

interface ModalDocumentPreviewProps {
  visible: boolean;
  onClose: () => void;
  documentLabel: string; // e.g. "PDF-Dokument (12 Seiten)" — never file.name (SF-8)
  pseudonymizedText: string; // contains ⟦CATEGORY:NNN⟧ tokens
  mapping?: PseudonymizationMapping | null; // owner-only; null = show pseudonymized only
}

const ModalDocumentPreview = ({
  visible,
  onClose,
  documentLabel,
  pseudonymizedText,
  mapping = null,
}: ModalDocumentPreviewProps) => {
  const { t } = useI18n();
  const [reveal, setReveal] = useState(false);

  const canReveal = mapping != null;

  // Reset reveal when modal closes or when the document changes
  useEffect(() => {
    if (!visible) setReveal(false);
  }, [visible]);

  useEffect(() => {
    setReveal(false);
  }, [documentLabel, pseudonymizedText]);

  // Re-personalize client-side when owner toggles reveal (never sent to server)
  const shownText = useMemo(() => {
    if (!reveal || !mapping) return pseudonymizedText;

    try {
      return depseudonymize(pseudonymizedText, mapping);
    } catch {
      // Safety fallback: never block preview due to mapping issues
      return pseudonymizedText;
    }
  }, [reveal, mapping, pseudonymizedText]);

  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="p-8 md:p-6">
        {/* Title */}
        <h2 className="text-2xl font-semibold mb-1 text-n-7 dark:text-n-1">
          {t("pseudonymization.attachment.modal-title")}
        </h2>

        {/* Document label + reveal toggle row */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <p className="text-sm text-n-4 dark:text-n-3">{documentLabel}</p>

          {/* Owner-only: toggle between pseudonymized and original */}
          {canReveal && (
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              className="flex-shrink-0 text-xs px-3 py-1 rounded-lg border border-n-3 dark:border-n-5 text-n-6 dark:text-n-3 hover:bg-n-2 dark:hover:bg-n-6 transition-colors"
              aria-pressed={reveal}
              aria-label={
                reveal
                  ? t("pseudonymization.attachment.show-pseudonymized")
                  : t("pseudonymization.attachment.show-original")
              }
            >
              {reveal
                ? t("pseudonymization.attachment.show-pseudonymized")
                : t("pseudonymization.attachment.show-original")}
            </button>
          )}
        </div>

        {/* Text area — read-only */}
        <div className="rounded-xl border border-n-3 dark:border-n-5 bg-n-1 dark:bg-n-7 p-4 min-h-32 max-h-96 overflow-y-auto mb-6">
          <pre className="text-sm leading-relaxed text-n-7 dark:text-n-1 whitespace-pre-wrap break-words font-mono">
            {shownText}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-xl bg-n-3 text-n-7 hover:bg-n-4 transition-colors dark:bg-n-5 dark:text-n-1 dark:hover:bg-n-4"
          >
            {t("pseudonymization.buttons.cancel")}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDocumentPreview;

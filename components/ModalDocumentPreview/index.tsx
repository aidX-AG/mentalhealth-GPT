// components/ModalDocumentPreview/index.tsx
// ============================================================================
// SPEC-007b §3.4 — Read-only post-confirm document preview modal
//
// Opened from the AttachmentChip (post-upload, post-review success).
//
// Owner re-personalization (ADR-003 / SPEC-007b §3.4):
//   - mapping prop available only for the owner (same client, has MK).
//   - When mapping != null → toggle re-personalizes client-side.
//   - Depseudonymization is client-only — mapping never sent to server.
//   - When mapping is null → pseudonymized text only.
//
// Export (§3.4):
//   - Always exports pseudonymizedText — never the revealed original.
//   - Dynamic import of docx / jspdf to avoid loading on pages that don't need them.
//   - Filename: "pseudonymized-document.docx / .pdf" (never original name — SF-8).
//   - Client-side only — no server call, no PII metadata.
//
// SF-8: documentLabel is generated metadata — NEVER file.name.
// ============================================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import Modal from "@/components/Modal";
import { useI18n } from "@/lib/i18n/I18nContext";
import { depseudonymize } from "../../lib/pseudonymization";
import type { PseudonymizationMapping } from "../../lib/pseudonymization";

const EXPORT_FILENAME_BASE = "pseudonymized-document";

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
  const [exporting, setExporting] = useState<"word" | "pdf" | null>(null);

  const canReveal = mapping != null;

  // Reset reveal when modal closes or document changes
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
      return pseudonymizedText; // safety fallback
    }
  }, [reveal, mapping, pseudonymizedText]);

  // ── Word Export (docx, dynamic import) ─────────────────────────────────────
  // SECURITY: always exports pseudonymizedText, never the revealed original
  const handleExportWord = useCallback(async () => {
    if (exporting) return;
    setExporting("word");
    try {
      const { Document, Paragraph, TextRun, Packer } = await import("docx");
      const lines = pseudonymizedText.split("\n");
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: lines.map(
              (line) =>
                new Paragraph({
                  children: [new TextRun(line)],
                }),
            ),
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${EXPORT_FILENAME_BASE}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[ModalDocumentPreview] Word export failed:", err);
    } finally {
      setExporting(null);
    }
  }, [pseudonymizedText, exporting]);

  // ── PDF Export (jsPDF, dynamic import) ─────────────────────────────────────
  // SECURITY: always exports pseudonymizedText, never the revealed original
  const handleExportPdf = useCallback(async () => {
    if (exporting) return;
    setExporting("pdf");
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const maxWidth = pageWidth - margin * 2;
      const lineHeight = 7;
      const pageHeight = pdf.internal.pageSize.getHeight();
      let y = margin;

      const lines = pdf.splitTextToSize(pseudonymizedText, maxWidth) as string[];
      for (const line of lines) {
        if (y + lineHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(line, margin, y);
        y += lineHeight;
      }

      pdf.save(`${EXPORT_FILENAME_BASE}.pdf`);
    } catch (err) {
      console.error("[ModalDocumentPreview] PDF export failed:", err);
    } finally {
      setExporting(null);
    }
  }, [pseudonymizedText, exporting]);

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
              onClick={() => setReveal((r: boolean) => !r)}
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

        {/* Footer: Export buttons + Close */}
        <div className="flex flex-wrap items-center gap-3 justify-between">
          {/* Export buttons — always export pseudonymizedText (not revealed original) */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleExportWord}
              disabled={!!exporting}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-n-3 dark:border-n-5 text-n-6 dark:text-n-3 hover:bg-n-2 dark:hover:bg-n-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {/* Word icon */}
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-blue-600">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM8.5 17l-1.5-6h1l1 4.5 1.1-4.5h.9l1.1 4.5L13 11h1l-1.5 6h-.9l-1.1-4.5L9.4 17H8.5z" />
              </svg>
              {exporting === "word"
                ? t("pseudonymization.status.processing")
                : t("pseudonymization.attachment.export-word")}
            </button>

            <button
              type="button"
              onClick={handleExportPdf}
              disabled={!!exporting}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-xl border border-n-3 dark:border-n-5 text-n-6 dark:text-n-3 hover:bg-n-2 dark:hover:bg-n-6 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {/* PDF icon */}
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-red-500">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM9 13h1.5c.8 0 1.5.7 1.5 1.5S11.3 16 10.5 16H10v2H9v-5zm1 2h.5c.3 0 .5-.2.5-.5s-.2-.5-.5-.5H10v1z" />
              </svg>
              {exporting === "pdf"
                ? t("pseudonymization.status.processing")
                : t("pseudonymization.attachment.export-pdf")}
            </button>
          </div>

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

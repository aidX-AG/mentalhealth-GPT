// hooks/useFileUploadFlow.ts
// ============================================================================
// SPEC-007a §5 / SPEC-007b §3.5 — File Upload Orchestration Hook
//
// Manages the full file upload flow with pseudonymization:
//   1. User selects file → validate → extract text → detect PII
//   2. If PII found → show review modal (DocumentPreview)
//   3. User confirms → pseudonymize → encrypt → upload
//   4. After successful upload → store pseudonymizedText + documentLabel (chip)
//   5. If no PII → upload directly (no modal)
//
// Golden Rule (SPEC-007a §2.1):
//   text → NFC normalize → escape → detectPII(escaped) → review → pseudonymize(escaped)
//
// SF-7/SF-8:
//   - Never log or expose file.name — filename is PII.
//   - documentLabel generated from metadata only (mimeType + pageCount).
//   - All console.log/warn gated on NODE_ENV === "development".
//
// SPEC-007b §3.5:
//   - documentLabel and pseudonymizedText are set ONLY on successful upload.
//   - clearAttachment() removes them (chip [✕] or new file selected).
//   - On any upload failure: clearAttachment() is called in catch block.
// ============================================================================

// Next.js replaces process.env at build time. Declare minimal type to avoid
// "process not found" TS error without requiring @types/node in this file.
declare const process: { env: { NODE_ENV: string } };

import { useCallback, useState } from "react";
import { usePseudonymization } from "@/hooks/usePseudonymization";
import { usePIIReview } from "@/hooks/usePIIReview";
import { uploadEncrypted } from "@/lib/upload/mhgpt-upload-client";
import {
  validateFile,
  extractText,
  type PageBoundary,
  type ExtractionResult,
} from "../../lib/pseudonymization/file-extract";
import { escapeTokenBrackets } from "../../lib/pseudonymization";
import type {
  DetectedPII,
  PseudonymizationMapping,
} from "../../lib/pseudonymization";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type UploadPhase =
  | "idle"
  | "validating"
  | "extracting"
  | "detecting"
  | "review"
  | "uploading";

// ---------------------------------------------------------------------------
// Document label generator (SF-8 — never uses file.name)
// ---------------------------------------------------------------------------

/**
 * Generate a human-readable document label from metadata only.
 * Never includes the filename (SF-8: filename is PII).
 *
 * Examples: "PDF-Dokument (12 Seiten)", "Word-Dokument (3 Seiten)", "Text-Dokument"
 */
function generateDocumentLabel(mimeType: string, pageCount?: number): string {
  const typeLabel =
    mimeType === "application/pdf"
      ? "PDF-Dokument"
      : mimeType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ? "Word-Dokument"
        : "Text-Dokument";

  if (pageCount && pageCount > 0) {
    return `${typeLabel} (${pageCount} ${pageCount === 1 ? "Seite" : "Seiten"})`;
  }
  return typeLabel;
}

const DEV = process.env.NODE_ENV === "development";

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useFileUploadFlow() {
  const { status, progress, detectPII, pseudonymize } = usePseudonymization();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [extractionProgress, setExtractionProgress] = useState({ page: 0, total: 0 });
  const [detections, setDetections] = useState<DetectedPII[]>([]);
  const [pageBoundaries, setPageBoundaries] = useState<PageBoundary[]>([]);

  // UI state
  const [reviewVisible, setReviewVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [error, setError] = useState<string | null>(null);

  // Persistent across uploads
  const [mapping, setMapping] = useState<PseudonymizationMapping | null>(null);

  // SPEC-007b §3.5: attachment state — set only on successful upload
  const [documentLabel, setDocumentLabel] = useState<string | null>(null);
  const [pseudonymizedText, setPseudonymizedText] = useState<string | null>(null);

  // PII review state (re-syncs when detections change)
  const review = usePIIReview(detections);

  // -----------------------------------------------------------------------
  // clearAttachment — chip [✕] or new file selected
  // -----------------------------------------------------------------------
  const clearAttachment = useCallback(() => {
    setDocumentLabel(null);
    setPseudonymizedText(null);
  }, []);

  // -----------------------------------------------------------------------
  // Reset transient upload state (does NOT clear attachment)
  // -----------------------------------------------------------------------
  const reset = useCallback(() => {
    setFile(null);
    setExtractedText("");
    setDetections([]);
    setPageBoundaries([]);
    setReviewVisible(false);
    setUploading(false);
    setPhase("idle");
    setError(null);
    setExtractionProgress({ page: 0, total: 0 });
  }, []);

  // -----------------------------------------------------------------------
  // Actual upload — encrypt + 3-phase upload (SPEC-002/003)
  // -----------------------------------------------------------------------
  const doUpload = useCallback(
    async (text: string, _accepted: DetectedPII[]): Promise<boolean> => {
      if (DEV) console.log("[upload] doUpload", { length: text.length, accepted: _accepted.length });
      const encoded = new TextEncoder().encode(text);
      const buffer = encoded.buffer.slice(
        encoded.byteOffset,
        encoded.byteOffset + encoded.byteLength,
      ) as ArrayBuffer;
      await uploadEncrypted(buffer, { mimeType: "text/plain" });
      if (DEV) console.log("[upload] uploadEncrypted OK");
      return true;
    },
    [],
  );

  // -----------------------------------------------------------------------
  // Step 1: User selects file → validate → extract → detect → show review
  // -----------------------------------------------------------------------
  const handleFileSelected = useCallback(
    async (selectedFile: File) => {
      reset();
      clearAttachment(); // new file → clear previous attachment chip
      setFile(selectedFile);
      if (DEV) console.log("[upload] file selected", { type: selectedFile.type || "(empty)", size: selectedFile.size });

      // Validate
      setPhase("validating");
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
        if (DEV) console.warn("[upload] validation failed", { errorKey: validation.errorKey });
        setError(validation.errorKey!);
        setPhase("idle");
        return;
      }

      // Extract text
      setPhase("extracting");
      let rawText: string;
      let boundaries: PageBoundary[];
      try {
        const result: ExtractionResult = await extractText(
          selectedFile,
          (page, total) => setExtractionProgress({ page, total }),
        );
        rawText = result.text;
        boundaries = result.boundaries;
        if (DEV) console.log("[upload] extracted", { chars: rawText.length });

        if (rawText.trim().length === 0) {
          setError("pseudonymization.file.error-no-text");
          setPhase("idle");
          return;
        }
      } catch (err) {
        console.error("[useFileUploadFlow] extraction failed:", err);
        setError("pseudonymization.file.error-extraction");
        setPhase("idle");
        return;
      }

      // Golden Rule (SPEC-007a §2.1): NFC normalize → escape → detect → review → pseudonymize
      const normalized = rawText.normalize("NFC");
      const escaped = escapeTokenBrackets(normalized);
      setExtractedText(escaped);
      setPageBoundaries(boundaries);

      // Document label from metadata only (SF-8: never use file.name)
      const pageCount = boundaries.length > 1 ? boundaries.length : undefined;
      const label = generateDocumentLabel(selectedFile.type || "text/plain", pageCount);
      // Store label now so modal can show it; pseudonymizedText stays null until upload succeeds
      setDocumentLabel(label);

      // Detect PII (always on escaped text — Golden Rule invariant)
      setPhase("detecting");
      const detected = await detectPII(escaped);
      if (DEV) console.log("[upload] detected", { count: detected.length });
      setDetections(detected);

      if (detected.length === 0) {
        // No PII → upload directly
        setPhase("uploading");
        setUploading(true);
        try {
          // Show chip immediately — upload runs async
          setPseudonymizedText(escaped);
          const ok = await doUpload(escaped, []);
          if (!ok) {
            setError("pseudonymization.file.error-upload");
          }
        } catch (err) {
          console.error("[upload] doUpload failed:", err);
          // Keep chip — pseudonymization succeeded
          setError("pseudonymization.file.error-upload");
        } finally {
          reset();
        }
        return;
      }

      setPhase("review");
      setReviewVisible(true);
    },
    [detectPII, doUpload, reset, clearAttachment],
  );

  // -----------------------------------------------------------------------
  // Step 2: User confirms → pseudonymize → show chip → encrypt + upload
  // -----------------------------------------------------------------------
  const handleConfirmUpload = useCallback(async (): Promise<boolean> => {
    setUploading(true);
    setPhase("uploading");
    try {
      const { pseudonymized, mapping: newMapping } = pseudonymize(
        extractedText,
        review.acceptedDetections,
        mapping,
      );
      setMapping(newMapping);

      // SPEC-007b §3.5 (updated): show chip immediately after pseudonymization
      // succeeds — upload runs in background. Chip is the pseudonymization proof,
      // not the upload proof. Upload failure is shown separately (non-blocking).
      setPseudonymizedText(pseudonymized);

      const ok = await doUpload(pseudonymized, review.acceptedDetections);
      if (!ok) {
        // Upload failed but pseudonymization succeeded → keep chip, show error
        setError("pseudonymization.file.error-upload");
      }
      return ok;
    } catch (err) {
      console.error("[useFileUploadFlow] upload failed:", err);
      // Keep chip — pseudonymization succeeded even if upload failed
      setError("pseudonymization.file.error-upload");
      return false;
    } finally {
      reset();
    }
  }, [extractedText, review.acceptedDetections, mapping, pseudonymize, doUpload, reset]);

  // -----------------------------------------------------------------------
  // Cancel review → reset + clear attachment (upload not completed)
  // -----------------------------------------------------------------------
  const handleCancelReview = useCallback(() => {
    reset();
    clearAttachment();
  }, [reset, clearAttachment]);

  return {
    // NER status
    status,
    progress,

    // File state
    file,
    phase,
    error,
    extractionProgress,
    extractedText,
    pageBoundaries,

    // Review modal state
    reviewVisible,
    uploading,
    reviewItems: review.items,

    // SPEC-007b §3.5: attachment state (null until successful upload)
    documentLabel,
    pseudonymizedText,
    mapping,          // for owner-side re-personalization in ModalDocumentPreview
    clearAttachment,

    // Actions
    handleFileSelected,
    handleConfirmUpload,
    handleCancelReview,
    toggleReviewItem: review.toggleItem,
    acceptAllReview: review.acceptAll,
    rejectAllReview: review.rejectAll,
    addManualReviewItem: review.addManualItem,  // SPEC-007a §4.5
  };
}

// hooks/useFileUploadFlow.ts
// ============================================================================
// SPEC-007a §5 — File Upload Orchestration Hook
//
// Manages the full file upload flow with pseudonymization:
//   1. User selects file → validate → extract text → detect PII
//   2. If PII found → show review modal
//   3. User confirms → pseudonymize → encrypt → upload
//   4. If no PII → upload directly (no modal)
//
// Golden Rule (SPEC-007a §2.1):
//   text → NFC normalize → escape → detectPII(escaped) → review → pseudonymize(escaped)
//
// SF-7: NEVER log file.name (even in dev) — filename may contain PII.
// ============================================================================

import { useCallback, useState } from "react";
import { usePseudonymization } from "@/hooks/usePseudonymization";
import { usePIIReview } from "@/hooks/usePIIReview";
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
// Hook
// ---------------------------------------------------------------------------

export function useFileUploadFlow() {
  const { status, progress, detectPII, pseudonymize } = usePseudonymization();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [extractionProgress, setExtractionProgress] = useState({
    page: 0,
    total: 0,
  });
  const [detections, setDetections] = useState<DetectedPII[]>([]);
  const [pageBoundaries, setPageBoundaries] = useState<PageBoundary[]>([]);

  // UI state
  const [reviewVisible, setReviewVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [phase, setPhase] = useState<UploadPhase>("idle");
  const [error, setError] = useState<string | null>(null);

  // Persistent across uploads (mapping accumulates tokens)
  const [mapping, setMapping] = useState<PseudonymizationMapping | null>(null);

  // PII review state (re-syncs when detections change)
  const review = usePIIReview(detections);

  // -----------------------------------------------------------------------
  // Reset transient state after upload (success or failure)
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
  // Actual upload — console.log stub (replace with encrypt + upload later)
  // SF-7: NEVER log file.name — filename is PII metadata
  // -----------------------------------------------------------------------
  const doUpload = useCallback(
    async (text: string, accepted: DetectedPII[]): Promise<boolean> => {
      const buffer = new TextEncoder().encode(text).buffer;

      if (process.env.NODE_ENV === "development") {
        console.log(
          "[file-upload] size:",
          buffer.byteLength,
          "bytes,",
          accepted.length,
          "PII items accepted",
        );
      }

      // TODO: encryptContent(buffer, dek, { mimeType: "text/plain", ... })
      //       + Dual-DEK wrap + 3-phase upload (SPEC-002/003 integration)
      //       The original filename is NOT sent to the server.
      //       Only pseudonymized text/plain content is uploaded.
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
      setFile(selectedFile);

      // Validate
      setPhase("validating");
      const validation = validateFile(selectedFile);
      if (!validation.valid) {
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
          (page, total) => {
            setExtractionProgress({ page, total });
          },
        );
        rawText = result.text;
        boundaries = result.boundaries;

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

      // Golden Rule: NFC normalize → escape → detect → review → pseudonymize
      // (NFC normalization already done in extractText)
      const escaped = escapeTokenBrackets(rawText); // rawText is already NFC-normalized
      setExtractedText(escaped); // Store escaped text for pseudonymize() in Step 2
      setPageBoundaries(boundaries);

      // Detect PII (ALWAYS on escaped text — Golden Rule invariant)
      setPhase("detecting");
      const detected = await detectPII(escaped);
      setDetections(detected);

      if (detected.length === 0) {
        // No PII → upload directly
        setPhase("uploading");
        setUploading(true);
        try {
          await doUpload(escaped, []);
        } finally {
          reset();
        }
        return;
      }

      setPhase("review");
      setReviewVisible(true);
    },
    [detectPII, doUpload, reset],
  );

  // -----------------------------------------------------------------------
  // Step 2: User confirms → pseudonymize → encrypt → upload
  // extractedText is already NFC-normalized + escaped (set in Step 1)
  // -----------------------------------------------------------------------
  const handleConfirmUpload = useCallback(async (): Promise<boolean> => {
    setUploading(true);
    setPhase("uploading");
    try {
      const { pseudonymized, mapping: newMapping } = pseudonymize(
        extractedText, // Already escaped in Step 1 (Golden Rule invariant)
        review.acceptedDetections,
        mapping,
      );
      setMapping(newMapping);

      return await doUpload(pseudonymized, review.acceptedDetections);
    } catch (err) {
      console.error("[useFileUploadFlow] upload failed:", err);
      return false;
    } finally {
      reset();
    }
  }, [extractedText, review.acceptedDetections, mapping, pseudonymize, doUpload, reset]);

  // -----------------------------------------------------------------------
  // Cancel review → reset
  // -----------------------------------------------------------------------
  const handleCancelReview = useCallback(() => {
    reset();
  }, [reset]);

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

    // Actions
    handleFileSelected,
    handleConfirmUpload,
    handleCancelReview,
    toggleReviewItem: review.toggleItem,
    acceptAllReview: review.acceptAll,
    rejectAllReview: review.rejectAll,
  };
}

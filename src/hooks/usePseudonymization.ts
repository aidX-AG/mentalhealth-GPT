// hooks/usePseudonymization.ts
// ============================================================================
// SPEC-007 §9.3 — Pseudonymization Hook (Subscriber-Only)
//
// Pure subscriber: subscribes to the globalThis NER singleton for
// status/progress events. Does NOT own or manage the Worker.
//
// Strict Mode safe: double-mount in dev subscribes twice, but the singleton
// only creates one Worker. HMR safe: globalThis survives module re-eval.
//
// Usage:
//   const {
//     status, progress,
//     detectPII, pseudonymize, depseudonymize, createMapping,
//   } = usePseudonymization();
//
//   // status: "idle" | "loading" | "ready" | "degraded"
//   // detectPII runs all 3 layers (regex + NER + dict) + merge
// ============================================================================

import { useCallback, useEffect, useState } from "react";
import {
  subscribe,
  ensureReady,
  detect as nerDetect,
  getStatus as nerGetStatus,
} from "../../lib/pseudonymization/ner-singleton";
import {
  detectAll,
  escapeTokenBrackets,
  pseudonymize as corePseudonymize,
  depseudonymize as coreDepseudonymize,
  createMapping,
} from "../../lib/pseudonymization";
import type {
  DetectedPII,
  PseudonymizationMapping,
  NERStatus,
} from "../../lib/pseudonymization";

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePseudonymization() {
  const [status, setStatus] = useState<NERStatus>("idle");
  const [progress, setProgress] = useState(0);

  // Subscribe to singleton events + trigger model loading
  useEffect(() => {
    const unsubscribe = subscribe({
      onStatus: setStatus,
      onProgress: setProgress,
    });

    // Start NER model loading (no-op if already loading/ready/degraded)
    ensureReady();

    return unsubscribe;
  }, []);

  // ------------------------------------------
  // detectPII: escape → regex + NER + dict → merge
  // ------------------------------------------
  const detectPII = useCallback(
    async (text: string): Promise<DetectedPII[]> => {
      const escaped = escapeTokenBrackets(text);

      // Only call NER if model is ready — avoids ambiguity between
      // "no entities found" and "model not loaded" (both return [])
      const nerDetections = nerGetStatus() === "ready"
        ? await nerDetect(escaped)
        : [];

      return detectAll(escaped, nerDetections);
    },
    [],
  );

  // ------------------------------------------
  // pseudonymize: wrap core function
  // ------------------------------------------
  const pseudonymize = useCallback(
    (
      text: string,
      acceptedDetections: DetectedPII[],
      existingMapping: PseudonymizationMapping | null,
    ) => {
      return corePseudonymize(text, acceptedDetections, existingMapping);
    },
    [],
  );

  // ------------------------------------------
  // depseudonymize: wrap core function
  // ------------------------------------------
  const depseudonymize = useCallback(
    (text: string, mapping: PseudonymizationMapping): string => {
      return coreDepseudonymize(text, mapping);
    },
    [],
  );

  return {
    status,
    progress,
    detectPII,
    pseudonymize,
    depseudonymize,
    createMapping,
  };
}

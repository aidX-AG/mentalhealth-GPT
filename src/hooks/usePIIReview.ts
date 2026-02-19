// hooks/usePIIReview.ts
// ============================================================================
// SPEC-007 §8, §9.3 — PII Review State Management (id-based, SF-2 fix)
// ============================================================================

import { useCallback, useEffect, useMemo, useState } from "react";
import type { DetectedPII } from "../../lib/pseudonymization";

export interface ReviewItem extends DetectedPII {
  id: string;
  accepted: boolean;
}

/**
 * Single source of truth for stable review-item IDs.
 * Includes source to avoid collisions when the same span/category appears
 * from different detection layers (regex + ner or ner + dictionary).
 *
 * Exported so DocumentPreview.tsx and tests can use the exact same function —
 * any consumer building IDs must call this, never re-implement inline.
 */
export function makeReviewId(d: DetectedPII): string {
  return `${d.start}-${d.end}-${d.category}-${d.source}`;
}

// Internal alias for concise use inside this file
const itemId = makeReviewId;

export function usePIIReview(detections: DetectedPII[]) {
  // Initialize from defaultAccepted
  const [acceptedMap, setAcceptedMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const d of detections) {
      map[itemId(d)] = d.defaultAccepted;
    }
    return map;
  });

  // Re-init when detections change (contract: set detections BEFORE opening modal)
  // NOTE: does NOT watch manualDetections — avoids resetting user toggle choices
  useEffect(() => {
    const map: Record<string, boolean> = {};
    for (const d of detections) {
      map[itemId(d)] = d.defaultAccepted;
    }
    setAcceptedMap(map);
  }, [detections]);

  // Manual detections stored separately so useEffect above never resets them
  // SPEC-007a §4.5.5
  const [manualDetections, setManualDetections] = useState<DetectedPII[]>([]);

  // Merged auto + manual, sorted by start offset
  const allDetections = useMemo(
    () => [...detections, ...manualDetections].sort((a, b) => a.start - b.start),
    [detections, manualDetections],
  );

  // Merge allDetections + accepted state
  const items: ReviewItem[] = useMemo(
    () => allDetections.map((d) => ({
      ...d,
      id: itemId(d),
      accepted: acceptedMap[itemId(d)] ?? d.defaultAccepted,
    })),
    [allDetections, acceptedMap],
  );

  // Toggle by id
  const toggleItem = useCallback((id: string) => {
    setAcceptedMap((prev: Record<string, boolean>) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Accept all (auto + manual)
  const acceptAll = useCallback(() => {
    setAcceptedMap(() => {
      const next: Record<string, boolean> = {};
      for (const d of allDetections as DetectedPII[]) next[itemId(d)] = true;
      return next;
    });
  }, [allDetections]);

  // Reject all (auto + manual)
  const rejectAll = useCallback(() => {
    setAcceptedMap(() => {
      const next: Record<string, boolean> = {};
      for (const d of allDetections as DetectedPII[]) next[itemId(d)] = false;
      return next;
    });
  }, [allDetections]);

  // Add manual item — SPEC-007a §4.5.5
  const addManualItem = useCallback(
    (start: number, end: number, original: string) => {
      // Reject overlap with any existing item (auto or manual)
      if ((allDetections as DetectedPII[]).some((i: DetectedPII) => i.start < end && i.end > start)) return;
      const d: DetectedPII = {
        start,
        end,
        original,
        category: "PERSON",
        confidence: 1.0,
        source: "manual",
        defaultAccepted: true,
      };
      setManualDetections((prev: DetectedPII[]) => [...prev, d]);
      setAcceptedMap((prev: Record<string, boolean>) => ({ ...prev, [itemId(d)]: true }));
    },
    [allDetections],
  );

  // Extract accepted detections for pseudonymize() — includes both auto + manual
  const acceptedDetections: DetectedPII[] = useMemo(
    () => items.filter((item) => item.accepted),
    [items],
  );

  return {
    items,
    toggleItem,
    acceptAll,
    rejectAll,
    addManualItem,
    acceptedDetections,
  };
}

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
  useEffect(() => {
    const map: Record<string, boolean> = {};
    for (const d of detections) {
      map[itemId(d)] = d.defaultAccepted;
    }
    setAcceptedMap(map);
  }, [detections]);

  // Merge detections + accepted state
  const items: ReviewItem[] = useMemo(
    () => detections.map((d) => ({
      ...d,
      id: itemId(d),
      accepted: acceptedMap[itemId(d)] ?? d.defaultAccepted,
    })),
    [detections, acceptedMap],
  );

  // Toggle by id
  const toggleItem = useCallback((id: string) => {
    setAcceptedMap((prev: Record<string, boolean>) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Accept all
  const acceptAll = useCallback(() => {
    setAcceptedMap(() => {
      const next: Record<string, boolean> = {};
      for (const d of detections) next[itemId(d)] = true;
      return next;
    });
  }, [detections]);

  // Reject all
  const rejectAll = useCallback(() => {
    setAcceptedMap(() => {
      const next: Record<string, boolean> = {};
      for (const d of detections) next[itemId(d)] = false;
      return next;
    });
  }, [detections]);

  // Extract accepted detections for pseudonymize()
  const acceptedDetections: DetectedPII[] = useMemo(
    () => items.filter((item) => item.accepted),
    [items],
  );

  return {
    items,
    toggleItem,
    acceptAll,
    rejectAll,
    acceptedDetections,
  };
}

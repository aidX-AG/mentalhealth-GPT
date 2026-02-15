// hooks/usePIIReview.ts
// ============================================================================
// SPEC-007 §8, §9.3 — PII Review State Management
//
// Manages the user's accept/reject decisions for detected PII items.
// Each item starts with `accepted` set from `detection.defaultAccepted`:
//   - Regex (confidence 1.0)       → accepted: true
//   - NER ≥ 0.85                   → accepted: true
//   - NER 0.60–0.85               → accepted: false  (user must confirm)
//   - Dictionary (confidence 1.0)  → accepted: true
//
// Usage:
//   const { items, toggleItem, acceptAll, rejectAll, acceptedDetections }
//     = usePIIReview(detections);
// ============================================================================

import { useCallback, useMemo, useState } from "react";
import type { DetectedPII } from "../../lib/pseudonymization";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReviewItem extends DetectedPII {
  accepted: boolean;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function usePIIReview(detections: DetectedPII[]) {
  // Initialize accepted state from defaultAccepted (§8.2)
  const [acceptedMap, setAcceptedMap] = useState<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {};
    for (let i = 0; i < detections.length; i++) {
      map[i] = detections[i].defaultAccepted;
    }
    return map;
  });

  // Merge detections + accepted state
  const items: ReviewItem[] = useMemo(
    () =>
      detections.map((d, i) => ({
        ...d,
        accepted: acceptedMap[i] ?? d.defaultAccepted,
      })),
    [detections, acceptedMap],
  );

  // Toggle a single item
  const toggleItem = useCallback((index: number) => {
    setAcceptedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  // Accept all items (including low-confidence)
  const acceptAll = useCallback(() => {
    setAcceptedMap((prev) => {
      const next: Record<number, boolean> = { ...prev };
      for (let i = 0; i < detections.length; i++) {
        next[i] = true;
      }
      return next;
    });
  }, [detections.length]);

  // Reject all items
  const rejectAll = useCallback(() => {
    setAcceptedMap((prev) => {
      const next: Record<number, boolean> = { ...prev };
      for (let i = 0; i < detections.length; i++) {
        next[i] = false;
      }
      return next;
    });
  }, [detections.length]);

  // Filtered list of accepted detections (for pseudonymize())
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

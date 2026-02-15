// lib/pseudonymization/detector.ts
// ============================================================================
// SPEC-007 §11 — 3-Layer Detection Orchestration + Merge
//
// Runs regex → NER → dictionary, then merges with overlap-robust algorithm.
// Priority-first sort: regex > NER > dictionary.
// ============================================================================

import type { DetectedPII } from "./types";
import { SOURCE_PRIORITY, NER_HIGH_CONFIDENCE, STRUCTURED_CATEGORIES } from "./types";
import { detectRegex } from "./regex";
import { detectDictionary } from "./dictionary";

// ---------------------------------------------------------------------------
// Merge Algorithm (§11 — Priority-First, Interval-Based)
// ---------------------------------------------------------------------------

interface TaggedDetection extends DetectedPII {
  _priority: number;
}

/**
 * Check if [start, end) overlaps any interval in the sorted list.
 * Intervals are sorted by start → early break when iStart >= end.
 */
function overlapsAny(
  start: number,
  end: number,
  intervals: Array<[number, number]>,
): boolean {
  for (const [iStart, iEnd] of intervals) {
    if (iStart >= end) break; // sorted: no further intervals can overlap
    if (start < iEnd && end > iStart) return true;
  }
  return false;
}

/**
 * Insert [start, end] into sorted-by-start array.
 */
function insertSorted(
  intervals: Array<[number, number]>,
  item: [number, number],
): void {
  let i = intervals.length;
  while (i > 0 && intervals[i - 1][0] > item[0]) i--;
  intervals.splice(i, 0, item);
}

/**
 * Merge detections from all layers with overlap resolution.
 *
 * Sort order (§11 v1.2):
 * 1. Priority first (regex=0, ner=1, dict=2) — guarantees "Regex > NER > Dict"
 * 2. Longer spans first (within same priority)
 * 3. Earlier position as tiebreak
 *
 * Then greedy interval scheduling: accept if no overlap with any accepted.
 */
export function mergeDetections(
  regex: DetectedPII[],
  ner: DetectedPII[],
  dictionary: DetectedPII[],
): DetectedPII[] {
  // Regex is authoritative only for structured categories (IBAN, SSN, email, etc.).
  // For entity categories (PERSON, ORT, ORG), NER is authoritative — regex gets
  // downgraded to NER priority so the longer, context-aware NER span wins.
  const all: TaggedDetection[] = [
    ...regex.map((d) => ({
      ...d,
      _priority: STRUCTURED_CATEGORIES.has(d.category)
        ? SOURCE_PRIORITY.regex
        : SOURCE_PRIORITY.ner,
    })),
    ...ner.map((d) => ({ ...d, _priority: SOURCE_PRIORITY.ner })),
    ...dictionary.map((d) => ({ ...d, _priority: SOURCE_PRIORITY.dictionary })),
  ];

  // Sort: priority first, then longer, then earlier
  all.sort(
    (a, b) =>
      a._priority - b._priority ||
      (b.end - b.start) - (a.end - a.start) ||
      a.start - b.start,
  );

  const accepted: DetectedPII[] = [];
  const occupied: Array<[number, number]> = [];

  for (const det of all) {
    if (!overlapsAny(det.start, det.end, occupied)) {
      // Strip internal _priority before adding to result
      const { _priority, ...clean } = det;
      accepted.push(clean);
      insertSorted(occupied, [det.start, det.end]);
    }
  }

  // Sort by position for display
  accepted.sort((a, b) => a.start - b.start);
  return accepted;
}

// ---------------------------------------------------------------------------
// Compute defaultAccepted for NER results
// ---------------------------------------------------------------------------

function applyNERDefaults(detections: DetectedPII[]): DetectedPII[] {
  return detections.map((d) => ({
    ...d,
    defaultAccepted: d.confidence >= NER_HIGH_CONFIDENCE,
  }));
}

// ---------------------------------------------------------------------------
// Main detection entry point
// ---------------------------------------------------------------------------

/**
 * Detect PII in text using all available layers.
 *
 * @param text - Input text (should already have token brackets escaped)
 * @param nerDetections - NER results (empty array if NER not available)
 */
export function detectAll(
  text: string,
  nerDetections: DetectedPII[] = [],
): DetectedPII[] {
  const regex = detectRegex(text);
  const dictionary = detectDictionary(text);
  const ner = applyNERDefaults(nerDetections);

  return mergeDetections(regex, ner, dictionary);
}

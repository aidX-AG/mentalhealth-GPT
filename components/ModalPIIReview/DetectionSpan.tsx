// components/ModalPIIReview/DetectionSpan.tsx
// ============================================================================
// SPEC-007b v1.2 §2.3 / §2.4 — Inline detection highlight
//
// Accepts ReviewItem (from usePIIReview) — no unsafe cast from DetectedPII.
// item.id and item.accepted come directly from the hook's state.
//
// SECURITY / PRIVACY (health-grade):
// - NEVER expose original PII via tooltip/title when accepted.
//
// ACCESSIBILITY (WCAG 2.1 AA):
// - Real <button> element for keyboard + screen-reader semantics.
// - aria-pressed indicates toggle state.
// - focus-visible ring for keyboard navigation.
// ============================================================================

import type { ReviewItem } from "../../src/hooks/usePIIReview";
import { NER_HIGH_CONFIDENCE } from "../../lib/pseudonymization/types";

interface DetectionSpanProps {
  item: ReviewItem;
  onToggle: (id: string) => void;
  readOnly?: boolean;
}

const DetectionSpan = ({
  item,
  onToggle,
  readOnly = false,
}: DetectionSpanProps) => {
  const isRegex = item.source === "regex";
  const isNER = item.source === "ner";
  const isDictionary = item.source === "dictionary";
  const isHighConf =
    isRegex || (isNER && item.confidence >= NER_HIGH_CONFIDENCE);

  // ── Visual style per state (§2.4) ──────────────────────────────────────
  let spanClass: string;
  if (!item.accepted) {
    spanClass =
      "bg-gray-100 dark:bg-n-6 text-gray-400 dark:text-n-4 line-through " +
      "rounded px-0.5";
  } else if (isHighConf) {
    spanClass =
      "bg-blue-100 dark:bg-blue-900/40 border border-blue-400 dark:border-blue-500 " +
      "text-blue-900 dark:text-blue-200 rounded px-0.5 font-mono text-sm";
  } else if (isDictionary) {
    spanClass =
      "bg-green-100 dark:bg-green-900/40 border border-green-400 dark:border-green-500 " +
      "text-green-900 dark:text-green-200 rounded px-0.5 font-mono text-sm";
  } else {
    // Medium confidence NER (0.60–0.85)
    spanClass =
      "bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-400 dark:border-yellow-500 " +
      "text-yellow-900 dark:text-yellow-200 rounded px-0.5 font-mono text-sm";
  }

  const interactiveClass = readOnly
    ? "cursor-default"
    : "cursor-pointer " +
      "hover:ring-2 hover:ring-offset-1 hover:ring-blue-400 dark:hover:ring-blue-500 " +
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 " +
      "focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400";

  // Label: accepted → category placeholder ([PERSON]), rejected → original text
  const label = item.accepted ? `[${item.category}]` : item.original;

  // SECURITY: never show original in tooltip when item is accepted
  const title = item.accepted
    ? `Klick zum Ablehnen: ${item.category}`
    : `Klick zum Akzeptieren`;

  // A11y: category name only (no original when accepted)
  const ariaLabel = item.accepted
    ? `Erkannt: ${item.category}. Akzeptiert. Drücken zum Ablehnen.`
    : `Erkannt: ${item.category}. Abgelehnt. Drücken zum Akzeptieren.`;

  return (
    <button
      type="button"
      className={`${spanClass} ${interactiveClass} inline align-baseline`}
      title={title}
      onClick={() => !readOnly && onToggle(item.id)}
      disabled={readOnly}
      aria-disabled={readOnly}
      aria-pressed={item.accepted}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
};

export default DetectionSpan;

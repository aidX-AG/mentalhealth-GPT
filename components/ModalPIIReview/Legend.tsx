// components/ModalPIIReview/Legend.tsx
// ============================================================================
// SPEC-007b v1.2 §2.4 — Color legend for detection confidence levels
//
// Notes:
// - Accessibility: color swatches are decorative (text provides meaning)
// - Interaction hint: avoid arrow glyph for SR clarity
// ============================================================================

import { useI18n } from "@/lib/i18n/I18nContext";

const Legend = () => {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-n-4 dark:text-n-3">
      {/* High confidence (regex or NER ≥ 0.85) */}
      <span className="flex items-center gap-1">
        <span
          aria-hidden="true"
          className="inline-block w-3 h-3 rounded-sm bg-blue-100 dark:bg-blue-900/40 border border-blue-400 dark:border-blue-500"
        />
        {t("pseudonymization.review.legend-secure")}
      </span>

      {/* Medium confidence (NER 0.60–0.85) */}
      <span className="flex items-center gap-1">
        <span
          aria-hidden="true"
          className="inline-block w-3 h-3 rounded-sm bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-400 dark:border-yellow-500"
        />
        {t("pseudonymization.review.legend-uncertain")}
      </span>

      {/* Dictionary (medical/therapy terms) */}
      <span className="flex items-center gap-1">
        <span
          aria-hidden="true"
          className="inline-block w-3 h-3 rounded-sm bg-green-100 dark:bg-green-900/40 border border-green-400 dark:border-green-500"
        />
        {t("pseudonymization.review.legend-dictionary")}
      </span>

      {/* Interaction hint */}
      <span className="ml-1 text-n-4 dark:text-n-3">
        {t("pseudonymization.review.click-to-toggle")}
      </span>
    </div>
  );
};

export default Legend;

import Item from "./Item";
import { useI18n } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Feedback Assessment
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Mock data is static (no useMemo needed)
 * - Header count derived from items
 * - Optional: ARIA table roles for accessibility
 * ============================================================================
 */

type AssessmentItem = {
  id: string;
  number: number;
  incorrect: string;
  correct: string;
};

type AssessmentProps = Record<string, never>;

const Assessment = ({}: AssessmentProps) => {
  const { t } = useI18n();

  // NOTE: If these values are "model/user output", do NOT translate them.
  // If they are UI copy, wrap them in t(...).
  const items: AssessmentItem[] = [
    { id: "0", number: 28, incorrect: "which", correct: "whose" },
    { id: "1", number: 42, incorrect: "getting annoyed", correct: "showing agreement" },
    { id: "2", number: 56, incorrect: "public", correct: "unknown" },
    { id: "3", number: 60, incorrect: "Newyork", correct: "Sydney" },
    { id: "4", number: 80, incorrect: "careless", correct: "reliable" },
  ];

  const incorrectCount = items.length;

  return (
    <div className="py-3">
      <div className="table w-full" role="table" aria-label={t("Assessment")}>
        <div className="table-row caption1 text-n-4 md:flex" role="row">
          <div className="table-cell pl-5 py-2 md:hidden" role="columnheader">#</div>
          <div className="table-cell pl-5 py-2 md:w-1/2 md:pr-2" role="columnheader">
            {t("Incorrect answer")} ({incorrectCount})
          </div>
          <div className="table-cell pl-5 py-2 md:w-1/2 md:pl-0 md:pr-5" role="columnheader">
            {t("Correct answer")}
          </div>
          <div className="table-cell pl-5 pr-5 py-2 text-center md:hidden" role="columnheader">
            {t("How")}
          </div>
        </div>

        {items.map((x) => (
          <Item item={x} key={x.id} />
        ))}
      </div>
    </div>
  );
};

export default Assessment;

import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Schedule Result
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Punctuation "." NOT translated
 * - External link with referrerPolicy (privacy)
 * - Button is a real link (no window.open)
 * ============================================================================
 */

type ScheduleResultProps = Record<string, never>;

const ScheduleResult = ({}: ScheduleResultProps) => {
  const t = useTranslation();

  return (
    <div>
      <div className="mb-3 font-bold">{t("You are done!")}</div>

      <p className="mb-5">
        {t(
          "Your post has been scheduled for February 14th, 2023 at 11:30 and will be shared through"
        )}{" "}
        <a
          className="text-primary-1"
          href="https://buffer.com/"
          target="_blank"
          rel="noopener noreferrer external"
          referrerPolicy="no-referrer"
          aria-label={t("Open Buffer in a new tab")}
        >
          Buffer
        </a>
        {"."}
      </p>

      <a
        href="https://buffer.com/"
        target="_blank"
        rel="noopener noreferrer external"
        referrerPolicy="no-referrer"
        className="btn-dark btn-small inline-flex items-center"
        role="button"
        aria-label={t("View on Buffer")}
      >
        {t("View on Buffer")}
      </a>
    </div>
  );
};

export default ScheduleResult;

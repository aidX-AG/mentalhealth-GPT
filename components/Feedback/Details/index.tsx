import Icon from "@/components/Icon";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Feedback Details
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Icon names are identifiers (never translate)
 * - Rating: single source of truth for UI + aria
 * - Download button: accessible + no duplicate SR output
 * ============================================================================
 */

type DetailsProps = Record<string, never>;

const Details = ({}: DetailsProps) => {
  const t = useTranslation();

  const ratingMax = 5;
  const ratingStars = 4; // displayed filled stars (UI)
  const ratingValue = 4.85; // numeric score shown

  return (
    <div className="flex items-center p-5 md:block">
      <div className="flex items-center mr-auto">
        <div className="flex justify-center items-center shrink-0 w-15 h-15 rounded-xl bg-[#52BA69]/20">
          <Icon className="w-8 h-8 fill-[#52BA69]" name="codepen" aria-hidden="true" />
        </div>

        <div className="grow pl-4">
          <div className="mb-1 h6">{t("Very good!")}</div>

          <div className="flex items-center">
            <div
              className="flex"
              role="img"
              aria-label={t(`${ratingStars} out of ${ratingMax} stars`)}
              title={`${ratingStars}/${ratingMax}`}
            >
              {Array.from({ length: ratingMax }).map((_, i) => {
                const filled = i < ratingStars;
                return (
                  <Icon
                    key={i}
                    className={`w-5 h-5 ${i < ratingMax - 1 ? "mr-2" : ""} md:w-4 md:h-4 md:mr-1 ${
                      filled ? "fill-accent-5" : "fill-n-4"
                    }`}
                    name="star-rating"
                    aria-hidden="true"
                  />
                );
              })}
            </div>

            <div className="ml-2 px-2 bg-n-3 rounded-lg base2 font-semibold text-n-7">
              {ratingValue.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn-dark 2xl:w-12 2xl:p-0 2xl:text-0 md:w-full md:mt-4 md:text-[0.875rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2"
        aria-label={t("Download")}
      >
        <span>{t("Download")}</span>
        <Icon className="2xl:!m-0 md:!ml-3" name="download-fill" aria-hidden="true" />
      </button>
    </div>
  );
};

export default Details;

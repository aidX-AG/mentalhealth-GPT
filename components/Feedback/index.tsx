import Details from "./Details";
import Assessment from "./Assessment";
import { useMemo } from "react";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Feedback Container
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Semantic section with aria-labelledby
 * - i18n keys without punctuation in identifiers
 * - Suggestions rendered from stable list (less duplication)
 * ============================================================================
 */

type FeedbackProps = Record<string, never>;

const Feedback = ({}: FeedbackProps) => {
  const t = useTranslation();

  const suggestions = useMemo(
    () => [
      {
        title: t("Read regularly"),
        body: t(
          "Reading is an excellent way to improve your vocabulary, grammar, and comprehension skills. Try to read a variety of materials, including books, newspapers, magazines, and online articles."
        ),
      },
      {
        title: t("Practice writing"),
        body: t(
          "Writing can help you improve your grammar, spelling, and sentence structure. Try to write regularly, even if it's just a short paragraph or a journal entry."
        ),
      },
      {
        title: t("Listen to English"),
        body: t(
          "Listening to English podcasts, audiobooks, and videos can help you improve your listening and comprehension skills. It can also help you get used to different accents and intonations."
        ),
      },
      {
        title: t("Speak with native speakers"),
        body: t(
          "Speaking with native speakers can help you improve your pronunciation, fluency, and confidence. You can find language exchange partners or join conversation groups online or in person."
        ),
      },
      {
        title: t("Learn grammar rules"),
        body: t(
          "Learning the basic grammar rules can help you write and speak more accurately. Try to focus on one rule at a time and practice using it in your writing and speaking. There are many online resources, such as grammar books and videos, that can help you learn grammar rules."
        ),
      },
    ],
    [t]
  );

  return (
    <section aria-labelledby="feedback-title">
      <div className="max-w-[38rem] mb-5 bg-n-1 rounded-2xl xl:max-w-full dark:bg-n-6">
        <Details />
        <Assessment />
      </div>

      <h2 id="feedback-title" className="mb-5 body1 md:body1S">
        {t("Suggestion to improve your test")}
      </h2>

      <div>
        {suggestions.map((s) => (
          <p key={s.title} className="mb-4 last:mb-0">
            <strong>
              {s.title}
              <span aria-hidden="true">:</span>
            </strong>{" "}
            {s.body}
          </p>
        ))}
      </div>
    </section>
  );
};

export default Feedback;

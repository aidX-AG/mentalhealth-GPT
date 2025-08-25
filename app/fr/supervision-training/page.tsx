import PageView from "@/templates/SupervisionTrainingPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("fr");
  const t = makeT(messages);

  return (
    <PageView
      chatTitle={t("Supervision & Training")}
      questionContent={t(
        "Please review this supervision case and provide constructive feedback for the trainee. Focus on communication, assessment quality, and risk handling."
      )}
      answerContent={t(
        "🚧 The AI model for Supervision & Training is currently being developed with specialized training data. It will be available soon to support expert feedback and mentoring workflows."
      )}
    />
  );
}

import PageView from "@/templates/SupervisionTrainingPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("es");
  const t = makeT(messages);

  return (
    <PageView
      title={t("supervision-training.chat.title")}
      questionDocument="session-case.pdf"
      questionContent={t("supervision-training.sections.question")}
      questionTime={t("common.misc.just-now")}
      noticeTextPrefix={t("supervision-training.sections.banner-prefix")}
      featureName={t("supervision-training.chat.title")}
      noticeTextSuffix={[
        t("supervision-training.sections.under-development"),
        t("supervision-training.sections.coming-soon"),
      ].join(" ")}
    />
  );
}

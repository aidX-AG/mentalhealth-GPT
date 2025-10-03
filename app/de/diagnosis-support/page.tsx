import PageView from "@/templates/DiagnosisSupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));
  return (
    <PageView
      title={t("diagnosis-support.chat.title")}
      questionDocument={t("diagnosis-support.question.document")}
      questionContent={t("diagnosis-support.question.content")}
      questionTime={t("common.misc.just-now")}
      noticeTextPrefix={t("diagnosis-support.sections.banner-prefix") + " "}
      featureName={t("diagnosis-support.chat.title")}
      noticeTextSuffix={
        " " +
        t("diagnosis-support.sections.under-development") +
        " " +
        t("diagnosis-support.sections.coming-soon")
      }
    />
  );
}

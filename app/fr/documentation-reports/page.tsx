import PageView from "@/templates/DocumentationReportsPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));

  return (
    <PageView
      title={t("documentation-reports.chat.title")}
      greetQuestion={t("documentation-reports.chat.hello-short")}
      greetTime={t("common.misc.just-now")}
      greetAnswer={t("documentation-reports.chat.greeting")}
      bodyIntro={[
        t("documentation-reports.text.coming-capability"),
        t("documentation-reports.text.professional-docs"),
        t("documentation-reports.text.use-cases"),
      ].join(" ")}
      bodyTransform={[
        t("documentation-reports.text.ai-helps-transform"),
        t("documentation-reports.text.clear-structured-confidential"),
        t("documentation-reports.text.reports-automatically"),
      ].join(" ")}
      bodySecurity={[
        t("documentation-reports.text.data-processed-with"),
        t("documentation-reports.text.end-to-end-encryption"),
        t("documentation-reports.text.privacy-protection"),
      ].join(" ")}
      noticeTitle={[
        t("documentation-reports.sections.icon"),
        t("documentation-reports.chat.title"),
      ].join(" ")}
      noticeBody={[
        t("documentation-reports.sections.in-development"),
        t("documentation-reports.text.value-prop"),
        t("documentation-reports.text.stay-tuned"),
      ].join(" ")}
    />
  );
}

import PageView from "@/templates/DocumentationReportsPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en"));
  return (
    <PageView
      title={t("Documentation & Reporting")}
      greetQuestion={t("Hi there 👋")}
      greetTime={t("Just now")}
      greetAnswer={t("Hello! How can I assist you with documentation and reporting today?")}
      bodyIntro={t("Soon you’ll be able to generate professional documentation and reports — whether for clinical use, insurance submissions, or personal records of therapy and supervision sessions.")}
      bodyTransform={t("Our AI will help you transform transcripts into clear, structured, and confidential reports — automatically.")}
      bodySecurity={t("All data is processed with end-to-end encryption to protect patient confidentiality and ensure secure handling at every stage.")}
      noticeTitle={t("🚧 Documentation & Reporting")}
      noticeBody={t("is an exciting new feature currently in development. We’re building it to save you time, reduce admin load, and enhance the quality of your documentation — stay tuned!")}
    />
  );
}

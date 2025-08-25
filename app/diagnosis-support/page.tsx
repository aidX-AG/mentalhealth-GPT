import PageView from "@/templates/DiagnosisSupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en"));
  return (
    <PageView
      title={t("Diagnosis Support")}
      questionDocument={t("diagnosis-case.pdf")}
      questionContent={t("Please review this clinical case and suggest possible diagnoses. Highlight any important symptoms or behavioral patterns.")}
      questionTime={t("Just now")}
      noticeTextPrefix={t("🚧 The AI functionality for ")}
      featureName={t("Diagnosis Support")}
      noticeTextSuffix={t(" is currently under development. It will gradually become available as we integrate specialized models to support mental health diagnostics.")}
    />
  );
}

import PageView from "@/templates/TherapySupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("en");
  const t = makeT(messages);

  return (
    <PageView
      title={t("Therapy Support AI")}
      introText={t("🧠 Hello! I'm your Therapy Support AI. Feel free to describe your case, specific symptoms, or ask for therapeutic strategies.")}
      noticeTextPrefix={t("🚧 The AI functionality for ")}
      featureName={t("Therapy Support")}
      noticeTextSuffix={t(" is currently under development. It will soon be available with specialized models for therapy planning, reflection, and evidence‑based suggestions.")}
      contactCta={t("Want to support this feature or learn more? Email")}
      contactEmail="hello@aidx.ch"
    />
  );
}

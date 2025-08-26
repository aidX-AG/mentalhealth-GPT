import PageView from "@/templates/VideoAnalysisPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);

  return (
    <PageView
      title={t("Video Analysis")}
      greetQuestion={t("Hi there 👋")}
      greetTime={t("Just now")}
      greetAnswer={t("Hello! How can I assist you with video analysis today?")}
      bodyIntro={t("Our AI-powered video analysis is coming soon. It will help analyze therapy session recordings, detect key themes, nonverbal cues, and therapeutic dynamics — all with full end-to-end security.")}
      bodySecurity={t("Your video data is protected at every step: in your browser, during upload, and throughout the AI-based processing.")}
      bodyStatus={t("This feature is currently in development — stay tuned!")}
      noticeTitle={t("🚧 Video Analysis")}
      noticeBody={t("is a powerful feature that will provide secure, AI-generated insights into therapeutic sessions. We’re excited to launch this soon — enabling deeper reflection, supervision, and professional growth.")}
    />
  );
}

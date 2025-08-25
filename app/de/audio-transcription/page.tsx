import PageView from "@/templates/AudioTranscriptionPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));
  return (
    <PageView
      title={t("Audio Transcription & Notes")}
      helloLabel={t("Hello 🙂")}
      helloTimeLabel={t("Just now")}
      demoRequestLabel={t("Show me what you can do")}
      demoRequestTimeLabel={t("Just now")}
      a1Part1={t("Our AI can securely transcribe audio recordings from therapy sessions, structure the content, and generate clear, professional summaries — all with end-to-end encryption.")}
      a1Part2={t("Simply upload a recorded session. All patient information remains strictly confidential and is protected by strong encryption directly in your browser, during transfer, and back again — ensuring full privacy at every step.")}
      noticeTextPrefix={t("🚧 The AI model for ")}
      featureName={t("Audio Transcription & Notes")}
      noticeTextSuffix={t(" is currently under development. It will soon provide accurate transcription and note-taking support for clinical documentation.")}
    />
  );
}

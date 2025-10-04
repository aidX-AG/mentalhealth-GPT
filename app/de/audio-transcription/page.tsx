import PageView from "@/templates/AudioTranscriptionPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));

  return (
    <PageView
      title={t("audio-transcription.chat.title")}
      helloLabel={t("audio-transcription.chat.hello-short")}
      helloTimeLabel={t("common.misc.just-now")}
      demoRequestLabel={t("audio-transcription.chat.demo-request")}
      demoRequestTimeLabel={t("common.misc.just-now")}
      a1Part1={t("audio-transcription.text.capability")}
      a1Part2={t("audio-transcription.text.upload-instructions")}
      noticeTextPrefix={t("audio-transcription.sections.banner-prefix")}
      featureName={t("audio-transcription.chat.title")}
      noticeTextSuffix={[
        t("audio-transcription.sections.under-development"),
        t("audio-transcription.sections.coming-soon"),
      ].join(" ")}
    />
  );
}

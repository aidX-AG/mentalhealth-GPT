import PageView from "@/templates/VideoAnalysisPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));

  return (
    <PageView
      title={t("video-analysis.chat.title")}
      greetQuestion={t("video-analysis.chat.hello-short")}
      greetTime={t("common.misc.just-now")}
      greetAnswer={t("video-analysis.chat.greeting")}
      bodyIntro={[
        t("video-analysis.text.coming-soon"),
        t("video-analysis.text.value-prop-part1"),
        t("video-analysis.text.value-prop-part2"),
      ].join(" ")}
      bodySecurity={t("video-analysis.text.security")}
      bodyStatus={[
        t("video-analysis.text.in-development"),
        t("video-analysis.text.stay-tuned"),
      ].join(" ")}
      noticeTitle={[
        t("video-analysis.sections.icon"),
        t("video-analysis.chat.title"),
      ].join(" ")}
      noticeBody={[
        t("video-analysis.text.feature-benefit"),
        t("video-analysis.text.launch-excitement"),
      ].join(" ")}
    />
  );
}

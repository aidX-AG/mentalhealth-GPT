import PageView from "@/templates/TherapySupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));

  return (
    <PageView
      title={t("therapy-support.chat.title")}
      introText={`${t("therapy-support.sections.greeting")} ${t("therapy-support.sections.instructions")}`}
      noticeTextPrefix={t("therapy-support.notice.prefix")}
      featureName={t("therapy-support.notice.feature-name")}
      noticeTextSuffix={t("therapy-support.notice.suffix")}
      contactCta={t("therapy-support.cta.support")}
      contactEmail="hello@aidx.ch"
    />
  );
}

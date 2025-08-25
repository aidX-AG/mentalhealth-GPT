import PageView from "@/templates/HomePage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("en");
  const t = makeT(messages);

  return (
    <PageView
      heroTitle={t("mentalhealthGPT")}
      heroSubtitle={t("Expertise you trust. Privacy you control. Science that empowers.")}
    />
  );
}

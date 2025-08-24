import PageView from "@/templates/UpdatesAndFaqPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);
  return <PageView title={t("Updates & FAQ")} subtitle={t("Features, fixes & improvements.")} tabs={[t("Updates"), t("FAQ")]} />;
}

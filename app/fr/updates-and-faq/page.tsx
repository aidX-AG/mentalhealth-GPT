import UpdatesAndFaqPage from "@/templates/UpdatesAndFaqPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const msgs = loadMessages("fr");
  const t = makeT(msgs);

  return (
    <UpdatesAndFaqPage
      title={t("Updates & FAQ")}
      subtitle={t("Features, fixes & improvements.")}
      tabs={[t("Updates"), t("FAQ")]}
    />
  );
}

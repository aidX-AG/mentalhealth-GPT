import PageView from "@/templates/ApplicationsPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));
  return (
    <PageView
      title={t("Applications")}
      subtitle={t("Browse and install apps to simplify your life with mentalhealthGPT")}
      searchPlaceholder={t("Search by app name or category")}
      suggestedLabel={t("Suggested apps")}
      addLabel={t("Add")}
      addedLabel={t("Added")}
    />
  );
}

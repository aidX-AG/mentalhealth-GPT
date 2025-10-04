import PageView from "@/templates/ApplicationsPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en"));
  return (
    <PageView
      title={t("applications.sections.title")}
      subtitle={t("applications.body.browse-install-apps")}
      searchPlaceholder={t("applications.form.search-placeholder")}
      suggestedLabel={t("applications.sections.suggested-apps")}
      addLabel={t("Add")}
      addedLabel={t("Added")}
    />
  );
}

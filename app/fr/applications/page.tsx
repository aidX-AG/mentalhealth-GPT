import { t } from '@transifex/native';
import PageView from "@/templates/ApplicationsPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));
  return (
    <PageView
      title={t('fr.body.text.applications_7e46', 'Applications')}
      subtitle={t(
        'fr.body.text.browse_install_apps_simplify_life_mentalhealthgpt_870c',
        'Browse and install apps to simplify your life with mentalhealthGPT'
      )}
      searchPlaceholder={t(
        'fr.body.text.search_app_name_or_category_26c6',
        'Search by app name or category'
      )}
      suggestedLabel={t('fr.body.text.suggested_apps_3727', 'Suggested apps')}
      addLabel={t('fr.body.text.add_1df8', 'Add')}
      addedLabel={t('fr.body.text.added_0167', 'Added')}
    />
  );
}

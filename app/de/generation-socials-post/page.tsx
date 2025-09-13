import { t } from '@transifex/native';
import PageView from "@/templates/GenerationSocialsPostPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);

  return (
    <PageView
      chatTitle={t(
        'de.body.text.organize_chats_coming_soon_03b3',
        'Organize chats (coming soon)'
      )}
      promptContent={t(
        'de.body.text.welcome_area_will_let_you_organize_chats_v1_dd05',
        'Welcome! This area will let you organize your chats.\n\nIn V1 you\'ll get:\n• System lists: Transcripts, Therapies, Favorites, Archived\n• Your own lists: create, rename, delete\n• Add a chat to multiple lists (like tags)\n• Favorite and Archive toggles\n• Search and filter\n\nAll metadata stays private; content remains end-to-end encrypted. Later we’ll add Smart Lists (saved filters), shared lists for teams, and bulk actions.'
      )}
      promptTime={t('de.body.text.just_now_1dcc', 'Just now')}
    />
  );
}

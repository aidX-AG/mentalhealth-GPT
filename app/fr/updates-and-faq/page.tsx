import { t } from '@transifex/native';
import PageView from "@/templates/UpdatesAndFaqPage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { updates } from "@/mocks/updates";
import { faqs } from "@/mocks/faq";

export default function Page() {
  const messages = loadMessages("fr");
  const t = makeT(messages);

  const faqItems = faqs.map((f) => ({
    ...f,
    title: t(f.title),
    content: t(f.content),
  }));

  const updatesItems = updates.map((u) => ({
    ...u,
    title: t(u.title),
    date: t(u.date),
    content: t(u.content),
  }));

  return (
    <PageView
      title={t('fr.body.text.updates_faq_87ef', 'Updates & FAQ')}
      subtitle={t(
        'fr.body.text.features_fixes_improvements_bdfa',
        'Features, fixes & improvements.'
      )}
      tabs={[t('fr.body.text.updates_29db', 'Updates'), t('fr.body.text.faq_2489', 'FAQ')]}
      faqItems={faqItems}
      updatesItems={updatesItems}
      ctaTitle={t('fr.body.text.can_t_find_any_answer_e96e', 'Can’t find any answer?')}
      ctaSubtitle={t(
        'fr.body.text.let_s_ask_smartest_ai_chat_c899',
        'Let’s ask the smartest AI Chat'
      )}
      ctaButtonLabel={t('fr.body.text.ask_mentalhealthgpt_fb4f', 'Ask mentalhealthGPT')}
      loadMoreLabel={t('fr.body.text.load_more_1668', 'Load more')}
    />
  );
}

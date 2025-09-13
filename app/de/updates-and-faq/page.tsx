import { t } from '@transifex/native';
import PageView from "@/templates/UpdatesAndFaqPage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { updates } from "@/mocks/updates";
import { faqs } from "@/mocks/faq";

export default function Page() {
  const messages = loadMessages("de");
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
      title={t('de.body.text.updates_faq_123f', 'Updates & FAQ')}
      subtitle={t(
        'de.body.text.features_fixes_improvements_4ae0',
        'Features, fixes & improvements.'
      )}
      tabs={[t('de.body.text.updates_6b84', 'Updates'), t('de.body.text.faq_b5f3', 'FAQ')]}
      faqItems={faqItems}
      updatesItems={updatesItems}
      ctaTitle={t('de.body.text.can_t_find_any_answer_cf21', 'Can’t find any answer?')}
      ctaSubtitle={t(
        'de.body.text.let_s_ask_smartest_ai_chat_beaa',
        'Let’s ask the smartest AI Chat'
      )}
      ctaButtonLabel={t('de.body.text.ask_mentalhealthgpt_e020', 'Ask mentalhealthGPT')}
      loadMoreLabel={t('de.body.text.load_more_43ce', 'Load more')}
    />
  );
}

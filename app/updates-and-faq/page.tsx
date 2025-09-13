import { t } from '@transifex/native';
import PageView from "@/templates/UpdatesAndFaqPage";
import { loadMessages, makeT } from "@/lib/i18n-static";
import { updates } from "@/mocks/updates";
import { faqs } from "@/mocks/faq";

export default function Page() {
  const messages = loadMessages("en");
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
      title={t('updates_and_faq.body.text.updates_faq_4d1e', 'Updates & FAQ')}
      subtitle={t(
        'updates_and_faq.body.text.features_fixes_improvements_905f',
        'Features, fixes & improvements.'
      )}
      tabs={[t('updates_and_faq.body.text.updates_6c75', 'Updates'), t('updates_and_faq.body.text.faq_2322', 'FAQ')]}
      faqItems={faqItems}
      updatesItems={updatesItems}
      ctaTitle={t(
        'updates_and_faq.body.text.can_t_find_any_answer_8d65',
        'Can’t find any answer?'
      )}
      ctaSubtitle={t(
        'updates_and_faq.body.text.let_s_ask_smartest_ai_chat_3693',
        'Let’s ask the smartest AI Chat'
      )}
      ctaButtonLabel={t(
        'updates_and_faq.body.text.ask_mentalhealthgpt_82f4',
        'Ask mentalhealthGPT'
      )}
      loadMoreLabel={t('updates_and_faq.body.text.load_more_b7df', 'Load more')}
    />
  );
}

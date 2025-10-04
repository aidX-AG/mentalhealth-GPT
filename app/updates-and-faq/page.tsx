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
      title={t("updates-and-faq.sections.title")}
      subtitle={t("updates-and-faq.sections.subtitle")}
      tabs={[t("Updates"), t("FAQ")]}
      faqItems={faqItems}
      updatesItems={updatesItems}
      ctaTitle={t("updates-and-faq.sections.question")}
      ctaSubtitle={t("updates-and-faq.sections.lets-ask-ai")}
      ctaButtonLabel={t("updates-and-faq.buttons.ask-mh-gpt")}
      loadMoreLabel={t("updates-and-faq.buttons.load-more")}
    />
  );
}

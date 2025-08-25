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
      title={t("Updates & FAQ")}
      subtitle={t("Features, fixes & improvements.")}
      tabs={[t("Updates"), t("FAQ")]}
      faqItems={faqItems}
      updatesItems={updatesItems}
      ctaTitle={t("Can’t find any answer?")}
      ctaSubtitle={t("Let’s ask the smartest AI Chat")}
      ctaButtonLabel={t("Ask mentalhealthGPT")}
      loadMoreLabel={t("Load more")}
    />
  );
}

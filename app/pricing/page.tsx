import PageView from "@/templates/PricingPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en"));

  const faqItems = [
    { id: "0",
      title: t("Can I try mentalhealthGPT before committing to a paid plan?"),
      content: t("Yes, we offer a free plan with limited access to AI capabilities. This allows you to explore the platform and see if it meets your needs before upgrading to a paid plan."),
      defaultOpen: true,
    },
    { id: "1",
      title: t("Do you offer a free trial for any of the plans?"),
      content: t("Yes, the free plan functions as a trial with limited features. As we expand, selected features like transcription or documentation may also include time-limited trial access."),
    },
    { id: "2",
      title: t("What is the Founding Membership and why should I join?"),
      content: t("The Founding Membership is a one-time opportunity to support the early development of mentalhealthGPT and gain exclusive access and benefits. By contributing early (e.g., €90/CHF90 for the first year), you get full access to all new features as they’re released — including transcription, documentation, and domain-specific AI assistants. As a thank-you, your second year will be free. Founding Members are more than users: they help shape the roadmap and can actively provide feedback. It’s ideal for professionals and institutions who want to be part of something transformative from the very beginning."),
    },
  ];

  return (
    <PageView
      title={t("AI chat made affordable")}
      subtitle={t("Pricing Plans for every budget")}
      choosePlanLabel={t("Choose plan")}
      yearlyLabel={t("Yearly billing")}
      monthlyLabel={t("Monthly billing")}
      // Package:
      popularLabel={t("Popular")}
      perYearLabel={t("year")}
      perMonthLabel={t("mo")}
      currentPlanLabel={t("Current plan")}
      upgradeLabel={t("Upgrade")}
      // Features:
      coreFeaturesLabel={t("Core features")}
      freeLabel={t("Free")}
      proLabel={t("Pro")}
      enterpriseLabel={t("Enterprise")}
      viaEmailLabel={t("Via email")}
      chat247Label={t("Chat 24/7")}
      // FAQ:
      faqTitle={t("Frequently asked questions")}
      faqItems={faqItems}
    />
  );
}

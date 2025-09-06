import PageView from "@/templates/PricingPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));

  const faqItems = [
    { id: "0",
      title: t("Can I try mentalhealthGPT before committing to a paid plan?"),
      content: t("Yes — the Starter and Pro plans include a 7-day free trial. You won’t be charged if you cancel during the trial. Access matches the selected plan, and billing starts only after day 7. You can switch plans or cancel anytime from Settings."),
      defaultOpen: true,
    },
    { id: "3",
      title: t("Can I get a refund if I cancel my yearly plan early?"),
      content: t("We don’t issue refunds for early cancellations. However, you will keep full access to all features until the end of your current subscription period."),
    },
    { id: "2",
      title: t("Why does mentalhealthGPT cost more than other chat AIs?"),
      content: t("Unlike generic AI chatbots, mentalhealthGPT is designed specifically for mental health professionals and institutions. We invest in data protection, secure hosting in Switzerland/EU, and specialized models for therapy, supervision, diagnostics, and documentation. This focus on quality, trust, and professional use makes the subscription more expensive than mass-market AI tools."),
    },
  ];

  return (
    <PageView
      title={t("AI chat built for mental health")}
      subtitle={t("User Plans for every needs")}
      choosePlanLabel={t("Choose plan")}
      yearlyLabel={t("Yearly billing")}
      monthlyLabel={t("Monthly billing")}
      // Package:
      popularLabel={t("popular")}
      perYearLabel={t("year")}
      perMonthLabel={t("mo")}
      currentPlanLabel={t("Current plan")}
      upgradeLabel={t("Upgrade")}
      // Features:
      coreFeaturesLabel={t("Core features")}
      freeLabel={t("Starter")}
      proLabel={t("Pro")}
      enterpriseLabel={t("Institution")}
      viaEmailLabel={t("via email")}
      chat247Label={t("Chat 24/7")}
      // FAQ:
      faqTitle={t("Frequently asked questions")}
      faqItems={faqItems}
    />
  );
}

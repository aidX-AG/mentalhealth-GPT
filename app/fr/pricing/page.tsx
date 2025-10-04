import PageView from "@/templates/PricingPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));

  const faqItems = [
    { id: "0",
      title: t("pricing.faq.try-plan-q"),
      content: t("pricing.faq.try-plan-a"),
      defaultOpen: true,
    },
    { id: "3",
      title: t("pricing.faq.refund-q"),
      content: t("pricing.faq.refund-a"),
    },
    { id: "2",
      title: t("pricing.faq.cost-q"),
      content: t("pricing.faq.cost-a"),
    },
  ];

  return (
    <PageView
      title={t("pricing.sections.hero-title-mental")}
      subtitle={t("pricing.sections.hero-subtitle-users")}
      choosePlanLabel={t("pricing.sections.choose-plan")}
      yearlyLabel={t("pricing.sections.yearly")}
      monthlyLabel={t("pricing.sections.monthly")}
      // Package:
      popularLabel={t("pricing.badges.popular-lc")}
      perYearLabel={t("pricing.sections.year-lc")}
      perMonthLabel={t("pricing.misc.month-lc")}
      currentPlanLabel={t("pricing.sections.current-plan")}
      upgradeLabel={t("pricing.actions.upgrade")}
      // Features:
      coreFeaturesLabel={t("pricing.sections.core-features")}
      freeLabel={t("pricing.tiers.starter")}
      proLabel={t("pricing.sections.pro")}
      enterpriseLabel={t("pricing.tiers.institution")}
      viaEmailLabel={t("pricing.badges.via-email-lc")}
      chat247Label={t("pricing.badges.chat-247")}
      // FAQ:
      faqTitle={t("pricing.sections.faq")}
      faqItems={faqItems}
    />
  );
}

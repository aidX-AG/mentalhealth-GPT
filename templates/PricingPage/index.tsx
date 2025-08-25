"use client";

import Layout from "@/components/Layout";
import Main from "./Main";
import Faq from "./Faq";

type Props = {
  title: string;
  subtitle: string;
  choosePlanLabel: string;
  yearlyLabel: string;
  monthlyLabel: string;
  // Package
  popularLabel: string;
  perYearLabel: string;
  perMonthLabel: string;
  currentPlanLabel: string;
  upgradeLabel: string;
  // Features
  coreFeaturesLabel: string;
  freeLabel: string;
  proLabel: string;
  enterpriseLabel: string;
  viaEmailLabel: string;
  chat247Label: string;
  // FAQ
  faqTitle: string;
  faqItems: Array<{ id: string; title: string; content: string; defaultOpen?: boolean }>;
};

const PricingPage = ({
  title,
  subtitle,
  choosePlanLabel,
  yearlyLabel,
  monthlyLabel,
  popularLabel,
  perYearLabel,
  perMonthLabel,
  currentPlanLabel,
  upgradeLabel,
  coreFeaturesLabel,
  freeLabel,
  proLabel,
  enterpriseLabel,
  viaEmailLabel,
  chat247Label,
  faqTitle,
  faqItems,
}: Props) => {
  return (
    <Layout smallSidebar hideRightSidebar>
      <Main
        title={title}
        subtitle={subtitle}
        choosePlanLabel={choosePlanLabel}
        yearlyLabel={yearlyLabel}
        monthlyLabel={monthlyLabel}
        popularLabel={popularLabel}
        perYearLabel={perYearLabel}
        perMonthLabel={perMonthLabel}
        currentPlanLabel={currentPlanLabel}
        upgradeLabel={upgradeLabel}
        coreFeaturesLabel={coreFeaturesLabel}
        freeLabel={freeLabel}
        proLabel={proLabel}
        enterpriseLabel={enterpriseLabel}
        viaEmailLabel={viaEmailLabel}
        chat247Label={chat247Label}
      />
      <Faq title={faqTitle} items={faqItems} />
    </Layout>
  );
};

export default PricingPage;

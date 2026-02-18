// templates/PricingPage/Main/index.tsx
// --------------------------------------------------------------------------
// [pricing-ssr-i18n] v1.0.1 — 2025-09-03
// CHANGELOG:
// - Entfernt getT(); alle Texte kommen via Props (SSR).
// - Radio `name` ist jetzt stabil "plan" (nicht übersetzt).
// - KEINE Layout- oder Klassenänderungen.
// --------------------------------------------------------------------------

import { useState } from "react";
import Radio from "@/components/Radio";
import Package from "./Package";
import Features from "./Features";
import { getPrice, getFeaturesPrice } from "@/mocks/price";
import { useTranslation } from "@/lib/i18n/I18nContext";

type MainProps = {
  title: string;
  subtitle: string;
  choosePlanLabel: string;
  yearlyLabel: string;
  monthlyLabel: string;
  // Package labels:
  popularLabel: string;
  perYearLabel: string;
  perMonthLabel: string;
  currentPlanLabel: string;
  upgradeLabel: string;
  // Features labels:
  coreFeaturesLabel: string;
  freeLabel: string;
  proLabel: string;
  enterpriseLabel: string;
  viaEmailLabel: string;
  chat247Label: string;
};

const Main = ({
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
}: MainProps) => {
  const t = useTranslation();
  const price = getPrice(t);
  const featuresPrice = getFeaturesPrice(t);

  const [plan, setPlan] = useState(false);

  return (
    <div className="py-32 px-15 bg-n-2 rounded-t-[1.25rem] 2xl:py-20 2xl:px-10 xl:px-8 md:rounded-none dark:bg-n-6">
      <div className="max-w-[75.25rem] mx-auto">
        <div className="mb-20 text-center 2xl:mb-16 lg:mb-10">
          <div className="mb-4 h2 lg:h3">{title}</div>
          <div className="body1 text-n-4">{subtitle}</div>
        </div>

        <div className="flex mb-20 py-4 2xl:block 2xl:py-0 lg:mb-0">
          <div className="w-[14.875rem] pt-8 pr-6 2xl:w-full 2xl:mb-20 2xl:pt-0 2xl:pr-0 lg:mb-10">
            <div className="mb-6 h4 2xl:mb-5 2xl:text-center">{choosePlanLabel}</div>
            <div className="2xl:flex 2xl:justify-center">
              <Radio
                className="mb-4 2xl:mb-0 2xl:mr-4"
                name="plan"
                value={plan}
                onChange={() => setPlan(true)}
                content={yearlyLabel}
              />
              <Radio
                name="plan"
                value={!plan}
                onChange={() => setPlan(false)}
                content={monthlyLabel}
              />
            </div>
          </div>

          <div className="flex grow lg:overflow-auto lg:scroll-smooth lg:scrollbar-none lg:py-6 lg:-mx-8 lg:before:shrink-0 lg:before:w-4 lg:after:shrink-0 lg:after:w-4">
            {price.map((x) => (
              <Package
                key={x.id}
                item={x}
                plan={plan}
                popularLabel={popularLabel}
                perYearLabel={perYearLabel}
                perMonthLabel={perMonthLabel}
                currentPlanLabel={currentPlanLabel}
                upgradeLabel={upgradeLabel}
              />
            ))}
          </div>
        </div>

        <Features
          items={featuresPrice}
          coreFeaturesLabel={coreFeaturesLabel}
          freeLabel={freeLabel}
          proLabel={proLabel}
          enterpriseLabel={enterpriseLabel}
          viaEmailLabel={viaEmailLabel}
          chat247Label={chat247Label}
        />
      </div>
    </div>
  );
};

export default Main;

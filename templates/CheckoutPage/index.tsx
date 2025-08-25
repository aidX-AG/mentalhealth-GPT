"use client";

import Layout from "@/components/Layout";
import Details from "./Details";
import Form from "./Form";

type Props = {
  heroTitle: string;
  heroSubtitle: string;
  // Details:
  tierName: string;
  popularLabel: string;
  priceAmount: string;
  pricePeriod: string;
  features: string[];
  // Form:
  planLabel: string;
  changeCurrencyLabel: string;
  currencyCode: string;
  monthlyLabel: string;
  yearlyLabel: string;
  saveLabel: string;
  payPrefix: string;
  perMonthSuffix: string;
  billingEmailLabel: string;
  emailPlaceholder: string;
  cardDetailsLabel: string;
  cardNumberPlaceholder: string;
  expPlaceholder: string;
  cvcPlaceholder: string;
  secureNote: string;
  billedNowLabel: string;
  billedNowAmount: string;
  applyPromoLabel: string;
  termsText: string;
  startPlanLabel: string;
};

const CheckoutPage = (props: Props) => {
  const {
    heroTitle,
    heroSubtitle,
    tierName,
    popularLabel,
    priceAmount,
    pricePeriod,
    features,
    planLabel,
    changeCurrencyLabel,
    currencyCode,
    monthlyLabel,
    yearlyLabel,
    saveLabel,
    payPrefix,
    perMonthSuffix,
    billingEmailLabel,
    emailPlaceholder,
    cardDetailsLabel,
    cardNumberPlaceholder,
    expPlaceholder,
    cvcPlaceholder,
    secureNote,
    billedNowLabel,
    billedNowAmount,
    applyPromoLabel,
    termsText,
    startPlanLabel,
  } = props;

  return (
    <Layout backUrl="/pricing" smallSidebar hideRightSidebar>
      <div className="px-15 py-12 2xl:px-10 2xl:py-14 xl:px-8 lg:pt-20 md:pt-5 md:px-6">
        <div className="max-w-[58.25rem] mx-auto">
          <div className="mb-4 h2 md:h3 md:pr-16">{heroTitle}</div>
          <div className="body1 text-n-4 md:body2">{heroSubtitle}</div>

          <div className="flex justify-between mt-10 pt-16 border-t border-n-3 lg:block lg:mt-6 lg:pt-0 lg:border-0 md:mt-10 md:border-t md:pt-4 dark:border-n-5">
            <div className="w-full max-w-[20.375rem] lg:max-w-full lg:mb-8">
              <Details
                tierName={tierName}
                popularLabel={popularLabel}
                priceAmount={priceAmount}
                pricePeriod={pricePeriod}
                features={features}
              />
            </div>

            <div className="w-[29.875rem] xl:w-[29rem] lg:w-full">
              <Form
                planLabel={planLabel}
                changeCurrencyLabel={changeCurrencyLabel}
                currencyCode={currencyCode}
                monthlyLabel={monthlyLabel}
                yearlyLabel={yearlyLabel}
                saveLabel={saveLabel}
                payPrefix={payPrefix}
                perMonthSuffix={perMonthSuffix}
                billingEmailLabel={billingEmailLabel}
                emailPlaceholder={emailPlaceholder}
                cardDetailsLabel={cardDetailsLabel}
                cardNumberPlaceholder={cardNumberPlaceholder}
                expPlaceholder={expPlaceholder}
                cvcPlaceholder={cvcPlaceholder}
                secureNote={secureNote}
                billedNowLabel={billedNowLabel}
                billedNowAmount={billedNowAmount}
                applyPromoLabel={applyPromoLabel}
                termsText={termsText}
                startPlanLabel={startPlanLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;

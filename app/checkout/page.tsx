import PageView from "@/templates/CheckoutPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en"));

  return (
    <PageView
      heroTitle={t("AI chat made affordable")}
      heroSubtitle={t("Pricing Plans for every budget - Unlock the power of AI")}

      tierName={t("Institution")}
      popularLabel={t("Popular")}
      priceAmount="CHF399"
      pricePeriod={t("Monthly Plan")}
      features={[
        t("Customizable AI models"),
        t("Advanced team management"),
        t("Institution-level support"),
        t("Integration with CRMs"),
        t("Dedicated account manager"),
      ]}

      planLabel={t("Plan")}
      changeCurrencyLabel={t("Change currency")}
      currencyCode="CHF"
      monthlyLabel={t("monthly")}
      yearlyLabel={t("yearly")}
      saveLabel={t("Save")}
      payPrefix={t("Pay")}
      perMonthSuffix={t("/month")}
      billingEmailLabel={t("Billing email")}
      emailPlaceholder={t("Email address")}
      cardDetailsLabel={t("Card details")}
      cardNumberPlaceholder={t("Card number")}
      expPlaceholder={t("MM / YY")}
      cvcPlaceholder={t("CVC")}

      secureNote={t("Secured form with CH Banking")}
      billedNowLabel={t("Billed now")}
      billedNowAmount="CHF399"
      applyPromoLabel={t("Apply promo code")}
      termsText={t('By clicking "Start Institution plan", you agree to be charged CHF399 every month, unless you cancel.')}
      startPlanLabel={t("Start Institution plan")}
    />
  );
}

import PageView from "@/templates/CheckoutPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));

  return (
    <PageView
      heroTitle={t("AI chat made affordable")}
      heroSubtitle={t("checkout.body.hero-subtitle")}

      tierName={t("pricing.tiers.institution")}
      popularLabel={t("checkout.sections.popular")}
      priceAmount="CHF399"
      pricePeriod={t("checkout.sections.monthly-plan")}
      features={[
        t("checkout.features.customizable-models"),
        t("checkout.features.advanced-team"),
        t("checkout.features.institution-support"),
        t("Integration with CRMs"),
        t("checkout.features.dedicated-account-manager"),
      ]}

      planLabel={t("checkout.sections.plan")}
      changeCurrencyLabel={t("checkout.sections.change-currency")}
      currencyCode="CHF"
      monthlyLabel={t("checkout.misc.monthly-lc")}
      yearlyLabel={t("checkout.misc.yearly-lc")}
      saveLabel={t("checkout.badges.save")}
      payPrefix={t("checkout.sections.pay")}
      perMonthSuffix={t("/month")}
      billingEmailLabel={t("checkout.sections.billing-email")}
      emailPlaceholder={t("checkout.form.email")}
      cardDetailsLabel={t("checkout.sections.card-details")}
      cardNumberPlaceholder={t("checkout.form.card-number")}
      expPlaceholder={t("checkout.form.mm-yy")}
      cvcPlaceholder={t("checkout.form.cvc")}

      secureNote={t("checkout.notes.secured")}
      billedNowLabel={t("checkout.notes.billed-now")}
      billedNowAmount="CHF399"
      applyPromoLabel={t("checkout.actions.apply-promo")}
      termsText={t('By clicking "Start Institution plan", you agree to be charged CHF399 every month, unless you cancel.')}
      startPlanLabel={t("Start Institution plan")}
    />
  );
}

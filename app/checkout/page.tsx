import PageView from "@/templates/CheckoutPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en"));

  return (
    <PageView
      heroTitle={t("checkout.sections.hero-title")}
      heroSubtitle={t("checkout.body.hero-subtitle")}

      tierName={t("checkout.sections.enterprise")}
      popularLabel={t("checkout.sections.popular")}
      priceAmount="CHF 399"
      pricePeriod={t("checkout.sections.monthly-plan")}
      features={[
        t("checkout.features.customizable-models"),
        t("checkout.features.advanced-team"),
        t("checkout.features.institution-support"),
        t("checkout.features.customizable-institution-models"),
        t("checkout.features.dedicated-account-manager"),
      ]}

      planLabel={t("checkout.sections.plan")}
      changeCurrencyLabel={t("checkout.sections.change-currency")}
      currencyCode="CHF"
      monthlyLabel={t("checkout.misc.monthly-lc")}
      yearlyLabel={t("checkout.misc.yearly-lc")}
      saveLabel={t("checkout.badges.save")}
      payPrefix={t("checkout.sections.pay")}
      perMonthSuffix={t("checkout.sections.per-month")}
      billingEmailLabel={t("checkout.sections.billing-email")}
      emailPlaceholder={t("checkout.form.email")}
      cardDetailsLabel={t("checkout.sections.card-details")}
      cardNumberPlaceholder={t("checkout.form.card-number")}
      expPlaceholder={t("checkout.form.mm-yy")}
      cvcPlaceholder={t("checkout.form.cvc")}

      secureNote={t("checkout.notes.secured")}
      billedNowLabel={t("checkout.notes.billed-now")}
      billedNowAmount="CHF 399"
      applyPromoLabel={t("checkout.actions.apply-promo")}
      termsText={t("checkout.terms.accept")}
      startPlanLabel={t("checkout.form.start-plan")}
    />
  );
}

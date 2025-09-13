import { t } from '@transifex/native';
import PageView from "@/templates/CheckoutPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));

  return (
    <PageView
      heroTitle={t('de.body.text.ai_chat_made_affordable_1f5b', 'AI chat made affordable')}
      heroSubtitle={t(
        'de.body.text.pricing_plans_every_budget_unlock_power_ai_9d80',
        'Pricing Plans for every budget - Unlock the power of AI'
      )}

      tierName={t('de.body.text.institution_1834', 'Institution')}
      popularLabel={t('de.body.text.popular_d39d', 'Popular')}
      priceAmount="CHF399"
      pricePeriod={t('de.body.text.monthly_plan_fd7d', 'Monthly Plan')}
      features={[
        t('de.body.text.customizable_ai_models_672a', 'Customizable AI models'),
        t('de.body.text.advanced_team_management_11af', 'Advanced team management'),
        t('de.body.text.institution_level_support_f403', 'Institution-level support'),
        t('de.body.text.integration_crms_2c5a', 'Integration with CRMs'),
        t('de.body.text.dedicated_account_manager_4330', 'Dedicated account manager'),
      ]}

      planLabel={t('de.body.text.plan_8138', 'Plan')}
      changeCurrencyLabel={t('de.body.text.change_currency_7ba2', 'Change currency')}
      currencyCode="CHF"
      monthlyLabel={t('de.body.text.monthly_963a', 'monthly')}
      yearlyLabel={t('de.body.text.yearly_81e1', 'yearly')}
      saveLabel={t('de.body.text.save_55d6', 'Save')}
      payPrefix={t('de.body.text.pay_e581', 'Pay')}
      perMonthSuffix={t('de.body.text.month_b1de', '/month')}
      billingEmailLabel={t('de.body.text.billing_email_bf79', 'Billing email')}
      emailPlaceholder={t('de.body.text.email_address_e754', 'Email address')}
      cardDetailsLabel={t('de.body.text.card_details_ee15', 'Card details')}
      cardNumberPlaceholder={t('de.body.text.card_number_2346', 'Card number')}
      expPlaceholder={t('de.body.text.mm_yy_ea4c', 'MM / YY')}
      cvcPlaceholder={t('de.body.text.cvc_0c3c', 'CVC')}

      secureNote={t(
        'de.body.text.secured_form_ch_banking_fcc7',
        'Secured form with CH Banking'
      )}
      billedNowLabel={t('de.body.text.billed_now_3dba', 'Billed now')}
      billedNowAmount="CHF399"
      applyPromoLabel={t('de.body.text.apply_promo_code_113c', 'Apply promo code')}
      termsText={t(
        'de.body.text.clicking_start_institution_plan_you_agree_charged_chf399_c5c6',
        'By clicking "Start Institution plan", you agree to be charged CHF399 every month, unless you cancel.'
      )}
      startPlanLabel={t('de.body.text.start_institution_plan_0153', 'Start Institution plan')}
    />
  );
}

import { t } from '@transifex/native';
import PageView from "@/templates/CheckoutPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));

  return (
    <PageView
      heroTitle={t('fr.body.text.ai_chat_made_affordable_baad', 'AI chat made affordable')}
      heroSubtitle={t(
        'fr.body.text.pricing_plans_every_budget_unlock_power_ai_ddf3',
        'Pricing Plans for every budget - Unlock the power of AI'
      )}

      tierName={t('fr.body.text.institution_2a15', 'Institution')}
      popularLabel={t('fr.body.text.popular_1166', 'Popular')}
      priceAmount="CHF399"
      pricePeriod={t('fr.body.text.monthly_plan_6a88', 'Monthly Plan')}
      features={[
        t('fr.body.text.customizable_ai_models_44e0', 'Customizable AI models'),
        t('fr.body.text.advanced_team_management_47a0', 'Advanced team management'),
        t('fr.body.text.institution_level_support_d6a1', 'Institution-level support'),
        t('fr.body.text.integration_crms_f5d1', 'Integration with CRMs'),
        t('fr.body.text.dedicated_account_manager_38ed', 'Dedicated account manager'),
      ]}

      planLabel={t('fr.body.text.plan_194b', 'Plan')}
      changeCurrencyLabel={t('fr.body.text.change_currency_1557', 'Change currency')}
      currencyCode="CHF"
      monthlyLabel={t('fr.body.text.monthly_71bc', 'monthly')}
      yearlyLabel={t('fr.body.text.yearly_a9f7', 'yearly')}
      saveLabel={t('fr.body.text.save_68a7', 'Save')}
      payPrefix={t('fr.body.text.pay_c111', 'Pay')}
      perMonthSuffix={t('fr.body.text.month_2e0e', '/month')}
      billingEmailLabel={t('fr.body.text.billing_email_a10e', 'Billing email')}
      emailPlaceholder={t('fr.body.text.email_address_8dda', 'Email address')}
      cardDetailsLabel={t('fr.body.text.card_details_ae73', 'Card details')}
      cardNumberPlaceholder={t('fr.body.text.card_number_f9ac', 'Card number')}
      expPlaceholder={t('fr.body.text.mm_yy_9648', 'MM / YY')}
      cvcPlaceholder={t('fr.body.text.cvc_6ced', 'CVC')}

      secureNote={t(
        'fr.body.text.secured_form_ch_banking_60f1',
        'Secured form with CH Banking'
      )}
      billedNowLabel={t('fr.body.text.billed_now_a974', 'Billed now')}
      billedNowAmount="CHF399"
      applyPromoLabel={t('fr.body.text.apply_promo_code_a87b', 'Apply promo code')}
      termsText={t(
        'fr.body.text.clicking_start_institution_plan_you_agree_charged_chf399_357f',
        'By clicking "Start Institution plan", you agree to be charged CHF399 every month, unless you cancel.'
      )}
      startPlanLabel={t('fr.body.text.start_institution_plan_241f', 'Start Institution plan')}
    />
  );
}

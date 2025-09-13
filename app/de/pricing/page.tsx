import { t } from '@transifex/native';
import PageView from "@/templates/PricingPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));

  const faqItems = [
    { id: "0",
      title: t(
        'de.body.text.can_i_try_mentalhealthgpt_before_committing_paid_plan_5623',
        'Can I try mentalhealthGPT before committing to a paid plan?'
      ),
      content: t(
        'de.body.text.yes_starter_pro_plans_include_7_day_free_9ed8',
        'Yes — the Starter and Pro plans include a 7-day free trial. You won’t be charged if you cancel during the trial. Access matches the selected plan, and billing starts only after day 7. You can switch plans or cancel anytime from Settings.'
      ),
      defaultOpen: true,
    },
    { id: "3",
      title: t(
        'de.body.text.can_i_get_refund_if_i_cancel_my_1eaf',
        'Can I get a refund if I cancel my yearly plan early?'
      ),
      content: t(
        'de.body.text.we_don_t_issue_refunds_early_cancellations_however_bb5d',
        'We don’t issue refunds for early cancellations. However, you will keep full access to all features until the end of your current subscription period.'
      ),
    },
    { id: "2",
      title: t(
        'de.body.text.why_does_mentalhealthgpt_cost_more_than_other_chat_23e9',
        'Why does mentalhealthGPT cost more than other chat AIs?'
      ),
      content: t(
        'de.body.text.unlike_generic_ai_chatbots_mentalhealthgpt_designed_specifically_mental_bf72',
        'Unlike generic AI chatbots, mentalhealthGPT is designed specifically for mental health professionals and institutions. We invest in data protection, secure hosting in Switzerland/EU, and specialized models for therapy, supervision, diagnostics, and documentation. This focus on quality, trust, and professional use makes the subscription more expensive than mass-market AI tools.'
      ),
    },
  ];

  return (
    <PageView
      title={t(
        'de.body.text.ai_chat_built_mental_health_b864',
        'AI chat built for mental health'
      )}
      subtitle={t('de.body.text.user_plans_every_needs_4e8b', 'User Plans for every needs')}
      choosePlanLabel={t('de.body.text.choose_plan_b37c', 'Choose plan')}
      yearlyLabel={t('de.body.text.yearly_billing_4a68', 'Yearly billing')}
      monthlyLabel={t('de.body.text.monthly_billing_4d37', 'Monthly billing')}
      // Package:
      popularLabel={t('de.body.text.popular_3ce6', 'popular')}
      perYearLabel={t('de.body.text.year_9c7e', 'year')}
      perMonthLabel={t('de.body.text.mo_6ed0', 'mo')}
      currentPlanLabel={t('de.body.text.current_plan_dcf7', 'Current plan')}
      upgradeLabel={t('de.body.text.upgrade_90cb', 'Upgrade')}
      // Features:
      coreFeaturesLabel={t('de.body.text.core_features_b485', 'Core features')}
      freeLabel={t('de.body.text.starter_476e', 'Starter')}
      proLabel={t('de.body.text.pro_d492', 'Pro')}
      enterpriseLabel={t('de.body.text.institution_9ba2', 'Institution')}
      viaEmailLabel={t('de.body.text.via_email_bf70', 'via email')}
      chat247Label={t('de.body.text.chat_24_7_dcde', 'Chat 24/7')}
      // FAQ:
      faqTitle={t(
        'de.body.text.frequently_asked_questions_60b2',
        'Frequently asked questions'
      )}
      faqItems={faqItems}
    />
  );
}

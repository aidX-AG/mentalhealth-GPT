import { t } from '@transifex/native';
import PageView from "@/templates/PricingPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));

  const faqItems = [
    { id: "0",
      title: t(
        'fr.body.text.can_i_try_mentalhealthgpt_before_committing_paid_plan_363c',
        'Can I try mentalhealthGPT before committing to a paid plan?'
      ),
      content: t(
        'fr.body.text.yes_starter_pro_plans_include_7_day_free_3551',
        'Yes — the Starter and Pro plans include a 7-day free trial. You won’t be charged if you cancel during the trial. Access matches the selected plan, and billing starts only after day 7. You can switch plans or cancel anytime from Settings.'
      ),
      defaultOpen: true,
    },
    { id: "3",
      title: t(
        'fr.body.text.can_i_get_refund_if_i_cancel_my_7e0b',
        'Can I get a refund if I cancel my yearly plan early?'
      ),
      content: t(
        'fr.body.text.we_don_t_issue_refunds_early_cancellations_however_7410',
        'We don’t issue refunds for early cancellations. However, you will keep full access to all features until the end of your current subscription period.'
      ),
    },
    { id: "2",
      title: t(
        'fr.body.text.why_does_mentalhealthgpt_cost_more_than_other_chat_40f9',
        'Why does mentalhealthGPT cost more than other chat AIs?'
      ),
      content: t(
        'fr.body.text.unlike_generic_ai_chatbots_mentalhealthgpt_designed_specifically_mental_4e5d',
        'Unlike generic AI chatbots, mentalhealthGPT is designed specifically for mental health professionals and institutions. We invest in data protection, secure hosting in Switzerland/EU, and specialized models for therapy, supervision, diagnostics, and documentation. This focus on quality, trust, and professional use makes the subscription more expensive than mass-market AI tools.'
      ),
    },
  ];

  return (
    <PageView
      title={t(
        'fr.body.text.ai_chat_built_mental_health_1b2b',
        'AI chat built for mental health'
      )}
      subtitle={t('fr.body.text.user_plans_every_needs_dcdb', 'User Plans for every needs')}
      choosePlanLabel={t('fr.body.text.choose_plan_c7f4', 'Choose plan')}
      yearlyLabel={t('fr.body.text.yearly_billing_2c66', 'Yearly billing')}
      monthlyLabel={t('fr.body.text.monthly_billing_46f0', 'Monthly billing')}
      // Package:
      popularLabel={t('fr.body.text.popular_9ec2', 'popular')}
      perYearLabel={t('fr.body.text.year_0400', 'year')}
      perMonthLabel={t('fr.body.text.mo_61d1', 'mo')}
      currentPlanLabel={t('fr.body.text.current_plan_f05d', 'Current plan')}
      upgradeLabel={t('fr.body.text.upgrade_c685', 'Upgrade')}
      // Features:
      coreFeaturesLabel={t('fr.body.text.core_features_70bc', 'Core features')}
      freeLabel={t('fr.body.text.starter_9ded', 'Starter')}
      proLabel={t('fr.body.text.pro_fc3e', 'Pro')}
      enterpriseLabel={t('fr.body.text.institution_ea93', 'Institution')}
      viaEmailLabel={t('fr.body.text.via_email_ad84', 'via email')}
      chat247Label={t('fr.body.text.chat_24_7_c262', 'Chat 24/7')}
      // FAQ:
      faqTitle={t(
        'fr.body.text.frequently_asked_questions_b6ba',
        'Frequently asked questions'
      )}
      faqItems={faqItems}
    />
  );
}

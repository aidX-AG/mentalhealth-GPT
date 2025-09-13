import { t } from '@transifex/native';
import PageView from "@/templates/TherapySupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("en");
  const t = makeT(messages);

  return (
    <PageView
      title={t('therapy_support.body.text.therapy_support_ai_8acb', 'Therapy Support AI')}
      introText={t(
        'therapy_support.body.text.hello_i_m_therapy_support_ai_feel_free_7b0a',
        '🧠 Hello! I\'m your Therapy Support AI. Feel free to describe your case, specific symptoms, or ask for therapeutic strategies.'
      )}
      noticeTextPrefix={t(
        'therapy_support.body.text.ai_functionality_35dd',
        '🚧 The AI functionality for '
      )}
      featureName={t('therapy_support.body.text.therapy_support_9a3b', 'Therapy Support')}
      noticeTextSuffix={t(
        'therapy_support.body.text.currently_under_development_will_soon_available_specialized_models_a61c',
        ' is currently under development. It will soon be available with specialized models for therapy planning, reflection, and evidence‑based suggestions.'
      )}
      contactCta={t(
        'therapy_support.body.text.want_support_mentalhealthgpt_or_learn_more_email_9cfe',
        'Want to support mentalhealthGPT or learn more? Email'
      )}
      contactEmail="hello@aidx.ch"
    />
  );
}

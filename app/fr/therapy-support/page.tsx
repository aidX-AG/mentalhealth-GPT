import { t } from '@transifex/native';

// app/fr/therapy-support/page.tsx
import PageView from "@/templates/TherapySupportPage";

import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("fr"); // keep fr here
  const t = makeT(messages);

  return (
    <PageView
      title={t('fr.body.text.therapy_support_ai_2eea', 'Therapy Support AI')}
      introText={t(
        'fr.body.text.hello_i_m_therapy_support_ai_feel_free_04a4',
        '🧠 Hello! I\'m your Therapy Support AI. Feel free to describe your case, specific symptoms, or ask for therapeutic strategies.'
      )}
      noticeTextPrefix={t('fr.body.text.ai_functionality_14a5', '🚧 The AI functionality for ')}
      featureName={t('fr.body.text.therapy_support_c50a', 'Therapy Support')}
      noticeTextSuffix={t(
        'fr.body.text.currently_under_development_will_soon_available_specialized_models_1b7a',
        ' is currently under development. It will soon be available with specialized models for therapy planning, reflection, and evidence‑based suggestions.'
      )}
      contactCta={t(
        'fr.body.text.want_support_mentalhealthgpt_or_learn_more_email_7924',
        'Want to support mentalhealthGPT or learn more? Email'
      )}
      contactEmail="hello@aidx.ch"
    />
  );
}

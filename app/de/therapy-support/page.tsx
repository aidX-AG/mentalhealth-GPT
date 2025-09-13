import { t } from '@transifex/native';
import PageView from "@/templates/TherapySupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);

  return (
    <PageView
      title={t('de.body.text.therapy_support_ai_2f94', 'Therapy Support AI')}
      introText={t(
        'de.body.text.hello_i_m_therapy_support_ai_feel_free_5f9b',
        '🧠 Hello! I\'m your Therapy Support AI. Feel free to describe your case, the specific symptoms, or ask for therapeutic strategies.'
      )}
      noticeTextPrefix={t('de.body.text.ai_functionality_f9c1', '🚧 The AI functionality for ')}
      featureName={t('de.body.text.therapy_support_4302', 'Therapy Support')}
      noticeTextSuffix={t(
        'de.body.text.currently_under_development_will_soon_become_available_as_f4ba',
        ' is currently under development. It will soon become available as we integrate specialized models to support therapy planning, reflection, and evidence-based suggestions.'
      )}
      contactCta={t(
        'de.body.text.want_support_mentalhealthgpt_or_learn_more_email_b573',
        'Want to support mentalhealthGPT or learn more? Email'
      )}
      contactEmail="hello@aidx.ch"
    />
  );
}

import { t } from '@transifex/native';
import PageView from "@/templates/DiagnosisSupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));
  return (
    <PageView
      title={t('de.body.text.diagnosis_support_e69c', 'Diagnosis Support')}
      questionDocument={t("diagnosis-case.pdf")}
      questionContent={t(
        'de.body.text.please_review_clinical_case_suggest_possible_diagnoses_highlight_d317',
        'Please review this clinical case and suggest possible diagnoses. Highlight any important symptoms or behavioral patterns.'
      )}
      questionTime={t('de.body.text.just_now_95ac', 'Just now')}
      noticeTextPrefix={t('de.body.text.ai_functionality_e884', '🚧 The AI functionality for ')}
      featureName={t('de.body.text.diagnosis_support_659d', 'Diagnosis Support')}
      noticeTextSuffix={t(
        'de.body.text.currently_under_development_will_gradually_become_available_as_b190',
        ' is currently under development. It will gradually become available as we integrate specialized models to support mental health diagnostics.'
      )}
    />
  );
}

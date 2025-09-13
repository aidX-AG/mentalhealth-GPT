import { t } from '@transifex/native';
import PageView from "@/templates/DiagnosisSupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));
  return (
    <PageView
      title={t('fr.body.text.diagnosis_support_d58a', 'Diagnosis Support')}
      questionDocument={t("diagnosis-case.pdf")}
      questionContent={t(
        'fr.body.text.please_review_clinical_case_suggest_possible_diagnoses_highlight_678a',
        'Please review this clinical case and suggest possible diagnoses. Highlight any important symptoms or behavioral patterns.'
      )}
      questionTime={t('fr.body.text.just_now_f907', 'Just now')}
      noticeTextPrefix={t('fr.body.text.ai_functionality_6885', '🚧 The AI functionality for ')}
      featureName={t('fr.body.text.diagnosis_support_9189', 'Diagnosis Support')}
      noticeTextSuffix={t(
        'fr.body.text.currently_under_development_will_gradually_become_available_as_522f',
        ' is currently under development. It will gradually become available as we integrate specialized models to support mental health diagnostics.'
      )}
    />
  );
}

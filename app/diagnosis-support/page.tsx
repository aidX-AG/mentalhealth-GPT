import { t } from '@transifex/native';
import PageView from "@/templates/DiagnosisSupportPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en"));
  return (
    <PageView
      title={t('diagnosis_support.body.text.diagnosis_support_6645', 'Diagnosis Support')}
      questionDocument={t("diagnosis-case.pdf")}
      questionContent={t(
        'diagnosis_support.body.text.please_review_clinical_case_suggest_possible_diagnoses_highlight_f450',
        'Please review this clinical case and suggest possible diagnoses. Highlight any important symptoms or behavioral patterns.'
      )}
      questionTime={t('diagnosis_support.body.text.just_now_58c7', 'Just now')}
      noticeTextPrefix={t(
        'diagnosis_support.body.text.ai_functionality_c9c1',
        '🚧 The AI functionality for '
      )}
      featureName={t('diagnosis_support.body.text.diagnosis_support_d6da', 'Diagnosis Support')}
      noticeTextSuffix={t(
        'diagnosis_support.body.text.currently_under_development_will_gradually_become_available_as_293c',
        ' is currently under development. It will gradually become available as we integrate specialized models to support mental health diagnostics.'
      )}
    />
  );
}

import { t } from '@transifex/native';
import PageView from "@/templates/SupervisionTrainingPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);

  return (
    <PageView
      chatTitle={t('de.body.text.supervision_training_7cce', 'Supervision & Training')}
      questionContent={t(
        'de.body.text.please_review_supervision_case_provide_constructive_feedback_trainee_e7d0',
        'Please review this supervision case and provide constructive feedback for the trainee. Focus on communication, assessment quality, and risk handling.'
      )}
      answerContent={t(
        'de.body.text.ai_model_supervision_training_currently_being_developed_specialized_12aa',
        '🚧 The AI model for Supervision & Training is currently being developed with specialized training data. It will be available soon to support expert feedback and mentoring workflows.'
      )}
    />
  );
}

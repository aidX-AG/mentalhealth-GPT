import { t } from '@transifex/native';
import PageView from "@/templates/AudioTranscriptionPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));
  return (
    <PageView
      title={t(
        'fr.body.text.audio_transcription_notes_f08a',
        'Audio Transcription & Notes'
      )}
      helloLabel={t('fr.body.text.hello_4282', 'Hello 🙂')}
      helloTimeLabel={t('fr.body.text.just_now_daa7', 'Just now')}
      demoRequestLabel={t('fr.body.text.show_me_what_you_can_do_f1d8', 'Show me what you can do')}
      demoRequestTimeLabel={t('fr.body.text.just_now_00a7', 'Just now')}
      a1Part1={t(
        'fr.body.text.ai_can_securely_transcribe_audio_recordings_from_therapy_9b4e',
        'Our AI can securely transcribe audio recordings from therapy sessions, structure the content, and generate clear, professional summaries — all with end-to-end encryption.'
      )}
      a1Part2={t(
        'fr.body.text.simply_upload_recorded_session_all_patient_information_remains_4446',
        'Simply upload a recorded session. All patient information remains strictly confidential and is protected by strong encryption directly in your browser, during transfer, and back again — ensuring full privacy at every step.'
      )}
      noticeTextPrefix={t('fr.body.text.ai_model_3901', '🚧 The AI model for ')}
      featureName={t(
        'fr.body.text.audio_transcription_notes_19d7',
        'Audio Transcription & Notes'
      )}
      noticeTextSuffix={t(
        'fr.body.text.currently_under_development_will_soon_provide_accurate_transcription_1fa3',
        ' is currently under development. It will soon provide accurate transcription and note-taking support for clinical documentation.'
      )}
    />
  );
}

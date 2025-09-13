import { t } from '@transifex/native';
import PageView from "@/templates/AudioTranscriptionPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));
  return (
    <PageView
      title={t(
        'de.body.text.audio_transcription_notes_843f',
        'Audio Transcription & Notes'
      )}
      helloLabel={t('de.body.text.hello_0960', 'Hello 🙂')}
      helloTimeLabel={t('de.body.text.just_now_edbd', 'Just now')}
      demoRequestLabel={t('de.body.text.show_me_what_you_can_do_1ef4', 'Show me what you can do')}
      demoRequestTimeLabel={t('de.body.text.just_now_08a9', 'Just now')}
      a1Part1={t(
        'de.body.text.ai_can_securely_transcribe_audio_recordings_from_therapy_83b2',
        'Our AI can securely transcribe audio recordings from therapy sessions, structure the content, and generate clear, professional summaries — all with end-to-end encryption.'
      )}
      a1Part2={t(
        'de.body.text.simply_upload_recorded_session_all_patient_information_remains_9509',
        'Simply upload a recorded session. All patient information remains strictly confidential and is protected by strong encryption directly in your browser, during transfer, and back again — ensuring full privacy at every step.'
      )}
      noticeTextPrefix={t('de.body.text.ai_model_e470', '🚧 The AI model for ')}
      featureName={t(
        'de.body.text.audio_transcription_notes_8299',
        'Audio Transcription & Notes'
      )}
      noticeTextSuffix={t(
        'de.body.text.currently_under_development_will_soon_provide_accurate_transcription_c5d2',
        ' is currently under development. It will soon provide accurate transcription and note-taking support for clinical documentation.'
      )}
    />
  );
}

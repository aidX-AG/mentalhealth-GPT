import { t } from '@transifex/native';
import PageView from "@/templates/VideoAnalysisPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("de");
  const t = makeT(messages);

  return (
    <PageView
      title={t('de.body.text.video_analysis_abaa', 'Video Analysis')}
      greetQuestion={t('de.body.text.hi_there_6efd', 'Hi there 👋')}
      greetTime={t('de.body.text.just_now_88b4', 'Just now')}
      greetAnswer={t(
        'de.body.text.hello_how_can_i_assist_you_video_analysis_a685',
        'Hello! How can I assist you with video analysis today?'
      )}
      bodyIntro={t(
        'de.body.text.ai_powered_video_analysis_coming_soon_will_help_ae9b',
        'Our AI-powered video analysis is coming soon. It will help analyze therapy session recordings, detect key themes, nonverbal cues, and therapeutic dynamics — all with full end-to-end security.'
      )}
      bodySecurity={t(
        'de.body.text.video_data_protected_every_step_browser_during_upload_408c',
        'Your video data is protected at every step: in your browser, during upload, and throughout the AI-based processing.'
      )}
      bodyStatus={t(
        'de.body.text.feature_currently_development_stay_tuned_a434',
        'This feature is currently in development — stay tuned!'
      )}
      noticeTitle={t('de.body.text.video_analysis_59f9', '🚧 Video Analysis')}
      noticeBody={t(
        'de.body.text.powerful_feature_will_provide_secure_ai_generated_insights_5853',
        'is a powerful feature that will provide secure, AI-generated insights into therapeutic sessions. We’re excited to launch this soon — enabling deeper reflection, supervision, and professional growth.'
      )}
    />
  );
}

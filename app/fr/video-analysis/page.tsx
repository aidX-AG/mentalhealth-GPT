import { t } from '@transifex/native';
import PageView from "@/templates/VideoAnalysisPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("fr");
  const t = makeT(messages);

  return (
    <PageView
      title={t('fr.body.text.video_analysis_6679', 'Video Analysis')}
      greetQuestion={t('fr.body.text.hi_there_ad67', 'Hi there 👋')}
      greetTime={t('fr.body.text.just_now_254d', 'Just now')}
      greetAnswer={t(
        'fr.body.text.hello_how_can_i_assist_you_video_analysis_c24d',
        'Hello! How can I assist you with video analysis today?'
      )}
      bodyIntro={t(
        'fr.body.text.ai_powered_video_analysis_coming_soon_will_help_bbf3',
        'Our AI-powered video analysis is coming soon. It will help analyze therapy session recordings, detect key themes, nonverbal cues, and therapeutic dynamics — all with full end-to-end security.'
      )}
      bodySecurity={t(
        'fr.body.text.video_data_protected_every_step_browser_during_upload_1f4b',
        'Your video data is protected at every step: in your browser, during upload, and throughout the AI-based processing.'
      )}
      bodyStatus={t(
        'fr.body.text.feature_currently_development_stay_tuned_7f1a',
        'This feature is currently in development — stay tuned!'
      )}
      noticeTitle={t('fr.body.text.video_analysis_e72d', '🚧 Video Analysis')}
      noticeBody={t(
        'fr.body.text.powerful_feature_will_provide_secure_ai_generated_insights_b62a',
        'is a powerful feature that will provide secure, AI-generated insights into therapeutic sessions. We’re excited to launch this soon — enabling deeper reflection, supervision, and professional growth.'
      )}
    />
  );
}

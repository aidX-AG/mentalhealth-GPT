import { t } from '@transifex/native';
import PageView from "@/templates/VideoAnalysisPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages("en");
  const t = makeT(messages);

  return (
    <PageView
      title={t('video_analysis.body.text.video_analysis_5519', 'Video Analysis')}
      greetQuestion={t('video_analysis.body.text.hi_there_f854', 'Hi there 👋')}
      greetTime={t('video_analysis.body.text.just_now_210a', 'Just now')}
      greetAnswer={t(
        'video_analysis.body.text.hello_how_can_i_assist_you_video_analysis_e52b',
        'Hello! How can I assist you with video analysis today?'
      )}
      bodyIntro={t(
        'video_analysis.body.text.ai_powered_video_analysis_coming_soon_will_help_258f',
        'Our AI-powered video analysis is coming soon. It will help analyze therapy session recordings, detect key themes, nonverbal cues, and therapeutic dynamics — all with full end-to-end security.'
      )}
      bodySecurity={t(
        'video_analysis.body.text.video_data_protected_every_step_browser_during_upload_a0f5',
        'Your video data is protected at every step: in your browser, during upload, and throughout the AI-based processing.'
      )}
      bodyStatus={t(
        'video_analysis.body.text.feature_currently_development_stay_tuned_812f',
        'This feature is currently in development — stay tuned!'
      )}
      noticeTitle={t('video_analysis.body.text.video_analysis_32bb', '🚧 Video Analysis')}
      noticeBody={t(
        'video_analysis.body.text.powerful_feature_will_provide_secure_ai_generated_insights_81aa',
        'is a powerful feature that will provide secure, AI-generated insights into therapeutic sessions. We’re excited to launch this soon — enabling deeper reflection, supervision, and professional growth.'
      )}
    />
  );
}

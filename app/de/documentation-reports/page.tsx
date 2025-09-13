import { t } from '@transifex/native';
import PageView from "@/templates/DocumentationReportsPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("de"));
  return (
    <PageView
      title={t('de.body.text.documentation_reporting_ed12', 'Documentation & Reporting')}
      greetQuestion={t('de.body.text.hi_there_f46a', 'Hi there 👋')}
      greetTime={t('de.body.text.just_now_857f', 'Just now')}
      greetAnswer={t(
        'de.body.text.hello_how_can_i_assist_you_documentation_reporting_3810',
        'Hello! How can I assist you with documentation and reporting today?'
      )}
      bodyIntro={t(
        'de.body.text.soon_you_ll_able_generate_professional_documentation_reports_6ba0',
        'Soon you’ll be able to generate professional documentation and reports — whether for clinical use, insurance submissions, or personal records of therapy and supervision sessions.'
      )}
      bodyTransform={t(
        'de.body.text.ai_will_help_you_transform_transcripts_into_clear_ac13',
        'Our AI will help you transform transcripts into clear, structured, and confidential reports — automatically.'
      )}
      bodySecurity={t(
        'de.body.text.all_data_processed_end_end_encryption_protect_patient_074c',
        'All data is processed with end-to-end encryption to protect patient confidentiality and ensure secure handling at every stage.'
      )}
      noticeTitle={t(
        'de.body.text.documentation_reporting_998d',
        '🚧 Documentation & Reporting'
      )}
      noticeBody={t(
        'de.body.text.exciting_new_feature_currently_development_we_re_building_6287',
        'is an exciting new feature currently in development. We’re building it to save you time, reduce admin load, and enhance the quality of your documentation — stay tuned!'
      )}
    />
  );
}

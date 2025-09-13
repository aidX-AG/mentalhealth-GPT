import { t } from '@transifex/native';
import PageView from "@/templates/DocumentationReportsPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("en"));
  return (
    <PageView
      title={t(
        'documentation_reports.body.text.documentation_reporting_9027',
        'Documentation & Reporting'
      )}
      greetQuestion={t('documentation_reports.body.text.hi_there_178f', 'Hi there 👋')}
      greetTime={t('documentation_reports.body.text.just_now_7dab', 'Just now')}
      greetAnswer={t(
        'documentation_reports.body.text.hello_how_can_i_assist_you_documentation_reporting_4b4e',
        'Hello! How can I assist you with documentation and reporting today?'
      )}
      bodyIntro={t(
        'documentation_reports.body.text.soon_you_ll_able_generate_professional_documentation_reports_6117',
        'Soon you’ll be able to generate professional documentation and reports — whether for clinical use, insurance submissions, or personal records of therapy and supervision sessions.'
      )}
      bodyTransform={t(
        'documentation_reports.body.text.ai_will_help_you_transform_transcripts_into_clear_8b28',
        'Our AI will help you transform transcripts into clear, structured, and confidential reports — automatically.'
      )}
      bodySecurity={t(
        'documentation_reports.body.text.all_data_processed_end_end_encryption_protect_patient_ba8a',
        'All data is processed with end-to-end encryption to protect patient confidentiality and ensure secure handling at every stage.'
      )}
      noticeTitle={t(
        'documentation_reports.body.text.documentation_reporting_30b0',
        '🚧 Documentation & Reporting'
      )}
      noticeBody={t(
        'documentation_reports.body.text.exciting_new_feature_currently_development_we_re_building_678e',
        'is an exciting new feature currently in development. We’re building it to save you time, reduce admin load, and enhance the quality of your documentation — stay tuned!'
      )}
    />
  );
}

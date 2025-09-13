import { t } from '@transifex/native';
import PageView from "@/templates/DocumentationReportsPage";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const t = makeT(loadMessages("fr"));
  return (
    <PageView
      title={t('fr.body.text.documentation_reporting_abe2', 'Documentation & Reporting')}
      greetQuestion={t('fr.body.text.hi_there_61c2', 'Hi there 👋')}
      greetTime={t('fr.body.text.just_now_98e5', 'Just now')}
      greetAnswer={t(
        'fr.body.text.hello_how_can_i_assist_you_documentation_reporting_96c8',
        'Hello! How can I assist you with documentation and reporting today?'
      )}
      bodyIntro={t(
        'fr.body.text.soon_you_ll_able_generate_professional_documentation_reports_0ab9',
        'Soon you’ll be able to generate professional documentation and reports — whether for clinical use, insurance submissions, or personal records of therapy and supervision sessions.'
      )}
      bodyTransform={t(
        'fr.body.text.ai_will_help_you_transform_transcripts_into_clear_ca11',
        'Our AI will help you transform transcripts into clear, structured, and confidential reports — automatically.'
      )}
      bodySecurity={t(
        'fr.body.text.all_data_processed_end_end_encryption_protect_patient_8962',
        'All data is processed with end-to-end encryption to protect patient confidentiality and ensure secure handling at every stage.'
      )}
      noticeTitle={t(
        'fr.body.text.documentation_reporting_4d7b',
        '🚧 Documentation & Reporting'
      )}
      noticeBody={t(
        'fr.body.text.exciting_new_feature_currently_development_we_re_building_0ee1',
        'is an exciting new feature currently in development. We’re building it to save you time, reduce admin load, and enhance the quality of your documentation — stay tuned!'
      )}
    />
  );
}

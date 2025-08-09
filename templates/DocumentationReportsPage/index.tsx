"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import i18next from "i18next";

const DocumentationReportsPage = () => {
    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title={i18next.t("documentation-reports.chattitle_documentation_reporting_16", { defaultValue: "Documentation & Reporting" })}>
                <Question content="Hi there 👋" time="Just now" />
                <Answer>{i18next.t("documentation-reports.chat_hello_how_can_i_assist_01", { defaultValue: "Hello! How can I assist you with documentation and reporting today?" })}</Answer>
                <Answer time="Just now">
                    <p className="text-base leading-relaxed">
                        {i18next.t("documentation-reports.answer_soon_youll_be_able_to_02", { defaultValue: "Soon you’ll be able to generate" })}<strong>{i18next.t("documentation-reports.p_professional_documentation_and_reports_03", { defaultValue: "professional documentation and reports" })}</strong> {i18next.t("documentation-reports.answer_whether_for_clinical_use_04", { defaultValue: "— whether for clinical use, insurance submissions, or personal records of therapy and supervision sessions." })}<br />
                        {i18next.t("documentation-reports.answer_our_ai_will_help_you_05", { defaultValue: "Our AI will help you transform transcripts into" })}<strong>{i18next.t("documentation-reports.p_clear_structured_and_confidential_06", { defaultValue: "clear, structured, and confidential" })}</strong> {i18next.t("documentation-reports.answer_reports_automatically_07", { defaultValue: "reports — automatically." })}<br />
                        {i18next.t("documentation-reports.answer_all_data_is_processed_with_08", { defaultValue: "All data is processed with" })}<strong>{i18next.t("documentation-reports.p_endtoend_encryption_09", { defaultValue: "end-to-end encryption" })}</strong> {i18next.t("documentation-reports.answer_to_protect_patient_confidentiality_and_10", { defaultValue: "to protect patient confidentiality and ensure secure handling at every stage." })}</p>
                </Answer>
                <Answer time="Just now">
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            {i18next.t("documentation-reports.div_text_11", { defaultValue: "🚧" })}<strong>{i18next.t("documentation-reports.p_documentation_reporting_12", { defaultValue: "Documentation & Reporting" })}</strong> {i18next.t("documentation-reports.div_is_an_exciting_new_feature_13", { defaultValue: "is an exciting new feature that’s currently in development." })}<br />
                            {i18next.t("documentation-reports.div_were_building_it_to_save_14", { defaultValue: "We’re building it to save you time, reduce admin load, and enhance the quality of your documentation —" })}<strong>{i18next.t("documentation-reports.p_stay_tuned_15", { defaultValue: "stay tuned!" })}</strong>
                        </p>
                    </div>
                </Answer>
            </Chat>
            <Message
                value={message}
                onChange={(e: any) => setMessage(e.target.value)}
            />
        </Layout>
    );
};

export default DocumentationReportsPage;

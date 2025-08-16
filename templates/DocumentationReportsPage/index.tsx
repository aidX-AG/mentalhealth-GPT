"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import i18next from "i18next";

const DocumentationReportsPage = () => {
  const { t: tDocumentation-reports } = useTranslation("documentation-reports");

    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title={tDocumentation-reports("chat.title", { defaultValue: "Documentation & Reporting" })}>
                <Question content="Hi there 👋" time="Just now" />
                <Answer>{tDocumentation-reports("chat.greeting", { defaultValue: "Hello! How can I assist you with documentation and reporting today?" })}</Answer>
                <Answer time="Just now">
                    <p className="text-base leading-relaxed">
                        {tDocumentation-reports("text.coming-capability", { defaultValue: "Soon you’ll be able to generate" })}<strong>{tDocumentation-reports("text.professional-docs", { defaultValue: "professional documentation and reports" })}</strong> {tDocumentation-reports("text.use-cases", { defaultValue: "— whether for clinical use, insurance submissions, or personal records of therapy and supervision sessions." })}<br />
                        {tDocumentation-reports("text.ai-helps-transform", { defaultValue: "Our AI will help you transform transcripts into" })}<strong>{tDocumentation-reports("text.clear-structured-confidential", { defaultValue: "clear, structured, and confidential" })}</strong> {tDocumentation-reports("text.reports-automatically", { defaultValue: "reports — automatically." })}<br />
                        {tDocumentation-reports("text.data-processed-with", { defaultValue: "All data is processed with" })}<strong>{tDocumentation-reports("text.end-to-end-encryption", { defaultValue: "end-to-end encryption" })}</strong> {tDocumentation-reports("text.privacy-protection", { defaultValue: "to protect patient confidentiality and ensure secure handling at every stage." })}</p>
                </Answer>
                <Answer time="Just now">
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            {tDocumentation-reports("sections.icon", { defaultValue: "🚧" })}<strong>{tDocumentation-reports("sections.title", { defaultValue: "Documentation & Reporting" })}</strong> {tDocumentation-reports("sections.in-development", { defaultValue: "is an exciting new feature that’s currently in development." })}<br />
                            {tDocumentation-reports("text.value-prop", { defaultValue: "We’re building it to save you time, reduce admin load, and enhance the quality of your documentation —" })}<strong>{tDocumentation-reports("text.stay-tuned", { defaultValue: "stay tuned!" })}</strong>
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

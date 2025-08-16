"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import i18next from "i18next";

const DiagnosisSupportPage = () => {
  const { t: tDiagnosis-support } = useTranslation("diagnosis-support");

    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title={tDiagnosis-support("chat.title", { defaultValue: "Diagnosis Support" })}>
                <Question
                    document="diagnosis-case.pdf"
                    content="Please review this clinical case and suggest possible diagnoses. Highlight any important symptoms or behavioral patterns."
                    time="Just now"
                />
                <Answer>
                    <div className="mt-6 p-6 bg-green-100 border-l-4 border-green-500 text-green-900 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            {tDiagnosis-support("sections.banner-prefix", { defaultValue: "🚧 The AI functionality for" })}<strong>{tDiagnosis-support("sections.title", { defaultValue: "Diagnosis Support" })}</strong> {tDiagnosis-support("sections.under-development", { defaultValue: "is currently under development." })}<br />
                            {tDiagnosis-support("sections.coming-soon", { defaultValue: "It will gradually become available as we integrate specialized models to support mental health diagnostics." })}</p>
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

export default DiagnosisSupportPage;

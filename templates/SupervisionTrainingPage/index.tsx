"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import Message from "@/components/Message";
import i18next from "i18next";

const SupervisionTrainingPage = () => {
    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title={i18next.t("supervision-training.chattitle_supervision_training_05", { defaultValue: "Supervision & Training" })}>
                <Question
                    document="session-case.pdf"
                    content="Please review this supervision case and provide constructive feedback for the trainee. Focus on communication, assessment quality, and risk handling."
                    time="Just now"
                />

                <Answer>
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            {i18next.t("supervision-training.div_the_ai_model_for_01", { defaultValue: "🚧 The AI model for" })}<strong>{i18next.t("supervision-training.p_supervision_training_02", { defaultValue: "Supervision & Training" })}</strong> {i18next.t("supervision-training.div_is_currently_being_developed_with_03", { defaultValue: "is currently being developed with specialized training data." })}<br />
                            {i18next.t("supervision-training.div_it_will_be_available_soon_04", { defaultValue: "It will be available soon to support expert feedback and mentoring workflows." })}</p>
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

export default SupervisionTrainingPage;

"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";

const DiagnosisSupportPage = () => {
    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title="Diagnosis Support">
                <Question
                    document="diagnosis-case.pdf"
                    content="Please review this clinical case and suggest possible diagnoses. Highlight any important symptoms or behavioral patterns."
                    time="Just now"
                />
                <Answer>
                    <div className="mt-6 p-6 bg-green-100 border-l-4 border-green-500 text-green-900 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            🚧 The AI functionality for <strong>Diagnosis Support</strong> is currently under development. <br />
                            It will gradually become available as we integrate specialized models to support mental health diagnostics.
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

export default DiagnosisSupportPage;

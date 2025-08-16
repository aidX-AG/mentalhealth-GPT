"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";

const DocumentationReportsPage = () => {
    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title="Documentation & Reporting">
                <Question content="Hi there 👋" time="Just now" />
                <Answer>Hello! How can I assist you with documentation and reporting today?</Answer>
                <Answer time="Just now">
                    <p className="text-base leading-relaxed">
                        Soon you’ll be able to generate <strong>professional documentation and reports</strong> — whether for clinical use, insurance submissions, or personal records of therapy and supervision sessions.
                        <br />
                        Our AI will help you transform transcripts into <strong>clear, structured, and confidential</strong> reports — automatically.
                        <br />
                        All data is processed with <strong>end-to-end encryption</strong> to protect patient confidentiality and ensure secure handling at every stage.
                    </p>
                </Answer>
                <Answer time="Just now">
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            🚧 <strong>Documentation & Reporting</strong> is an exciting new feature that’s currently in development. <br />
                            We’re building it to save you time, reduce admin load, and enhance the quality of your documentation — <strong>stay tuned!</strong>
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

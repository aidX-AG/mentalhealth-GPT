"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";

const AudioTranscriptionPage = () => {
    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title="Audio Transcription & Notes">
                <Question content="Hello 🙂" time="Just now" />
                <Answer>Hello! How can I assist you with audio transcription today?</Answer>

                <Question content="Show me what you can do" time="Just now" />

                <Answer time="Just now">
                    <p className="text-base leading-relaxed">
                        Our AI can securely transcribe audio recordings from therapy sessions, structure the content,
                        and generate clear, professional summaries — all with end-to-end encryption.
                        <br />
                        Simply upload a recorded session. All patient information remains strictly confidential and is protected 
                        by strong encryption directly in your browser, during transfer, and back again — ensuring full privacy at every step.
                    </p>
                </Answer>

                <Answer time="Just now">
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            🚧 The AI model for <strong>Audio Transcription & Notes</strong> is currently under development. <br />
                            It will soon provide accurate transcription and note-taking support for clinical documentation.
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

export default AudioTranscriptionPage;

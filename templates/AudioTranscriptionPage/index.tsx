"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import i18next from "i18next";

const AudioTranscriptionPage = () => {
  const { t: tAudio-transcription } = useTranslation("audio-transcription");

    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title={tAudio-transcription("chat.title", { defaultValue: "Audio Transcription & Notes" })}>
                <Question content="Hello 🙂" time="Just now" />
                <Answer>{tAudio-transcription("chat.greeting", { defaultValue: "Hello! How can I assist you with audio transcription today?" })}</Answer>

                <Question content="Show me what you can do" time="Just now" />

                <Answer time="Just now">
                    <p className="text-base leading-relaxed">
                        {tAudio-transcription("text.capability", { defaultValue: "Our AI can securely transcribe audio recordings from therapy sessions, structure the content, and generate clear, professional summaries — all with end-to-end encryption." })}<br />
                        {tAudio-transcription("text.upload-instructions", { defaultValue: "Simply upload a recorded session. All patient information remains strictly confidential and is protected by strong encryption directly in your browser, during transfer, and back again — ensuring full privacy at every step." })}</p>
                </Answer>

                <Answer time="Just now">
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            {tAudio-transcription("sections.banner-prefix", { defaultValue: "🚧 The AI model for" })}<strong>{tAudio-transcription("sections.title", { defaultValue: "Audio Transcription & Notes" })}</strong> {tAudio-transcription("sections.under-development", { defaultValue: "is currently under development." })}<br />
                            {tAudio-transcription("sections.coming-soon", { defaultValue: "It will soon provide accurate transcription and note-taking support for clinical documentation." })}</p>
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

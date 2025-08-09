"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import i18next from "i18next";

const AudioTranscriptionPage = () => {
    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title={i18next.t("audio-transcription.chattitle_audio_transcription_notes_08", { defaultValue: "Audio Transcription & Notes" })}>
                <Question content="Hello 🙂" time="Just now" />
                <Answer>{i18next.t("audio-transcription.chat_hello_how_can_i_assist_01", { defaultValue: "Hello! How can I assist you with audio transcription today?" })}</Answer>

                <Question content="Show me what you can do" time="Just now" />

                <Answer time="Just now">
                    <p className="text-base leading-relaxed">
                        {i18next.t("audio-transcription.answer_our_ai_can_securely_transcribe_02", { defaultValue: "Our AI can securely transcribe audio recordings from therapy sessions, structure the content, and generate clear, professional summaries — all with end-to-end encryption." })}<br />
                        {i18next.t("audio-transcription.answer_simply_upload_a_recorded_session_03", { defaultValue: "Simply upload a recorded session. All patient information remains strictly confidential and is protected by strong encryption directly in your browser, during transfer, and back again — ensuring full privacy at every step." })}</p>
                </Answer>

                <Answer time="Just now">
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            {i18next.t("audio-transcription.div_the_ai_model_for_04", { defaultValue: "🚧 The AI model for" })}<strong>{i18next.t("audio-transcription.p_audio_transcription_notes_05", { defaultValue: "Audio Transcription & Notes" })}</strong> {i18next.t("audio-transcription.div_is_currently_under_development_06", { defaultValue: "is currently under development." })}<br />
                            {i18next.t("audio-transcription.div_it_will_soon_provide_accurate_07", { defaultValue: "It will soon provide accurate transcription and note-taking support for clinical documentation." })}</p>
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

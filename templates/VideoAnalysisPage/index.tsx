"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import i18next from "i18next";

const VideoAnalysisPage = () => {
  const { t: tVideo-analysis } = useTranslation("video-analysis");

    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title={tVideo-analysis("chat.title", { defaultValue: "Video Analysis" })}>
                <Question content="Hi there 👋" time="Just now" />
                <Answer>{tVideo-analysis("chat.greeting", { defaultValue: "Hello! How can I assist you with video analysis today?" })}</Answer>

                <Answer time="Just now">
                    <p className="text-base leading-relaxed">
                        {tVideo-analysis("text.coming-soon", { defaultValue: "Our AI-powered video analysis is coming soon." })}<strong>{tVideo-analysis("text.value-prop-part1", { defaultValue: "It will help analyze therapy session recordings" })}</strong>{tVideo-analysis("text.value-prop-part2", { defaultValue: ", detect key themes, nonverbal cues, and therapeutic dynamics — all with full end-to-end security." })}<br />
                        {tVideo-analysis("text.security", { defaultValue: "Your video data is protected at every step: in your browser, during upload, and throughout the AI-based processing." })}<br />
                        {tVideo-analysis("text.in-development", { defaultValue: "This feature is currently in development —" })}<strong>{tVideo-analysis("text.stay-tuned", { defaultValue: "stay tuned!" })}</strong>
                    </p>
                </Answer>

                <Answer time="Just now">
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            {tVideo-analysis("sections.icon", { defaultValue: "🚧" })}<strong>{tVideo-analysis("sections.title", { defaultValue: "Video Analysis" })}</strong> {tVideo-analysis("text.feature-benefit", { defaultValue: "is a powerful feature that will provide secure, AI-generated insights into therapeutic sessions." })}<br />
                            {tVideo-analysis("text.launch-excitement", { defaultValue: "We’re excited to launch this soon — enabling deeper reflection, supervision, and professional growth." })}</p>
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

export default VideoAnalysisPage;

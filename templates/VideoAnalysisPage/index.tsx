"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import i18next from "i18next";

const VideoAnalysisPage = () => {
    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title={i18next.t("video-analysis.chattitle_video_analysis_12", { defaultValue: "Video Analysis" })}>
                <Question content="Hi there 👋" time="Just now" />
                <Answer>{i18next.t("video-analysis.chat_hello_how_can_i_assist_01", { defaultValue: "Hello! How can I assist you with video analysis today?" })}</Answer>

                <Answer time="Just now">
                    <p className="text-base leading-relaxed">
                        {i18next.t("video-analysis.answer_our_aipowered_video_analysis_is_02", { defaultValue: "Our AI-powered video analysis is coming soon." })}<strong>{i18next.t("video-analysis.p_it_will_help_analyze_therapy_03", { defaultValue: "It will help analyze therapy session recordings" })}</strong>{i18next.t("video-analysis.answer_detect_key_themes_nonverbal_04", { defaultValue: ", detect key themes, nonverbal cues, and therapeutic dynamics — all with full end-to-end security." })}<br />
                        {i18next.t("video-analysis.answer_your_video_data_is_protected_05", { defaultValue: "Your video data is protected at every step: in your browser, during upload, and throughout the AI-based processing." })}<br />
                        {i18next.t("video-analysis.answer_this_feature_is_currently_in_06", { defaultValue: "This feature is currently in development —" })}<strong>{i18next.t("video-analysis.p_stay_tuned_07", { defaultValue: "stay tuned!" })}</strong>
                    </p>
                </Answer>

                <Answer time="Just now">
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            {i18next.t("video-analysis.div_text_08", { defaultValue: "🚧" })}<strong>{i18next.t("video-analysis.p_video_analysis_09", { defaultValue: "Video Analysis" })}</strong> {i18next.t("video-analysis.div_is_a_powerful_feature_that_10", { defaultValue: "is a powerful feature that will provide secure, AI-generated insights into therapeutic sessions." })}<br />
                            {i18next.t("video-analysis.div_were_excited_to_launch_this_11", { defaultValue: "We’re excited to launch this soon — enabling deeper reflection, supervision, and professional growth." })}</p>
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

"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";

const VideoAnalysisPage = () => {
    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title="Video Analysis">
                <Question content="Hi there 👋" time="Just now" />
                <Answer>Hello! How can I assist you with video analysis today?</Answer>

                <Answer time="Just now">
                    <p className="text-base leading-relaxed">
                        Our AI-powered video analysis is coming soon. <strong>It will help analyze therapy session recordings</strong>, detect key themes, nonverbal cues, and therapeutic dynamics — all with full end-to-end security.
                        <br />
                        Your video data is protected at every step: in your browser, during upload, and throughout the AI-based processing.
                        <br />
                        This feature is currently in development — <strong>stay tuned!</strong>
                    </p>
                </Answer>

                <Answer time="Just now">
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            🚧 <strong>Video Analysis</strong> is a powerful feature that will provide secure, AI-generated insights into therapeutic sessions. <br />
                            We’re excited to launch this soon — enabling deeper reflection, supervision, and professional growth.
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

export default VideoAnalysisPage;

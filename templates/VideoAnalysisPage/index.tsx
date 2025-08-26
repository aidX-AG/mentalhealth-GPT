"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";

type Props = {
  title: string;
  greetQuestion: string;
  greetTime: string;
  greetAnswer: string;
  bodyIntro: string;
  bodySecurity: string;
  bodyStatus: string;
  noticeTitle: string; // e.g. "🚧 Video Analysis"
  noticeBody: string;
};

const VideoAnalysisPage = ({
  title,
  greetQuestion,
  greetTime,
  greetAnswer,
  bodyIntro,
  bodySecurity,
  bodyStatus,
  noticeTitle,
  noticeBody,
}: Props) => {
  const [message, setMessage] = useState<string>("");

  return (
    <Layout>
      <Chat title={title}>
        <Question content={greetQuestion} time={greetTime} />
        <Answer>{greetAnswer}</Answer>

        <Answer time={greetTime}>
          <p className="text-base leading-relaxed">
            {bodyIntro}
            <br />
            {bodySecurity}
            <br />
            {bodyStatus}
          </p>
        </Answer>

        <Answer time={greetTime}>
          <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
            <p className="text-lg leading-relaxed font-medium">
              <strong>{noticeTitle}</strong> {noticeBody}
            </p>
          </div>
        </Answer>
      </Chat>

      <Message value={message} onChange={(e: any) => setMessage(e.target.value)} />
    </Layout>
  );
};

export default VideoAnalysisPage;

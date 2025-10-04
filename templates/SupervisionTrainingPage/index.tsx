"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import Message from "@/components/Message";

type Props = {
  title: string;
  questionDocument: string;
  questionContent: string;
  questionTime: string;
  noticeTextPrefix: string; // "🚧 The AI model for "
  featureName: string;      // "Supervision & Training"
  noticeTextSuffix: string; // " is currently being developed ..."
};

const SupervisionTrainingPage = ({
  title,
  questionDocument,
  questionContent,
  questionTime,
  noticeTextPrefix,
  featureName,
  noticeTextSuffix,
}: Props) => {
  const [message, setMessage] = useState<string>("");

  return (
    <Layout>
      <Chat title={title}>
        <Question
          document={questionDocument}
          content={questionContent}
          time={questionTime}
        />

        <Answer>
          <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
            <p className="text-lg leading-relaxed font-medium">
              {noticeTextPrefix}
              <strong>{featureName}</strong>
              {noticeTextSuffix}
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

export default SupervisionTrainingPage;

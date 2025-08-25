"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";

type Props = {
  title: string;
  questionDocument: string;
  questionContent: string;
  questionTime: string;
  noticeTextPrefix: string; // "🚧 The AI functionality for "
  featureName: string;      // "Diagnosis Support"
  noticeTextSuffix: string; // " is currently under development. ..."
};

const DiagnosisSupportPage = ({
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
          <div className="mt-6 p-6 bg-green-100 border-l-4 border-green-500 text-green-900 rounded-lg shadow-md">
            <p className="text-lg leading-relaxed font-medium">
              {noticeTextPrefix}
              <strong>{featureName}</strong>
              {noticeTextSuffix}
            </p>
          </div>
        </Answer>
      </Chat>

      <Message value={message} onChange={(e: any) => setMessage(e.target.value)} />
    </Layout>
  );
};

export default DiagnosisSupportPage;

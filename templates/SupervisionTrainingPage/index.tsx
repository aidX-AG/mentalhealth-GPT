"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import Message from "@/components/Message";

type Props = {
  chatTitle: string;
  questionContent: string;
  answerContent: string;
};

const SupervisionTrainingPage = ({
  chatTitle,
  questionContent,
  answerContent,
}: Props) => {
  const [message, setMessage] = useState<string>("");

  return (
    <Layout>
      <Chat title={chatTitle}>
        <Question
          document="session-case.pdf"
          content={questionContent}
          time="Just now"
        />

        <Answer>
          <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
            <p className="text-lg leading-relaxed font-medium">
              {answerContent}
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

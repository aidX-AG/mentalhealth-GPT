"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";

type Props = {
  title: string;
  helloLabel: string;
  helloTimeLabel: string;
  demoRequestLabel: string;
  demoRequestTimeLabel: string;
  a1Part1: string;
  a1Part2: string;
  noticeTextPrefix: string;   // z.B. "🚧 The AI model for "
  featureName: string;        // z.B. "Audio Transcription & Notes"
  noticeTextSuffix: string;   // z.B. " is currently under development. It will soon …"
};

const AudioTranscriptionPage = ({
  title,
  helloLabel,
  helloTimeLabel,
  demoRequestLabel,
  demoRequestTimeLabel,
  a1Part1,
  a1Part2,
  noticeTextPrefix,
  featureName,
  noticeTextSuffix,
}: Props) => {
  const [message, setMessage] = useState<string>("");

  return (
    <Layout>
      <Chat title={title}>
        <Question content={helloLabel} time={helloTimeLabel} />
        <Answer>{/* kurze Antwort kann weggelassen/ergänzt werden */}</Answer>

        <Question content={demoRequestLabel} time={demoRequestTimeLabel} />

        <Answer time={demoRequestTimeLabel}>
          <p className="text-base leading-relaxed">
            {a1Part1}
            <br />
            {a1Part2}
          </p>
        </Answer>

        <Answer time={demoRequestTimeLabel}>
          <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
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

export default AudioTranscriptionPage;

"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Answer from "@/components/Answer";

type Props = {
  title: string;

  // kurzer Begrüßungstext (früher der Absatz mit 🧠 Hello!)
  introText: string;

  // Hinweis-Box (wie bei DiagnosisSupport)
  noticeTextPrefix: string; // z.B. "🚧 The AI functionality for "
  featureName: string;      // z.B. "Therapy Support"
  noticeTextSuffix: string; // z.B. " is currently under development. ..."

  // Optional: Call-to-action darunter
  contactCta?: string;      // z.B. "Want to support this feature or learn more? Email"
  contactEmail?: string;    // z.B. "hello@aidx.ch"
};

const TherapySupportPage = ({
  title,
  introText,
  noticeTextPrefix,
  featureName,
  noticeTextSuffix,
  contactCta,
  contactEmail,
}: Props) => {
  const [message, setMessage] = useState<string>("");

  return (
    <Layout>
      <Chat title={title}>
        {/* Intro-Antwort */}
        <Answer time="Just now">
          <div className="mt-6 p-4 bg-n-1 border border-n-3 rounded-xl dark:bg-n-7 dark:border-n-5">
            <p className="text-base leading-relaxed text-n-6 dark:text-n-3">
              {introText}
            </p>
          </div>
        </Answer>

        {/* Hinweis-Box */}
        <Answer>
          <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
            <p className="text-lg leading-relaxed font-medium">
              {noticeTextPrefix}
              <strong>{featureName}</strong>
              {noticeTextSuffix}
            </p>

            {contactCta && contactEmail && (
              <p className="mt-3">
                {contactCta}{" "}
                <a className="underline" href={`mailto:${contactEmail}`}>
                  {contactEmail}
                </a>
                .
              </p>
            )}
          </div>
        </Answer>
      </Chat>

      <Message value={message} onChange={(e: any) => setMessage(e.target.value)} />
    </Layout>
  );
};

export default TherapySupportPage;

"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import SocialsPost from "@/components/SocialsPost";
import SchedulePost from "@/components/SchedulePost";
import ScheduleResult from "@/components/ScheduleResult";

import { getSocialsPost } from "@/mocks/socialsPost";
import { useTranslation } from "@/lib/i18n/I18nContext";

type Props = {
  chatTitle: string;
  promptContent: string;
  promptTime: string;
};

const GenerationSocialsPostPage = ({
  chatTitle,
  promptContent,
  promptTime,
}: Props) => {
  const t = useTranslation();
  const socailsPost = getSocialsPost(t);

  const [message, setMessage] = useState<string>("");

  return (
    <Layout>
      <Chat title={chatTitle}>
        <Question content={promptContent} time={promptTime} />
        <Answer loading />
        <Answer time={promptTime}>
          <SocialsPost items={socailsPost} />
        </Answer>
        <Answer time={promptTime}>
          <SchedulePost />
        </Answer>
        <Answer time={promptTime}>
          <ScheduleResult />
        </Answer>
      </Chat>
      <Message value={message} onChange={(e: any) => setMessage(e.target.value)} />
    </Layout>
  );
};

export default GenerationSocialsPostPage;

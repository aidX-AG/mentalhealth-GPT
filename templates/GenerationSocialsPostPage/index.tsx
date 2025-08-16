"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import SocialsPost from "@/components/SocialsPost";
import SchedulePost from "@/components/SchedulePost";
import ScheduleResult from "@/components/ScheduleResult";

import { socailsPost } from "@/mocks/socialsPost";
import i18next from "i18next";

const GenerationSocialsPostPage = () => {
  const { t: tGeneration-socials-post } = useTranslation("generation-socials-post");

    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title={tGeneration-socials-post("chat.title", { defaultValue: "Promotional content" })}>
                <Question
                    content="Create promotional content for this post to share on social media with the link: https://dribbble.com/shots/17687623-Hiring-Platform-Mobile-App with link and hashtag for Twitter, Facebook"
                    time="Just now"
                />
                <Answer loading />
                <Answer time="Just now">
                    <SocialsPost items={socailsPost} />
                </Answer>
                <Answer time="Just now">
                    <SchedulePost />
                </Answer>
                <Answer time="Just now">
                    <ScheduleResult />
                </Answer>
            </Chat>
            <Message
                value={message}
                onChange={(e: any) => setMessage(e.target.value)}
            />
        </Layout>
    );
};

export default GenerationSocialsPostPage;

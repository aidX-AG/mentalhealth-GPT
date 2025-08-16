"use client";

import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Answer from "@/components/Answer";
import i18next from "i18next";

const TherapySupportPage = () => {
  const { t: tTherapy-support } = useTranslation("therapy-support");

    const [message, setMessage] = useState<string>("");

    return (
        <Layout>
            <Chat title={tTherapy-support("chat.title", { defaultValue: "Therapy Support AI" })}>
                <Answer time="Just now">
                    <div className="mt-6 p-4 bg-n-1 border border-n-3 rounded-xl dark:bg-n-7 dark:border-n-5">
                        <p className="text-base leading-relaxed text-n-6 dark:text-n-3">
                            {tTherapy-support("sections.greeting", { defaultValue: "🧠 Hello! I'm your Therapy Support AI." })}<br />
                            {tTherapy-support("sections.instructions", { defaultValue: "Feel free to describe your case, the specific symptoms, or ask for therapeutic strategies." })}</p>
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

export default TherapySupportPage;

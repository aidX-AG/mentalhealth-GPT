"use client";

import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Question from "@/components/Question";
import Answer from "@/components/Answer";

const SupervisionTrainingPage = () => {
    return (
        <Layout>
            <Chat title="Supervision & Training Session">
                <Question
                    document="session-case.pdf"
                    content="Please review this supervision case and provide constructive feedback for the trainee. Focus on communication, assessment quality, and risk handling."
                    time="Just now"
                />

                <Answer>
                    <div className="mt-6 p-6 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 rounded-lg shadow-md">
                        <p className="text-lg leading-relaxed font-medium">
                            🚧 The AI model for <strong>Supervision & Training</strong> is currently being developed with specialized training data. <br />
                            It will be available soon to support expert feedback and mentoring workflows.
                        </p>
                    </div>
                </Answer>
            </Chat>
        </Layout>
    );
};

export default SupervisionTrainingPage;


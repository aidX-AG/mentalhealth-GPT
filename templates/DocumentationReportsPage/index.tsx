"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import { useFileUploadFlow } from "@/hooks/useFileUploadFlow";
import ModalPIIReview from "@/components/ModalPIIReview";
import NERStatusBadge from "@/components/NERStatusBadge";
import { getPageForOffset } from "../../lib/pseudonymization/file-extract";

type Props = {
  title: string;
  greetQuestion: string;
  greetTime: string;
  greetAnswer: string;
  bodyIntro: string;
  bodyTransform: string;
  bodySecurity: string;
  noticeTitle: string; // e.g. "🚧 Documentation & Reporting"
  noticeBody: string;
};

const DocumentationReportsPage = ({
  title,
  greetQuestion,
  greetTime,
  greetAnswer,
  bodyIntro,
  bodyTransform,
  bodySecurity,
  noticeTitle,
  noticeBody,
}: Props) => {
  const [message, setMessage] = useState<string>("");

  // SPEC-007a: File upload flow for Context Library (institutional documents, guidelines)
  const uploadFlow = useFileUploadFlow();

  return (
    <Layout>
      <Chat title={title}>
        <Question content={greetQuestion} time={greetTime} />
        <Answer>{greetAnswer}</Answer>

        <Answer time={greetTime}>
          <p className="text-base leading-relaxed">
            {bodyIntro}
            <br />
            {bodyTransform}
            <br />
            {bodySecurity}
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

      {/* Message Input with File Upload for Context Library */}
      <div>
        <Message
          value={message}
          onChange={(e: any) => setMessage(e.target.value)}
          onFileSelected={uploadFlow.handleFileSelected}
        />
        {/* NER Status Badge */}
        <NERStatusBadge status={uploadFlow.status} progress={uploadFlow.progress} />
      </div>

      {/* PII Review Modal (File Mode) */}
      <ModalPIIReview
        visible={uploadFlow.reviewVisible}
        onClose={uploadFlow.handleCancelReview}
        items={uploadFlow.reviewItems}
        onToggle={uploadFlow.toggleReviewItem}
        onAcceptAll={uploadFlow.acceptAllReview}
        onRejectAll={uploadFlow.rejectAllReview}
        onSend={async () => {
          const ok = await uploadFlow.handleConfirmUpload();
          // On success, document uploaded to Context Library
        }}
        sending={uploadFlow.uploading}
        mode="file"
        getPageNumber={(item) =>
          getPageForOffset(item.start, uploadFlow.pageBoundaries)
        }
      />
    </Layout>
  );
};

export default DocumentationReportsPage;

"use client";

import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Question from "@/components/Question";
import Answer from "@/components/Answer";
import { useFileUploadFlow } from "@/hooks/useFileUploadFlow";
import ModalPIIReview from "@/components/ModalPIIReview";
import ModalDocumentPreview from "@/components/ModalDocumentPreview";
import AttachmentChip from "@/components/AttachmentChip";
import NERStatusBadge from "@/components/NERStatusBadge";
import { useTranslation } from "@/lib/i18n/I18nContext";

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
  const [mounted, setMounted] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const t = useTranslation();

  // SPEC-007a / SPEC-007b: File upload flow for Context Library
  const uploadFlow = useFileUploadFlow();

  // Only render file upload UI after client-side hydration to avoid SSR mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

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
      {!mounted ? (
        // SSR placeholder - no upload functionality during server render
        <div className="relative z-5 px-10 pb-6 h-24 2xl:px-6 2xl:pb-5 md:px-4 md:pb-4" />
      ) : (
        // Client-only - full upload flow after hydration
        <div>
          {/* SPEC-007b §3.3: Attachment chip — only when upload succeeded (pseudonymizedText proof) */}
          {uploadFlow.pseudonymizedText && uploadFlow.documentLabel && (
            <AttachmentChip
              documentLabel={uploadFlow.documentLabel}
              onRemove={uploadFlow.clearAttachment}
              onClick={() => setPreviewVisible(true)}
            />
          )}

          <Message
            value={message}
            onChange={(e: any) => setMessage(e.target.value)}
            onFileSelected={uploadFlow.handleFileSelected}
          />
          <NERStatusBadge status={uploadFlow.status} progress={uploadFlow.progress} />
          {uploadFlow.error && (
            <div className="mx-10 mt-1 px-4 py-2 rounded-lg bg-accent-1/10 border border-accent-1 text-accent-1 text-sm 2xl:mx-6 md:mx-4">
              {t(uploadFlow.error)}
            </div>
          )}
          {uploadFlow.phase !== "idle" && (
            <div className="mx-10 mt-1 text-xs text-n-4 2xl:mx-6 md:mx-4">
              {t(`pseudonymization.file.phase-${uploadFlow.phase}`)}
            </div>
          )}
        </div>
      )}

      {/* PII Review Modal (File Mode) — SPEC-007b Phase 1: DocumentPreview */}
      {mounted && (
        <ModalPIIReview
          visible={uploadFlow.reviewVisible}
          onClose={uploadFlow.handleCancelReview}
          items={uploadFlow.reviewItems}
          onToggle={uploadFlow.toggleReviewItem}
          onAcceptAll={uploadFlow.acceptAllReview}
          onRejectAll={uploadFlow.rejectAllReview}
          onSend={uploadFlow.handleConfirmUpload}
          sending={uploadFlow.uploading}
          mode="file"
          documentLabel={uploadFlow.documentLabel ?? undefined}
          extractedText={uploadFlow.extractedText || undefined}
          pageBoundaries={uploadFlow.pageBoundaries}
          onManualAdd={uploadFlow.addManualReviewItem}
        />
      )}

      {/* SPEC-007b §3.4: Post-confirm read-only preview — owner can reveal original */}
      {mounted && uploadFlow.pseudonymizedText && uploadFlow.documentLabel && (
        <ModalDocumentPreview
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          documentLabel={uploadFlow.documentLabel}
          pseudonymizedText={uploadFlow.pseudonymizedText}
          mapping={uploadFlow.mapping}
        />
      )}
    </Layout>
  );
};

export default DocumentationReportsPage;

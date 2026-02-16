"use client";

import { useState } from "react";
import Layout from "@/components/Layout";
import Chat from "@/components/Chat";
import Message from "@/components/Message";
import Answer from "@/components/Answer";
import { useI18n } from "@/lib/i18n-client";
import { useFileUploadFlow } from "@/hooks/useFileUploadFlow";
import ModalPIIReview from "@/components/ModalPIIReview";
import NERStatusBadge from "@/components/NERStatusBadge";
import { getPageForOffset } from "../../lib/pseudonymization/file-extract";

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
  const { t } = useI18n();

  // SPEC-007a: File upload flow with pseudonymization
  const uploadFlow = useFileUploadFlow();

  return (
    <Layout>
      <Chat title={title}>
        {/* Intro-Antwort */}
        <Answer time={t("common.misc.just-now")}>
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

      {/* Message Input with File Upload */}
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
          // On success, user may want to upload another file (no message to clear)
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

export default TherapySupportPage;

// ============================================================================
// 💬 Message Component – Chat Input mit Prompt-Gating
// Datei: components/Message/index.tsx
// Version: v1.1 – 2025-12-11
//
// Änderungen v1.1:
//   - MessageProps um folgende optionale Props erweitert:
//       isAuthenticated, canSend, remainingFreePrompts,
//       subscriptionStatus, planType
//     → damit die Props aus Main/index.tsx typ-sicher durchgereicht werden,
//       ohne das Verhalten des Components zu ändern.
// ============================================================================

import { ChangeEventHandler, MouseEvent } from "react";
import TextareaAutosize from "react-textarea-autosize";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import AddFile from "./AddFile";
import Files from "./Files";

type MessageProps = {
    value: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    placeholder?: string;
    image?: string;
    document?: any;

    // 🔐 Gating-Infos (kommen aus Main/useSession) – alle optional
    canSendPrompt?: boolean;          // false = Senden blockiert
    canUpload?: boolean;              // false = Upload blockiert
    isSessionLoading?: boolean;       // true = Session wird geprüft
    sessionError?: string | null;     // z.B. "Could not reach authentication service"

    // 🔁 Aktionen bei geblockter Nutzung
    onRequireLogin?: () => void;          // z.B. Redirect /sign-in
    onRequireSubscription?: () => void;   // z.B. Redirect /pricing

    // 🔼 optional: tatsächliches Senden (kann später verdrahtet werden)
    onSend?: () => void;

    // 📎 SPEC-007a: File upload callback
    onFileSelected?: (file: File) => void;

    // 🔎 Zusätzliche Infos aus Main/HomePage (nur Typ-Support, im UI aktuell nicht genutzt)
    isAuthenticated?: boolean;
    canSend?: boolean;
    remainingFreePrompts?: number;
    subscriptionStatus?: string | null;
    planType?: string | null;
};

const Message = ({
    value,
    onChange,
    placeholder,
    image,
    document,
    canSendPrompt = true,
    canUpload = true,
    isSessionLoading = false,
    sessionError = null,
    onRequireLogin,
    onRequireSubscription,
    onSend,
    onFileSelected,
}: MessageProps) => {
    const stylesButton = "group absolute right-3 bottom-2 w-10 h-10";

    // ---------------------------------------------------------
    // Helper: Send-Klick mit Health-Grade-Gating
    // ---------------------------------------------------------
    const handleSendClick = (e: MouseEvent<HTMLButtonElement>) => {
        // Während Session-Check → nichts tun
        if (isSessionLoading) {
            e.preventDefault();
            return;
        }

        // Kein Senden erlaubt → Login oder Abo verlangen
        if (!canSendPrompt) {
            e.preventDefault();

            if (onRequireLogin) {
                onRequireLogin();
                return;
            }

            if (onRequireSubscription) {
                onRequireSubscription();
                return;
            }

            return;
        }

        // Falls später eine echte Send-Logik verdrahtet wird
        if (onSend) {
            e.preventDefault();
            onSend();
            return;
        }

        // Fallback: nichts tun (aktueller Stand)
        e.preventDefault();
    };

    const isSendDisabled =
        isSessionLoading ||
        !canSendPrompt ||
        (typeof value === "string" && value.trim().length === 0);

    const isUploadDisabled = isSessionLoading || !canUpload;

    const helperText = (() => {
        if (isSessionLoading) return "Checking access…";
        if (sessionError) return "Connection issue – please try again.";
        if (!canSendPrompt && onRequireLogin)
            return "Sign in to use mentalhealthGPT.";
        if (!canSendPrompt && onRequireSubscription)
            return "Upgrade your plan to continue.";
        return null;
    })();

    return (
        <div className="relative z-5 px-10 pb-6 before:absolute before:-top-6 before:left-0 before:right-6 before:bottom-1/2 before:bg-gradient-to-b before:to-n-1 before:from-n-1/0 before:pointer-events-none 2xl:px-6 2xl:pb-5 md:px-4 md:pb-4 dark:before:to-n-6 dark:before:from-n-6/0">
            <div className="relative z-2 border-2 border-n-3 rounded-xl overflow-hidden dark:border-n-5">
                {(image || document) && (
                    <Files image={image} document={document} />
                )}

                <div className="relative flex flex-col">
                    <div className="relative flex items-center min-h-[3.5rem] px-16">
                        {/* 📎 Upload: UI-Gating (Backend erzwingt Limits zusätzlich) */}
                        <div className={isUploadDisabled ? "opacity-40 cursor-not-allowed" : ""}>
                            <AddFile
                                disabled={isUploadDisabled}
                                onFileSelected={onFileSelected}
                            />
                        </div>

                        <TextareaAutosize
                            className="w-full py-3 bg-transparent body2 text-n-7 outline-none resize-none placeholder:text-n-4/75 dark:text-n-1 dark:placeholder:text-n-4"
                            maxRows={5}
                            autoFocus
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder || "Ask mentalhealthGPT anything"}
                            disabled={isSessionLoading}
                        />

                        {/* 🎙 / ⬆️ Button – abhängig davon, ob Text vorhanden ist */}
                        {value === "" ? (
                            <button
                                className={`${stylesButton} ${isSendDisabled ? "cursor-not-allowed opacity-50" : ""}`}
                                type="button"
                                disabled={isSendDisabled}
                                // später evtl. Voice-Login-/Login-Gating
                                onClick={(e) => {
                                    if (isSendDisabled) {
                                        e.preventDefault();
                                        if (!canSendPrompt && onRequireLogin) {
                                            onRequireLogin();
                                            return;
                                        }
                                        if (!canSendPrompt && onRequireSubscription) {
                                            onRequireSubscription();
                                            return;
                                        }
                                    }
                                }}
                            >
                                <Icon
                                    className="fill-n-4 transition-colors group-hover:fill-primary-1"
                                    name="recording"
                                />
                            </button>
                        ) : (
                            <button
                                className={`${stylesButton} bg-primary-1 rounded-xl transition-colors hover:bg-primary-1/90 ${isSendDisabled ? "cursor-not-allowed opacity-60 hover:bg-primary-1" : ""
                                    }`}
                                type="button"
                                disabled={isSendDisabled}
                                onClick={handleSendClick}
                            >
                                <Icon className="fill-n-1" name="arrow-up" />
                            </button>
                        )}
                    </div>

                    {/* 🔍 Health-/Status-Hinweis unter dem Feld */}
                    {helperText && (
                        <div className="px-16 pb-2 text-xs text-n-4 2xl:px-10 md:px-6">
                            {helperText}
                        </div>
                    )}
                </div>
            </div>

            {/* Audio-/Fehlermeldungs-Blocks bleiben kommentiert bis wir sie brauchen */}
            {/* <div className="relative mt-2 px-5 py-1 bg-n-3 rounded-xl text-0 dark:bg-n-7">
                <Image
                    src="/images/audio-1.svg"
                    width={614}
                    height={39}
                    alt="Audio"
                />
            </div> */}
            {/* <div className="relative mt-2 px-4.5 py-2.5 rounded-xl border-2 border-accent-1 text-accent-1 md:py-1">
                Sorry, voice recognition failed. Please try again or contact
                support.
            </div> */}
        </div>
    );
};

export default Message;

import { useState, useCallback } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { toast } from "react-hot-toast";
import Image from "@/components/Image";
import Notify from "@/components/Notify";
import ModalShareChat from "@/components/ModalShareChat";
import { useTranslation } from "@/lib/i18n/I18nContext";

type ActionsProps = {
  copyText: string;
  onRegenerate?: () => void;
  onRate?: (value: "positive" | "negative") => void;
  onArchive?: () => void;
  onUndoArchive?: () => void;
};

const Actions = ({
  copyText,
  onRegenerate,
  onRate,
  onArchive,
  onUndoArchive,
}: ActionsProps) => {
  const t = useTranslation();
  const [mode, setMode] = useState<"idle" | "share" | "archive">("idle");
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  const onCopy = useCallback(() => {
    toast(() => (
      <Notify iconCheck>
        <div className="ml-3 h6">{t("Content copied")}</div>
      </Notify>
    ));
  }, [t]);

  const handleArchive = useCallback(() => {
    toast((toastObj) => (
      <Notify iconCheck>
        <div className="mr-6 ml-3 h6">{t("1 chat archived")}</div>
        <button
          type="button"
          className="btn-blue btn-medium ml-3"
          onClick={() => {
            onUndoArchive?.();
            toast.dismiss(toastObj.id);
          }}
        >
          {t("Undo")}
        </button>
      </Notify>
    ));
    onArchive?.();
  }, [t, onArchive, onUndoArchive]);

  const handleShareToggle = useCallback(() => {
    setMode((m) => (m === "share" ? "idle" : "share"));
    onRate?.("positive");
  }, [onRate]);

  const handleArchiveToggle = useCallback(() => {
    setMode((m) => (m === "archive" ? "idle" : "archive"));
    onRate?.("negative");
  }, [onRate]);

  const handleRegenerate = useCallback(() => {
    onRegenerate?.();
  }, [onRegenerate]);

  const openModal = useCallback(() => {
    setVisibleModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setVisibleModal(false);
  }, []);

  const styleButton =
    "h-6 ml-3 px-2 bg-n-3 rounded-md caption1 text-n-6 transition-colors hover:text-primary-1 md:h-8 dark:bg-n-7 dark:text-n-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2";

  return (
    <>
      <CopyToClipboard text={copyText} onCopy={onCopy}>
        <button type="button" className={`${styleButton} md:hidden`}>
          {t("Copy")}
        </button>
      </CopyToClipboard>

      <button type="button" className={styleButton} onClick={handleRegenerate}>
        {t("Regenerate response")}
      </button>

      {mode === "idle" && (
        <div className="flex ml-3 px-1 space-x-1 bg-n-3 rounded-md md:hidden dark:bg-n-7">
          <button
            type="button"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 rounded"
            onClick={handleShareToggle}
            aria-label={t("Rate positively")}
            aria-pressed={false}
          >
            <Image
              src="/images/smile-heart-eyes.png"
              width={24}
              height={24}
              alt=""
            />
          </button>
          <button
            type="button"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 rounded"
            onClick={handleArchiveToggle}
            aria-label={t("Rate negatively")}
            aria-pressed={false}
          >
            <Image
              src="/images/smile-unamused.png"
              width={24}
              height={24}
              alt=""
            />
          </button>
        </div>
      )}

      {mode === "share" && (
        <button
          type="button"
          className={`flex items-center ${styleButton} pl-1 md:hidden`}
          onClick={openModal}
          aria-pressed={true}
        >
          <Image
            src="/images/smile-heart-eyes.png"
            width={24}
            height={24}
            alt=""
          />
          <span className="ml-2">{t("Share")}</span>
        </button>
      )}

      {mode === "archive" && (
        <button
          type="button"
          className={`flex items-center ${styleButton} pl-1 md:hidden`}
          onClick={handleArchive}
          aria-pressed={true}
        >
          <Image
            src="/images/smile-unamused.png"
            width={24}
            height={24}
            alt=""
          />
          <span className="ml-2">{t("Archive chat")}</span>
        </button>
      )}

      <ModalShareChat visible={visibleModal} onClose={closeModal} />
    </>
  );
};

export default Actions;

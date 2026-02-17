import { useCallback, useRef, useId } from "react";
import Icon from "@/components/Icon";
import Preview from "../Preview";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Socials Post Details (Media Upload)
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Unique input id via useId() (prevents duplicate IDs in lists)
 * - File validation (type + size) + input reset
 * - Icon names NOT translated
 * ============================================================================
 */

type MediaImage = {
  id: string;
  src: string;
};

type DetailsProps = {
  images: MediaImage[];
  onClose?: () => void;
  onUpload?: (file: File) => void;
};

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25MB (adjust as needed)

const Details = ({ images, onClose, onUpload }: DetailsProps) => {
  const t = useTranslation();
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canClose = typeof onClose === "function";
  const canUpload = typeof onUpload === "function";

  const handleClose = useCallback(() => {
    if (!canClose) return;
    onClose();
  }, [canClose, onClose]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!canUpload) return;

      const file = e.target.files?.[0];

      // Reset input so the same file can be selected again
      e.currentTarget.value = "";

      if (!file) return;

      const isAllowedType =
        file.type.startsWith("image/") || file.type.startsWith("video/");

      if (!isAllowedType) {
        // Optional: show toast/Notify here instead of silent return
        return;
      }

      if (file.size > MAX_UPLOAD_BYTES) {
        // Optional: show toast/Notify here instead of silent return
        return;
      }

      onUpload(file);
    },
    [canUpload, onUpload]
  );

  return (
    <div className="mt-4 p-5 border-2 border-n-3 rounded-xl dark:border-n-5">
      <div className="flex justify-between mb-2">
        <div>
          <div className="caption1 font-semibold text-n-6 dark:text-n-3">
            {t("Suggested media")}
          </div>
          <div className="caption2 text-n-4/75">
            {t("Make sure you have the rights to use the suggested media.")}
          </div>
        </div>

        <button
          type="button"
          className="group shrink-0 w-6.5 h-6.5 ml-6 md:-mt-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleClose}
          disabled={!canClose}
          aria-disabled={!canClose}
          aria-label={t("Close media suggestions")}
        >
          <Icon
            className="w-5 h-5 fill-n-4 transition-colors group-hover:fill-accent-1"
            name="close"
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex overflow-x-auto scrollbar-none -mx-5 before:shrink-0 before:w-5 after:shrink-0 after:w-5">
        {images.map((image) => (
          <Preview item={image} key={image.id} />
        ))}

        <label
          htmlFor={inputId}
          className="relative flex flex-col justify-center items-center shrink-0 w-[12.5rem] h-[9.375rem] bg-n-2 rounded-xl cursor-pointer transition-colors hover:bg-n-3 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-1 focus-within:ring-offset-2 dark:bg-n-7 dark:hover:bg-n-6"
          aria-label={t("Upload media")}
        >
          <input
            id={inputId}
            ref={fileInputRef}
            className="sr-only"
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={!canUpload}
          />
          <Icon className="dark:fill-n-1" name="image-up" aria-hidden="true" />
          <div className="mt-2 caption1 font-semibold text-n-6 dark:text-n-3">
            {t("Upload media")}
          </div>
        </label>
      </div>
    </div>
  );
};

export default Details;

import { useState, useCallback, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";
import Image from "@/components/Image";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Audio Player
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Icon names NOT translated ("pause", "play" are identifiers)
 * - Times are values (not translated); if dynamic, consider suppressHydrationWarning
 * - Play/Pause uses aria-pressed + dynamic aria-label
 * - Character count only shown in edit mode (no misleading "0 characters")
 * - Mock text kept as local content (do NOT run long mock through t())
 * ============================================================================
 */

type AudioPlayerProps = {
  edit?: boolean;
  onSave?: () => void;
};

const AudioPlayer = ({ edit = false, onSave }: AudioPlayerProps) => {
  const t = useTranslation();
  const [active, setActive] = useState<boolean>(true);

  const canSave = typeof onSave === "function";

  const handleSave = useCallback(() => {
    if (!canSave) return;
    onSave();
  }, [canSave, onSave]);

  const togglePlayPause = useCallback(() => {
    setActive((v) => !v);
  }, []);

  // Mock content (local, not translated). Replace later with real transcript + i18n keys if needed.
  const sampleContent = useMemo(
    () =>
      `Introducing "Brainwave", an AI-powered product that can turn any written script into high-quality audio. Using advanced natural language processing and text-to-speech technology, Speechify can generate realistic and natural-sounding voices in multiple languages, allowing you to create audiobooks, podcasts, and other audio content with ease. Additionally, Speechify offers a wide range of customization options, including different voices, speaking styles, and even emotions, so you can create audio that perfectly matches your brand or project. With Speechify, creating audio content has never been easier.`,
    []
  );

  const highlightText = useMemo(
    () => `Introducing "Brainwave", an AI-powered product that can turn any`,
    []
  );

  const characterCount = sampleContent.length;

  return (
    <div>
      <div
        className={twMerge(
          "border-2 border-transparent rounded-xl overflow-hidden bg-n-1 dark:bg-n-6",
          edit && "border-primary-1"
        )}
      >
        <div className="flex items-center px-3.5 py-2.5">
          <button
            type="button"
            className="shrink-0 w-8 h-8 bg-n-7 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 dark:bg-n-1"
            onClick={togglePlayPause}
            aria-label={active ? t("Pause audio") : t("Play audio")}
            aria-pressed={active}
          >
            <Icon
              className="w-3 h-3 fill-n-1 dark:fill-n-7"
              name={active ? "pause" : "play"}
              aria-hidden="true"
            />
          </button>

          <div className="grow ml-3" aria-hidden="true">
            <Image
              className="w-full"
              src={edit ? "/images/audio-edited.svg" : "/images/audio.svg"}
              width={532}
              height={39}
              alt=""
            />
          </div>
        </div>

        {edit && (
          <>
            <div className="p-3.5 border-t border-n-3 dark:border-n-5">
              <span className="bg-primary-1 text-n-1">{highlightText}</span>{" "}
              {sampleContent.replace(highlightText, "").trimStart()}
            </div>

            <div className="flex justify-between items-center px-3.5 pt-3.5 pb-2.5 border-t border-n-3 dark:border-n-5">
              <div className="caption1 text-n-4/75">
                {characterCount} {t("characters")}
              </div>

              <button
                type="button"
                className="btn-blue btn-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={!canSave}
                aria-disabled={!canSave}
              >
                {t("Save")}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between mt-2 caption2 text-n-4">
        <div /* suppressHydrationWarning */>0:21</div>
        <div /* suppressHydrationWarning */>1:02</div>
      </div>
    </div>
  );
};

export default AudioPlayer;

import Image from "@/components/Image";
import Icon from "@/components/Icon";
import Loading from "./Loading";
import Actions from "./Actions";
import { useTranslation } from "@/lib/i18n/I18nContext";

type AnswerProps = {
  children?: React.ReactNode;
  loading?: boolean;
  time?: string;      // NOTE: should be pre-formatted/stable string
  onPause?: () => void;
  copyText?: string;
  onRegenerate?: () => void;
  onRate?: (value: "positive" | "negative") => void;
  onArchive?: () => void;
  onUndoArchive?: () => void;
};

const Answer = ({
  children,
  loading = false,
  time,
  onPause,
  copyText = "",
  onRegenerate,
  onRate,
  onArchive,
  onUndoArchive,
}: AnswerProps) => {
  const t = useTranslation();
  const canPause = typeof onPause === "function";
  const hasTime = typeof time === "string" && time.trim().length > 0;

  return (
    <div className="max-w-[50rem]">
      <div className="pt-6 px-6 pb-16 space-y-4 bg-n-2 rounded-[1.25rem] md:p-5 md:pb-14 dark:bg-n-7">
        {loading ? <Loading /> : children}
      </div>

      <div className="-mt-8 flex items-end pl-6">
        <div
          className={`relative shrink-0 w-16 h-16 mr-auto rounded-2xl overflow-hidden ${
            !loading &&
            "shadow-[0_0_0_0.25rem_#FEFEFE] dark:shadow-[0_0_0_0.25rem_#232627]"
          }`}
          aria-hidden="true"
        >
          <Image
            className="object-cover rounded-2xl"
            src="/images/logo-chat.png"
            fill
            alt="" // decorative (avoid noisy SR output)
          />
        </div>

        {loading ? (
          canPause ? (
            <button
              type="button"
              className="group flex items-center ml-3 px-2 py-0.5 bg-n-3 rounded-md caption1 text-n-6 transition-colors
                         hover:text-primary-1 dark:bg-n-7 dark:text-n-3 dark:hover:text-primary-1
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2"
              onClick={onPause}
              aria-label={t("Pause generating")}
            >
              <Icon
                className="w-4 h-4 mr-2 transition-colors group-hover:fill-primary-1 dark:fill-n-3"
                name="pause-circle"
                aria-hidden="true"
              />
              {t("Pause generating")}
            </button>
          ) : null
        ) : (
          <div className="flex items-center">
            {hasTime && (
              <div
                className="caption1 text-n-4/50 dark:text-n-4"
                suppressHydrationWarning
                title={time}
              >
                {time}
              </div>
            )}
            <Actions
              copyText={copyText}
              onRegenerate={onRegenerate}
              onRate={onRate}
              onArchive={onArchive}
              onUndoArchive={onUndoArchive}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Answer;

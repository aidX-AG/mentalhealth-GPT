import Image from "@/components/Image";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Application
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - Accessible, deterministic UI behavior
 * - Optional handlers (no silent "clickable but does nothing")
 * ============================================================================
 */

type ApplicationItem = {
  id: string;
  title: string;
  image: string;
  date: string;
  [key: string]: unknown;
};

type ApplicationProps = {
  item: ApplicationItem;
  onDeauthorize?: (id: string) => void;
  onOpen?: (id: string) => void;
};

const Application = ({ item, onDeauthorize, onOpen }: ApplicationProps) => {
  const t = useTranslation();

  const canDeauthorize = typeof onDeauthorize === "function";
  const canOpen = typeof onOpen === "function";

  const handleDeauthorize = () => {
    if (!canDeauthorize) return;
    onDeauthorize(item.id);
  };

  const handleOpen = () => {
    if (!canOpen) return;
    onOpen(item.id);
  };

  return (
    <div
      className={`group flex items-center py-6 border-t border-n-3 dark:border-n-6 ${
        canOpen ? "cursor-pointer" : ""
      }`}
      onClick={canOpen ? handleOpen : undefined}
      role={canOpen ? "button" : undefined}
      tabIndex={canOpen ? 0 : undefined}
      onKeyDown={
        canOpen
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpen();
              }
            }
          : undefined
      }
      aria-label={canOpen ? t("Open application") : undefined}
    >
      <div className="w-12 shrink-0">
        <Image
          className="w-full rounded-xl"
          src={item.image}
          width={48}
          height={48}
          alt={item.title ? `${item.title}` : ""}
        />
      </div>

      <div className="grow px-4">
        <div className="base1 font-semibold">{item.title}</div>
        <div className="caption1 text-n-4/50">{item.date}</div>
      </div>

      <button
        type="button"
        className="btn-stroke-light shrink-0 ml-4 invisible opacity-0 transition-all group-hover:visible group-hover:opacity-100 xl:visible xl:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={(e) => {
          // prevent triggering row open
          e.stopPropagation();
          handleDeauthorize();
        }}
        disabled={!canDeauthorize}
        aria-disabled={!canDeauthorize}
        aria-label={t("Deauthorize")}
      >
        {t("Deauthorize")}
      </button>
    </div>
  );
};

export default Application;

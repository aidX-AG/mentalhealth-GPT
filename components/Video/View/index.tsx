import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Video View (Thumbnail with Play Button)
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Accessible interactive button (requires onPlay handler)
 * - Decorative icon hidden from screen readers
 * - Health-grade accessibility improvements
 * ============================================================================
 */

type ViewProps = {
  onPlay?: () => void;
};

const View = ({ onPlay }: ViewProps) => {
  const t = useTranslation();

  const isInteractive = typeof onPlay === "function";

  return (
    <div className="relative max-w-[32.5rem] aspect-[1.6] xl:max-w-full">
      <Image
        className="rounded-xl object-cover"
        src="/images/video-pic-1.jpg"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1499px) 50vw, 33.33vw"
        alt={t("Video preview image")}
      />

      <button
        type="button"
        onClick={onPlay}
        disabled={!isInteractive}
        aria-disabled={!isInteractive}
        className="absolute top-1/2 left-1/2 w-12 h-12 pl-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-n-1/90 transition-colors hover:bg-n-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 md:w-10 md:h-10 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label={t("Play video")}
      >
        <Icon
          className="w-4 h-4"
          name="play"
          aria-hidden="true"
          focusable="false"
        />
      </button>
    </div>
  );
};

export default View;

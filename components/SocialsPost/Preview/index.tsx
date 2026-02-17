import { useCallback } from "react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Socials Post Preview (Media Thumbnail)
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Contextual aria-label includes item id
 * - Optional handler wired only when available
 * ============================================================================
 */

type PreviewImage = {
  id: string;
  src: string;
};

type PreviewProps = {
  item: PreviewImage;
  onRemove?: (id: string) => void;
};

const Preview = ({ item, onRemove }: PreviewProps) => {
  const t = useTranslation();

  const canRemove = typeof onRemove === "function";

  const handleRemove = useCallback(() => {
    if (!canRemove) return;
    onRemove(item.id);
  }, [canRemove, onRemove, item.id]);

  return (
    <div className="relative shrink-0 w-[12.5rem] h-[9.375rem] mr-3">
      <Image
        className="rounded-xl object-cover"
        src={item.src}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        alt={t("Uploaded media preview")}
      />

      <button
        type="button"
        className="group absolute top-2 right-2 w-6 h-6 rounded-full bg-n-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={canRemove ? handleRemove : undefined}
        disabled={!canRemove}
        aria-disabled={!canRemove}
        aria-label={`${t("Remove image")}: ${item.id}`}
      >
        <Icon
          className="w-4 h-4 fill-n-4 transition-colors group-hover:fill-n-1"
          name="close-fat"
          aria-hidden="true"
        />
      </button>
    </div>
  );
};

export default Preview;

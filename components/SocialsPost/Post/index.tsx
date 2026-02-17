import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { useCallback } from "react";
import Details from "../Details";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Socials Post Item
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Icon names NOT translated, "#" NOT translated
 * - External links hardened (noopener noreferrer + referrerPolicy)
 * - Optional action handlers with capability checks
 * - Typed item model (no any)
 * ============================================================================
 */

type PostImage = {
  id: string;
  src: string;
};

type SocialPostItem = {
  id: string;
  icon: string;          // e.g. "/images/twitter.png"
  platform?: string;     // e.g. "Twitter" (optional but recommended)
  content: string;
  link: string;
  tags: string[];
  images: PostImage[];
};

type PostProps = {
  item: SocialPostItem;
  onShareNow?: (item: SocialPostItem) => void;
  onEdit?: (item: SocialPostItem) => void;
  onNewVariation?: (item: SocialPostItem) => void;
  onCopy?: (item: SocialPostItem) => void;
};

const Post = ({ item, onShareNow, onEdit, onNewVariation, onCopy }: PostProps) => {
  const t = useTranslation();

  const canShareNow = typeof onShareNow === "function";
  const canEdit = typeof onEdit === "function";
  const canNewVariation = typeof onNewVariation === "function";
  const canCopy = typeof onCopy === "function";

  const handleShareNow = useCallback(() => {
    if (!canShareNow) return;
    onShareNow(item);
  }, [canShareNow, onShareNow, item]);

  const handleEdit = useCallback(() => {
    if (!canEdit) return;
    onEdit(item);
  }, [canEdit, onEdit, item]);

  const handleNewVariation = useCallback(() => {
    if (!canNewVariation) return;
    onNewVariation(item);
  }, [canNewVariation, onNewVariation, item]);

  const handleCopy = useCallback(() => {
    if (!canCopy) return;
    onCopy(item);
  }, [canCopy, onCopy, item]);

  const platformAlt = item.platform
    ? `${item.platform} ${t("icon")}`
    : t("Social platform icon");

  return (
    <div className="flex mb-4 p-5 bg-n-1 rounded-xl last:mb-0 md:block dark:bg-n-6">
      <div className="shrink-0 w-10">
        <Image
          className="w-full"
          src={item.icon}
          width={40}
          height={40}
          alt={platformAlt}
        />
      </div>

      <div className="w-[calc(100%-2.5rem)] pl-4 md:w-full md:pl-0 md:pt-4">
        <div>
          {item.content}{" "}
          <a
            className="underline text-primary-1 break-words"
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            referrerPolicy="no-referrer"
          >
            {item.link}
          </a>
          {item.tags.map((tag, index) => (
            <span className="text-primary-1" key={`${tag}-${index}`}>
              {" "}#{tag}
            </span>
          ))}
        </div>

        <Details images={item.images} />

        <div className="flex flex-wrap mt-1 -ml-3 md:-mr-2">
          <button
            type="button"
            className="btn-stroke-light btn-small ml-3 mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleShareNow}
            disabled={!canShareNow}
            aria-disabled={!canShareNow}
          >
            <span>{t("Share now")}</span>
            <Icon name="external-link" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="btn-stroke-light btn-small ml-3 mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleEdit}
            disabled={!canEdit}
            aria-disabled={!canEdit}
          >
            <span>{t("Edit")}</span>
            <Icon name="edit" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="btn-stroke-light btn-small ml-3 mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleNewVariation}
            disabled={!canNewVariation}
            aria-disabled={!canNewVariation}
          >
            <span>{t("New variation")}</span>
            <Icon name="plus" aria-hidden="true" />
          </button>

          <button
            type="button"
            className="btn-stroke-light btn-small ml-3 mt-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCopy}
            disabled={!canCopy}
            aria-disabled={!canCopy}
          >
            <span>{t("Copy")}</span>
            <Icon name="copy" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Post;

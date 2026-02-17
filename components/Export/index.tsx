import { useCallback, useMemo } from "react";
import Image from "@/components/Image";
import Icon from "@/components/Icon";
import { exportImage, exportAudio } from "@/constants/export";
import { useTranslation } from "@/lib/i18n/I18nContext";

type ExportProps = {
  typeImage?: boolean;
  onSelect?: (id: string) => void; // optional: hook up later
};

const Export = ({ typeImage = false, onSelect }: ExportProps) => {
  const t = useTranslation();

  const items = useMemo(() => (typeImage ? exportImage : exportAudio), [typeImage]);

  const handleSelect = useCallback(
    (id?: string) => {
      if (!id) return;
      onSelect?.(id);
    },
    [onSelect]
  );

  return (
    <div>
      {items.map((item) => (
        <div
          key={item.title}
          className="mt-3 border-t border-n-3 dark:border-n-6"
        >
          <div className="flex items-center h-8 pl-3 caption1 font-semibold text-n-4/75">
            {item.title}
          </div>

          {item.list.map((x) => {
            const key = x.title;
            const isClickable = false; // No IDs in export data

            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelect(undefined)}
                disabled={!isClickable}
                aria-disabled={!isClickable}
                className={[
                  "flex items-center w-full px-3 py-2 rounded-lg transition-colors",
                  "hover:bg-n-2 dark:hover:bg-n-6",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2",
                  !isClickable ? "opacity-60 cursor-not-allowed" : "",
                ].join(" ")}
              >
                <div className="relative shrink-0 flex items-center justify-center w-10 h-10 mr-4 rounded-full">
                  {x.image && (
                    <Image
                      className="object-contain"
                      src={x.image}
                      fill
                      alt={x.title ?? ""}
                    />
                  )}
                  {x.icon && (
                    <Icon className="dark:fill-n-1" name={x.icon} aria-hidden="true" />
                  )}
                </div>

                <div className="text-left min-w-0">
                  <div className="base2 font-semibold truncate">{x.title}</div>
                  {x.details && (
                    <div className="caption2 text-n-4/75 truncate">{x.details}</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      ))}

      <button
        type="button"
        className={[
          "flex items-center w-full px-3 py-2 rounded-lg transition-colors",
          "hover:bg-n-2 dark:hover:bg-n-6",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2",
        ].join(" ")}
        onClick={() => handleSelect("more")}
      >
        <div className="relative flex justify-center items-center shrink-0 w-10 h-10 mr-4 rounded-full">
          <Icon className="dark:fill-n-1" name="dots" aria-hidden="true" />
        </div>
        <div className="base2 font-semibold">{t("More")}</div>
      </button>
    </div>
  );
};

export default Export;

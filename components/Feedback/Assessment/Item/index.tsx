import { useState, useCallback } from "react";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Feedback Assessment Item
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Icon names are identifiers (NOT translated)
 * - YouTube iframe hardened with sandbox + referrerPolicy (health/ISO)
 * - Accessible "How" button with contextual aria-label
 * ============================================================================
 */

type AssessmentItem = {
  number: number;
  incorrect: string;
  correct: string;
};

type ItemProps = {
  item: AssessmentItem;
};

const Item = ({ item }: ItemProps) => {
  const t = useTranslation();
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => setVisible(true), []);
  const close = useCallback(() => setVisible(false), []);

  return (
    <>
      <div className="table-row base2 md:flex md:items-center" role="row">
        <div
          className="table-cell align-middle py-3 pl-5 border-t border-n-3 md:hidden dark:border-n-5/50"
          role="cell"
        >
          {item.number}
        </div>

        <div
          className="table-cell align-middle py-3 pl-5 border-t border-n-3 text-accent-1 md:shrink-0 md:w-1/2 md:pr-2 dark:border-n-5/50"
          role="cell"
        >
          {item.incorrect}
        </div>

        <div
          className="table-cell align-middle py-3 pl-5 border-t border-n-3 text-[#56A171] md:shrink-0 md:w-1/2 md:pl-0 md:pr-5 dark:border-n-5/50"
          role="cell"
        >
          <div className="inline-flex items-center md:flex">
            <Icon
              className="shrink-0 w-5 h-5 mr-2 fill-[#56A171]"
              name="check-circle"
              aria-hidden="true"
            />
            <div className="md:w-[calc(100%-1.25rem)] md:truncate">
              {item.correct}
            </div>
          </div>
        </div>

        <div
          className="table-cell align-middle py-3 pl-5 pr-5 text-center border-t border-n-3 text-0 md:hidden dark:border-n-5/50"
          role="cell"
        >
          <button
            type="button"
            className="group rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2"
            onClick={open}
            aria-label={`${t("How")} – ${t("Question")} ${item.number}`}
          >
            <Icon
              className="fill-n-4/75 transition-colors group-hover:fill-primary-1"
              name="play-circle"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <Modal visible={visible} onClose={close} video>
        <iframe
          className="w-full h-full"
          src="https://www.youtube.com/embed/4cR7E79X8Ys"
          title={t("YouTube video player")}
          referrerPolicy="no-referrer"
          sandbox="allow-scripts allow-same-origin allow-presentation"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </Modal>
    </>
  );
};

export default Item;

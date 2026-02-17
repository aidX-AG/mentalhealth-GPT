import { useState, useCallback } from "react";
import Icon from "@/components/Icon";
import ModalShareChat from "@/components/ModalShareChat";
import Actions from "./Actions";
import { useTranslation } from "@/lib/i18n/I18nContext";

type ChatProps = {
  title: string;
  children: React.ReactNode;
};

const Chat = ({ title, children }: ChatProps) => {
  const t = useTranslation();
  const [favorite, setFavorite] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  const closeModal = useCallback(() => setVisibleModal(false), []);

  return (
    <>
      <div className="flex items-center min-h-[4.5rem] px-10 py-3 border-b border-n-3 shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.06)] 2xl:px-6 lg:-mt-18 lg:pr-20 md:pl-5 md:pr-18 dark:border-n-5 dark:shadow-[0_0.75rem_2.5rem_-0.75rem_rgba(0,0,0,0.15)]">
        <div className="mr-auto h5 truncate md:h6" title={title}>
          {title}
        </div>

        <div className="flex items-center ml-6">
          <button
            type="button"
            className="group w-8 h-8 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2"
            onClick={() => setFavorite((v) => !v)}
            aria-label={favorite ? t("Remove from favorites") : t("Add to favorites")}
            aria-pressed={favorite}
          >
            <Icon
              className={
                favorite
                  ? "fill-accent-5"
                  : "fill-n-4 transition-colors group-hover:fill-accent-5"
              }
              name={favorite ? "star-fill" : "star"}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className="group w-8 h-8 ml-6 md:ml-3 md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2"
            onClick={() => setVisibleModal(true)}
            aria-label={t("Share chat")}
          >
            <Icon
              className="fill-n-4 transition-colors group-hover:fill-primary-1"
              name="share"
              aria-hidden="true"
            />
          </button>

          <Actions />
        </div>
      </div>

      <div className="relative z-2 grow p-10 space-y-10 overflow-y-auto scroll-smooth scrollbar-none 2xl:p-6 md:p-5">
        {children}
      </div>

      <ModalShareChat visible={visibleModal} onClose={closeModal} />
    </>
  );
};

export default Chat;

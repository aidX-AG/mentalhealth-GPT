import { useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { toast } from "react-hot-toast";
import Icon from "@/components/Icon";
import ModalShareChat from "@/components/ModalShareChat";
import Notify from "@/components/Notify";
import Notifications from "./Notifications";
import Profile from "./Profile";
import ChatItem from "./ChatItem";
import ChatEmpty from "./ChatEmpty";
import { notifications } from "@/mocks/notifications";
import { chatHistory } from "@/mocks/chatHistory";
import { getT } from "@/lib/i18n-runtime";
const t = getT();

type RightSidebarProps = {
  className?: string;
  visible?: boolean;
};

const RightSidebar = ({ className, visible }: RightSidebarProps) => {
  const [clean, setClean] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);

  const handleClickClear = (toastObj: any) => {
    setClean(true);
    toast.dismiss(toastObj.id);
  };

  return (
    <>
      <div
        className={twMerge(
          // ❌ border-l border-n-3 entfernt (hat den unerwünschten Rand erzeugt)
          `absolute top-0 right-0 bottom-0 flex flex-col w-[22.5rem] pt-[8rem] pb-24 bg-n-1 rounded-l-2xl dark:bg-n-7`,
          className
        )}
        aria-hidden={!visible}
      >
        <div className="absolute top-0 left-0 right-0 flex justify-end items-center h-18 px-9 border-b border-n-3 lg:px-6">
          <Notifications items={notifications} />
          <Profile />
          <button className="btn-dark btn-medium" onClick={() => setVisibleModal(true)}>
            {t("Share")}
          </button>
        </div>

        <div className="absolute top-24 left-0 right-0 flex items-center px-9 md:px-6">
          <div className="base2 text-n-4/75">{t("Chat history")}</div>
          <div className="ml-3 px-2 bg-n-3 rounded-lg caption1 text-n-4 dark:bg-n-5/50">
            {clean ? "0" : "26/100"}
          </div>

          {!clean && (
            <button
              className="group relative ml-auto text-0"
              onClick={() =>
                toast((toastObj) => (
                  <Notify className="md:flex-col md:items-center md:px-10" iconDelete>
                    <div className="ml-3 mr-6 h6 md:mx-0 md:my-2">{t("Clear all chat history?")}</div>
                    <div className="flex justify-center">
                      <button
                        className="btn-stroke-light btn-medium md:min-w-[6rem]"
                        onClick={() => toast.dismiss(toastObj.id)}
                      >
                        {t("Cancel")}
                      </button>
                      <button
                        className="btn-blue btn-medium ml-3 md:min-w-[6rem]"
                        onClick={() => handleClickClear(toastObj)}
                      >
                        {t("Clear")}
                      </button>
                    </div>
                  </Notify>
                ))
              }
            >
              {/* ❌ Icon-Namen nicht übersetzen */}
              <Icon
                className="w-5 h-5 fill-n-4 transition-colors group-hover:fill-accent-1"
                name="trash"
              />
              <div className="absolute min-w-[8rem] top-1/2 -translate-y-1/2 right-full mr-2 px-2 py-1 rounded bg-n-1 caption2 text-n-4 shadow-popover pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                {t("Delete")}
              </div>
            </button>
          )}
        </div>

        <div className="grow overflow-y-auto scroll-smooth px-6 md:px-3">
          {clean ? <ChatEmpty /> : chatHistory.map((x) => <ChatItem item={x} key={x.id} />)}
        </div>

        <div className="absolute left-0 right-0 bottom-0 p-6">
          <Link className="btn-blue w-full" href="/">
            {/* ❌ Icon-Namen nicht übersetzen */}
            <Icon name="plus" />
            <span>{t("New chat")}</span>
          </Link>
        </div>
      </div>

      <ModalShareChat visible={visibleModal} onClose={() => setVisibleModal(false)} />
    </>
  );
};

export default RightSidebar;

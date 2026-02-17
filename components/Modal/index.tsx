import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";
import { useTranslation } from "@/lib/i18n/I18nContext";

type ModalProps = {
  className?: string;
  classWrap?: string;
  classOverlay?: string;
  classButtonClose?: string;
  visible: boolean;
  onClose: () => void;
  initialFocus?: React.MutableRefObject<HTMLElement | null>;
  children: React.ReactNode;
  video?: boolean;
};

const Modal = ({
  className,
  classWrap,
  classOverlay,
  classButtonClose,
  visible,
  onClose,
  initialFocus,
  children,
  video,
}: ModalProps) => {
  const t = useTranslation();

  return (
    <Transition show={visible} as={Fragment}>
      <Dialog
        initialFocus={initialFocus}
        className={twMerge(
          "fixed inset-0 z-50 flex p-6 overflow-auto scroll-smooth md:px-4",
          className
        )}
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={twMerge(
              "fixed inset-0",
              video ? "bg-n-7/95" : "bg-n-7/75 dark:bg-n-6/90",
              classOverlay
            )}
            aria-hidden="true"
          />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom={twMerge("opacity-0", !video && "scale-95")}
          enterTo={twMerge("opacity-100", !video && "scale-100")}
          leave="ease-in duration-200"
          leaveFrom={twMerge("opacity-100", !video && "scale-100")}
          leaveTo={twMerge("opacity-0", !video && "scale-95")}
        >
          <Dialog.Panel
            className={twMerge(
              "relative z-10 max-w-[37.5rem] w-full m-auto bg-n-1 rounded-3xl dark:bg-n-7",
              video &&
                "static max-w-[64rem] aspect-video rounded-[1.25rem] bg-n-7 overflow-hidden shadow-[0_2.5rem_8rem_rgba(0,0,0,0.5)]",
              classWrap
            )}
          >
            {children}

            <button
              type="button"
              className={twMerge(
                "fill-n-7 hover:fill-primary-1 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2",
                video &&
                  "absolute top-6 right-6 w-10 h-10 rounded-full bg-n-1 dark:bg-n-7 shadow-sm",
                classButtonClose
              )}
              onClick={onClose}
              aria-label={t("Close")}
            >
              <Icon className="fill-inherit" name="close" />
            </button>
          </Dialog.Panel>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default Modal;

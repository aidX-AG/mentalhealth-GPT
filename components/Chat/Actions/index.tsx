import { useState, useCallback, Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Icon from "@/components/Icon";
import ModalShareChat from "@/components/ModalShareChat";
import { useTranslation } from "@/lib/i18n/I18nContext";

type ActionsProps = Record<string, never>;

const Actions = ({}: ActionsProps) => {
  const t = useTranslation();
  const [favorite, setFavorite] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  const closeModal = useCallback(() => setVisibleModal(false), []);

  const handleToggleFavorite = useCallback(() => {
    setFavorite((v) => !v);
  }, []);

  const handleShare = useCallback(() => {
    setVisibleModal(true);
  }, []);

  return (
    <>
      <div className="relative z-10 ml-6 md:ml-4">
        <Menu>
          {({ close }) => (
            <>
              <Menu.Button className="group relative w-8 h-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2">
                <Icon
                  className="fill-n-4 transition-colors group-hover:fill-primary-1 ui-open:!fill-primary-1"
                  name="dots"
                  aria-hidden="true"
                />
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Menu.Items className="absolute top-full -left-2 w-[13.75rem] mt-1 p-3 bg-n-1 rounded-[1.25rem] shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0_2rem_2rem_-1rem_rgba(0,0,0,0.1)] outline-none lg:left-auto lg:-right-6 dark:bg-n-7 dark:border dark:border-n-5">
                  <div className="space-y-2">
                    <Menu.Item>
                      <button
                        type="button"
                        className="group flex items-center w-full h-12 px-3 rounded-lg base1 font-semibold transition-colors text-n-4 hover:bg-n-2 hover:text-n-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 dark:hover:bg-n-6 dark:hover:text-n-1"
                        onClick={() => {
                          close();
                          handleToggleFavorite();
                        }}
                      >
                        <Icon
                          className={`shrink-0 mr-3 fill-n-4 transition-colors group-hover:fill-n-7 dark:group-hover:fill-n-1 ${
                            favorite && "!fill-accent-5"
                          }`}
                          name={favorite ? "star-fill" : "star"}
                          aria-hidden="true"
                        />
                        {t("Add to favorite list")}
                      </button>
                    </Menu.Item>

                    <Menu.Item>
                      <button
                        type="button"
                        className="group flex items-center w-full h-12 px-3 rounded-lg base1 font-semibold transition-colors text-n-4 hover:bg-n-2 hover:text-n-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 dark:hover:bg-n-6 dark:hover:text-n-1"
                        onClick={() => {
                          close();
                          handleShare();
                        }}
                      >
                        <Icon
                          className="shrink-0 mr-3 fill-n-4 transition-colors group-hover:fill-n-7 dark:group-hover:fill-n-1"
                          name="share"
                          aria-hidden="true"
                        />
                        {t("Share")}
                      </button>
                    </Menu.Item>

                    <Menu.Item>
                      <button
                        type="button"
                        className="group flex items-center w-full h-12 px-3 rounded-lg base1 font-semibold transition-colors text-n-4 hover:bg-n-2 hover:text-n-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 dark:hover:bg-n-6 dark:hover:text-n-1"
                        onClick={() => {
                          close();
                          console.log("Duplicate chat");
                        }}
                      >
                        <Icon
                          className="shrink-0 mr-3 fill-n-4 transition-colors group-hover:fill-n-7 dark:group-hover:fill-n-1"
                          name="duplicate"
                          aria-hidden="true"
                        />
                        {t("Duplicate chat")}
                      </button>
                    </Menu.Item>

                    <Menu.Item>
                      <button
                        type="button"
                        className="group flex items-center w-full h-12 px-3 rounded-lg base1 font-semibold transition-colors text-n-4 hover:bg-n-2 hover:text-n-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 dark:hover:bg-n-6 dark:hover:text-n-1"
                        onClick={() => {
                          close();
                          console.log("Delete chat");
                        }}
                      >
                        <Icon
                          className="shrink-0 mr-3 fill-n-4 transition-colors group-hover:fill-n-7 dark:group-hover:fill-n-1"
                          name="delete-chat"
                          aria-hidden="true"
                        />
                        {t("Delete chat")}
                      </button>
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>

      <ModalShareChat visible={visibleModal} onClose={closeModal} />
    </>
  );
};

export default Actions;

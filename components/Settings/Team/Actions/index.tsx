import { Fragment, useCallback, useMemo } from "react";
import { Menu, Transition } from "@headlessui/react";
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";
import { useTranslation } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Team Member Actions
 * Version: v1.2 – 2026-02-17
 * Notes:
 * - Headless UI Menu (close provided via render-prop)
 * - Capability checks (disabled state)
 * - Deterministic close() before side effects
 * - Avoid mouseleave auto-close (prevents flicker / accidental close)
 * ============================================================================
 */

type ActionsProps = {
  className?: string;
  onMakeAdmin?: () => void;
  onDeleteMember?: () => void;
};

const Actions = ({ className, onMakeAdmin, onDeleteMember }: ActionsProps) => {
  const t = useTranslation();

  const canMakeAdmin = typeof onMakeAdmin === "function";
  const canDeleteMember = typeof onDeleteMember === "function";

  const handleMakeAdmin = useCallback(
    (close: () => void) => {
      close();
      if (!canMakeAdmin) return;
      onMakeAdmin?.();
    },
    [canMakeAdmin, onMakeAdmin]
  );

  const handleDeleteMember = useCallback(
    (close: () => void) => {
      close();
      if (!canDeleteMember) return;
      onDeleteMember?.();
    },
    [canDeleteMember, onDeleteMember]
  );

  const menu = useMemo(
    () => [
      {
        id: "make-admin",
        title: t("Make admin"),
        icon: "star",
        onClick: handleMakeAdmin,
        disabled: !canMakeAdmin,
      },
      {
        id: "delete-member",
        title: t("Delete member"),
        icon: "trash",
        onClick: handleDeleteMember,
        disabled: !canDeleteMember,
      },
    ],
    [t, handleMakeAdmin, handleDeleteMember, canMakeAdmin, canDeleteMember]
  );

  return (
    <div className={twMerge("relative", className)}>
      <Menu>
        {({ open, close }) => (
          <>
            <Menu.Button
              className="group/menu relative w-6 h-8 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2"
              aria-label={t("Actions")}
            >
              <Icon
                className={`fill-n-4/50 rotate-90 transition-colors group-hover/menu:fill-n-7 dark:group-hover/menu:fill-n-3 ${
                  open && "!fill-primary-1"
                }`}
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
              <Menu.Items className="absolute top-full -right-2 z-20 w-[13.75rem] p-3 bg-n-1 rounded-[1.25rem] shadow-[0_0_1rem_0.25rem_rgba(0,0,0,0.04),0_2rem_2rem_-1rem_rgba(0,0,0,0.1)] dark:bg-n-6 outline-none">
                <div className="space-y-1">
                  {menu.map((item) => (
                    <Menu.Item key={item.id} disabled={item.disabled}>
                      {({ active, disabled }) => (
                        <button
                          type="button"
                          className={twMerge(
                            "group flex items-center w-full h-10 px-3 rounded-lg base2 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2",
                            disabled
                              ? "text-n-4/50 cursor-not-allowed"
                              : twMerge(
                                  "text-n-4 dark:text-n-2",
                                  active &&
                                    "bg-n-2 text-n-7 dark:bg-n-5 dark:text-n-1"
                                )
                          )}
                          onClick={() => item.onClick(close)}
                          disabled={disabled}
                        >
                          <Icon
                            className={twMerge(
                              "shrink-0 w-5 h-5 mr-3 transition-colors",
                              disabled
                                ? "fill-n-4/50"
                                : active
                                  ? "fill-n-7 dark:fill-n-1"
                                  : "fill-n-4 group-hover:fill-n-7 dark:fill-n-2"
                            )}
                            name={item.icon}
                            aria-hidden="true"
                          />
                          {item.title}
                        </button>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default Actions;

// components/LeftSidebar/index.tsx
"use client"; // ✅ explizit Client-Komponente (Hooks, Click-Handler, Modals)

import { useState, useEffect } from "react";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import Logo from "@/components/Logo";
import Icon from "@/components/Icon";
import Modal from "@/components/Modal";
import Search from "@/components/Search";
import Settings from "@/components/Settings";
import Navigation from "./Navigation";
import ChatList from "./ChatList";
import Profile from "./Profile";
import ToggleTheme from "./ToggleTheme";
import { chatList } from "@/mocks/chatList";
import { resultSearch } from "@/mocks/resultSearch";
import { settings } from "@/constants/settings";
import { twMerge } from "tailwind-merge";
// ❌ getT() entfernen – das ist für SSR gedacht und hier falsch
// import { getT } from "@/lib/i18n-runtime";
// const t = getT();
// ✅ Stattdessen TX-React Hook verwenden (kommt aus TXProvider in app/*/layout)
import { useT } from "@transifex/react";

type LeftSidebarProps = {
  value: boolean;
  setValue?: any;
  smallSidebar?: boolean;
  visibleRightSidebar?: boolean;
};

const LeftSidebar = ({
  value,
  setValue,
  smallSidebar,
  visibleRightSidebar
}: LeftSidebarProps) => {
  const t = useT(); // ✅ jetzt reaktiver i18n-Context (de/fr/en) im Client

  const [visibleSearch, setVisibleSearch] = useState<boolean>(false);
  const [visibleSettings, setVisibleSettings] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener("keydown", handleWindowKeyDown);
    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWindowKeyDown = (event: any) => {
    if (event.metaKey && event.key === "f") {
      event.preventDefault();
      setVisibleSearch(true);
    }
  };

  // ✅ Diese Menütitel werden jetzt über den TX-Context übersetzt
  const navigation = [
    {
      title: t("Chats"),
      icon: "chat",
      color: "fill-accent-2",
      url: "/"
    },
    {
      title: t("Search"),
      icon: "search",
      color: "fill-primary-2",
      onClick: () => setVisibleSearch(true)
    },
    {
      title: t("Manage subscription"),
      icon: "card",
      color: "fill-accent-4",
      url: "/pricing"
    },
    {
      title: t("Updates & FAQ"),
      icon: "barcode",
      color: "fill-accent-1",
      url: "/updates-and-faq"
    },
    {
      title: t("Settings"),
      icon: "settings",
      color: "fill-accent-3",
      onClick: () => setVisibleSettings(true)
    }
  ];

  const handleClick = () => {
    setValue(!value);
    smallSidebar && value ? disablePageScroll() : enablePageScroll();
  };

  return (
    <>
      <div
        className={twMerge(
          `fixed z-20 top-0 left-0 bottom-0 flex flex-col pt-30 px-4 bg-n-7 md:invisible md:opacity-0 md:transition-opacity ${
            value ? "w-24 pb-38 md:w-16 md:px-0 md:pb-30" : "w-80 pb-58"
          } ${visibleRightSidebar && "md:visible md:opacity-100"}`
        )}
      >
        <div
          className={`absolute top-0 right-0 left-0 flex items-center h-30 pl-7 pr-6 ${
            value ? "justify-center md:px-4" : "justify-between"
          }`}
        >
          {!value && <Logo />}
          <button className="group tap-highlight-color" onClick={handleClick}>
            <Icon
              className="fill-n-4 transition-colors group-hover:fill-n-3"
              name={value ? "toggle-on" : "toggle-off"}
            />
          </button>
        </div>

        <div class

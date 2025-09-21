// components/Layout/index.tsx
// v1.1 — Fix: Overlay rendert erst nach Mount (Hydration-Safe) + Icon "close" nicht übersetzen
import { useEffect, useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { enablePageScroll, clearQueueScrollLocks } from "scroll-lock";
import Head from "next/head";
import { useMediaQuery } from "react-responsive";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import Icon from "@/components/Icon";
import Burger from "./Burger";

// ✅ i18n: Title weiterhin per _, aber KEINE Übersetzung von Icon-Namen
import { _ } from "@/lib/i18n/_";
const t = _;

type LayoutProps = {
  smallSidebar?: boolean;
  hideRightSidebar?: boolean;
  backUrl?: string;
  children: React.ReactNode;
};

const Layout = ({
  smallSidebar,
  hideRightSidebar,
  backUrl,
  children,
}: LayoutProps) => {
  // Sichtbarkeit linke Sidebar (kompakt oder groß)
  const [visibleSidebar, setVisibleSidebar] = useState<any>(smallSidebar || false);
  // Sichtbarkeit rechte Sidebar (Notifications/History)
  const [visibleRightSidebar, setVisibleRightSidebar] = useState<boolean>(false);

  // ⚠️ Hydration-Flag: erst nach erstem Effect ist der Client-Status stabil
  // Hintergrund: react-responsive gibt vor Hydration noch keinen korrekten Wert,
  // dadurch flackern Klassen/States → Overlay war kurz „aktiv“ und überdeckte das +.
  const [mounted, setMounted] = useState(false);

  const isDesktop = useMediaQuery({ query: "(max-width: 1179px)" });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Overlay-Klick schließt Overlays / stellt linken Zustand her
  const handleClickOverlay = () => {
    setVisibleSidebar(true);
    setVisibleRightSidebar(false);
    clearQueueScrollLocks();
    enablePageScroll();
  };

  // Sidebar-Layout an Viewport anpassen
  useEffect(() => {
    setVisibleSidebar(smallSidebar || isDesktop);
  }, [isDesktop, smallSidebar]);

  // ✅ Nur wenn der Client „stabil“ ist, darf das Overlay überhaupt gerendert werden.
  // Dadurch verschwindet das kurzzeitig „sichtbare/aktive“ Overlay nach Hydration
  // (was zuvor den + Button verdeckte).
  const shouldShowOverlay =
    mounted && (((!visibleSidebar && !!smallSidebar) as boolean) || visibleRightSidebar);

  return (
    <>
      <Head>
        {/* Title bleibt i18n-fähig */}
        <title>{t("Brainwave")}</title>
      </Head>

      <div
        className={`pr-6 bg-n-7 md:p-0 md:bg-n-1 dark:md:bg-n-6 md:overflow-hidden ${
          visibleSidebar
            ? "pl-24 md:pl-0"
            : smallSidebar
            ? "pl-24 md:pl-0"
            : "pl-80 xl:pl-24 md:pl-0"
        }`}
      >
        <LeftSidebar
          value={visibleSidebar}
          setValue={setVisibleSidebar}
          visibleRightSidebar={visibleRightSidebar}
          smallSidebar={smallSidebar}
        />

        <div
          className={`flex py-6 md:py-0 ${
            hideRightSidebar ? "min-h-screen min-h-screen-ios" : "h-screen h-screen-ios"
          }`}
        >
          <div
            className={`relative flex grow max-w-full bg-n-1 rounded-[1.25rem] md:rounded-none dark:bg-n-6 ${
              !hideRightSidebar && "pr-[22.5rem] 2xl:pr-80 lg:pr-0"
            }`}
          >
            <div
              className={`relative flex flex-col grow max-w-full ${
                !hideRightSidebar && "md:pt-18"
              }`}
            >
              {!hideRightSidebar && (
                <Burger
                  className={`${!visibleSidebar && "md:hidden"}`}
                  visibleRightSidebar={visibleRightSidebar}
                  onClick={() => setVisibleRightSidebar(!visibleRightSidebar)}
                />
              )}

              {hideRightSidebar && smallSidebar && (
                <Link
                  className="absolute top-6 right-6 flex justify-center items-center w-10 h-10 border-2 border-n-4/25 rounded-full text-0 transition-colors hover:border-transparent hover:bg-n-4/25"
                  href={backUrl || "/"}
                >
                  {/* ❌ NICHT übersetzen: Icon-Namen sind Keys im Sprite/Set */}
                  <Icon className="fill-n-4" name="close" />
                </Link>
              )}

              {children}
            </div>

            {!hideRightSidebar && (
              <RightSidebar
                className={`${!visibleSidebar && "md:translate-x-64 md:before:absolute md:before:z-30 md:before:inset-0"}`}
                visible={visibleRightSidebar}
              />
            )}
          </div>
        </div>

        {/* 🔒 Overlay rendert NUR wenn wirklich benötigt (nach Mount).
            Dadurch blockiert es nicht mehr kurz den Input-Bereich mit dem + Symbol. */}
        {shouldShowOverlay && (
          <div
            className={twMerge(
              "fixed inset-0 z-10 bg-n-7/80 md:hidden visible opacity-100"
            )}
            onClick={handleClickOverlay}
          />
        )}
      </div>
    </>
  );
};

export default Layout;

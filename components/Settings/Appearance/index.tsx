import { useState, useMemo, useCallback, useEffect } from "react";
import { useColorMode } from "@chakra-ui/color-mode";
import { twMerge } from "tailwind-merge";
import Image from "@/components/Image";
import Select from "@/components/Select";
import { useI18n } from "@/lib/i18n/I18nContext";

/**
 * ============================================================================
 * Appearance Settings
 * Version: v1.1 – 2026-02-17
 * Notes:
 * - SSR-safe: render after mount to avoid Chakra colorMode hydration mismatch.
 * - Stable selection IDs for language.
 * ============================================================================
 */

type LanguageItem = { id: string; title: string };

type AppearanceProps = Record<string, never>;

const Appearance = ({}: AppearanceProps) => {
  const { locale, t } = useI18n();
  const { colorMode, setColorMode } = useColorMode();

  // SSR-safe: Chakra colorMode may differ between SSR and client (localStorage)
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const languages: LanguageItem[] = useMemo(
    () => [
      { id: "en-US", title: t("English (United States)") },
      { id: "fr", title: t("French") },
      { id: "uk", title: t("Ukrainian") },
    ],
    [locale, t]
  );

  // ✅ Store stable ID
  const [languageId, setLanguageId] = useState<string>("en-US");

  const language = useMemo(
    () => languages.find((l) => l.id === languageId) ?? languages[0],
    [languages, languageId]
  );

  // ✅ If current selection disappears, fall back safely
  useEffect(() => {
    if (languages.length > 0 && !languages.some((l) => l.id === languageId)) {
      setLanguageId(languages[0].id);
    }
  }, [languages, languageId]);

  const handleSetLightMode = useCallback(() => {
    setColorMode("light");
  }, [setColorMode]);

  const handleSetDarkMode = useCallback(() => {
    setColorMode("dark");
  }, [setColorMode]);

  const items = useMemo(
    () => [
      {
        id: "light",
        title: t("Light mode"),
        image: "/images/theme-light.svg",
        active: colorMode === "light",
        onClick: handleSetLightMode,
      },
      {
        id: "dark",
        title: t("Dark mode"),
        image: "/images/theme-dark.svg",
        active: colorMode === "dark",
        onClick: handleSetDarkMode,
      },
    ],
    [t, colorMode, handleSetLightMode, handleSetDarkMode]
  );

  // Before hydration: render stable skeleton (prevents text/active-state mismatch)
  if (!mounted) {
    return (
      <>
        <div className="mb-8 h4">{t("Appearance")}</div>
        <div className="mb-5 base1 font-semibold">{t("Appearance")}</div>
        <div className="flex mb-8 pr-12 space-x-8 md:pr-0">
          <div className="basis-1/2 p-3 border-4 border-transparent bg-n-2 rounded-2xl h-[8.5rem] dark:bg-n-6" />
          <div className="basis-1/2 p-3 border-4 border-transparent bg-n-2 rounded-2xl h-[8.5rem] dark:bg-n-6" />
        </div>
        <div className="flex items-center md:block">
          <div className="mr-auto base1 font-semibold md:mb-4">
            {t("Primary language")}
          </div>
          <div className="min-w-[13.125rem] h-[3.25rem] rounded-xl bg-n-3/75 dark:bg-n-6" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8 h4">{t("Appearance")}</div>
      <div className="mb-5 base1 font-semibold">{t("Appearance")}</div>

      <div className="flex mb-8 pr-12 space-x-8 md:pr-0">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={twMerge(
              "basis-1/2 p-3 border-4 border-transparent bg-n-2 rounded-2xl text-left transition-colors dark:bg-n-6 dark:text-n-3/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-1 focus-visible:ring-offset-2",
              item.active &&
                "bg-transparent border-primary-1 text-n-6/50 dark:text-n-1 dark:bg-transparent"
            )}
            onClick={item.onClick}
            aria-pressed={item.active}
            aria-label={item.title}
          >
            <div className="mb-3">
              <Image
                className="w-full rounded-xl"
                src={item.image}
                width={128}
                height={80}
                alt=""
              />
            </div>
            {item.title}
          </button>
        ))}
      </div>

      <div className="flex items-center md:block">
        <div className="mr-auto base1 font-semibold md:mb-4">
          {t("Primary language")}
        </div>
        <Select
          className="min-w-[13.125rem]"
          classButton="bg-n-3/75 dark:bg-n-6 dark:shadow-[inset_0_0_0_0.0625rem_#232627]"
          items={languages}
          value={language}
          onChange={(item) => item && setLanguageId(String(item.id))}
          up
        />
      </div>
    </>
  );
};

export default Appearance;

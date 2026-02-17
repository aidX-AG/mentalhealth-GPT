import { useEffect, useMemo, useState } from "react";
import { useColorMode } from "@chakra-ui/color-mode";
import { twMerge } from "tailwind-merge";
import Icon from "@/components/Icon";
import { useTranslation } from "@/lib/i18n/I18nContext";

type ToggleThemeProps = {
  visible?: boolean;
};

const ToggleTheme = ({ visible }: ToggleThemeProps) => {
  const { colorMode, setColorMode } = useColorMode();

  // ✅ Our hook returns t function directly (not { t })
  const t = useTranslation();

  // ✅ SSR-safe: do not render colorMode-dependent UI before mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isCompact = !!visible;

  // ✅ Stable keys + stable array
  const items = useMemo(
    () => [
      {
        key: "light" as const,
        title: t("Light"),
        icon: "sun",
        active: colorMode === "light",
        onClick: () => setColorMode("light"),
      },
      {
        key: "dark" as const,
        title: t("Dark"),
        icon: "moon",
        active: colorMode === "dark",
        onClick: () => setColorMode("dark"),
      },
    ],
    [colorMode, setColorMode, t]
  );

  // ✅ Excellence: keep DOM shape stable; only change styling
  // Before mount: render same container + two disabled buttons (no text mismatch, no localStorage mismatch)
  if (!mounted) {
    return (
      <div
        className={twMerge(
          isCompact
            ? "w-full h-16 md:w-8 md:h-8"
            : "relative flex w-full p-1 bg-n-6 rounded-xl"
        )}
        aria-hidden="true"
      >
        {!isCompact && (
          <>
            <div className="h-10 basis-1/2 rounded-[0.625rem]" />
            <div className="h-10 basis-1/2 rounded-[0.625rem]" />
          </>
        )}
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        !isCompact &&
          "relative flex w-full p-1 bg-n-6 rounded-xl " +
            "before:absolute before:left-1 before:top-1 before:bottom-1 " +
            "before:w-[calc(50%-0.25rem)] before:bg-n-7 before:rounded-[0.625rem] before:transition-all",
        !isCompact && colorMode === "dark" && "before:translate-x-full"
      )}
      role="group"
      aria-label={t("Theme")}
    >
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={item.onClick}
          aria-pressed={item.active}
          aria-label={item.title}
          className={twMerge(
            "relative z-1 group flex justify-center items-center",
            isCompact
              ? twMerge(
                  "w-full h-16 rounded-xl bg-n-6 md:w-8 md:h-8 md:mx-auto",
                  item.active && "hidden"
                )
              : twMerge(
                  "h-10 basis-1/2 base2 font-semibold text-n-4 transition-colors hover:text-n-1",
                  item.active && "text-n-1"
                )
          )}
        >
          <Icon
            name={item.icon}
            className={twMerge(
              "fill-n-4 transition-colors group-hover:fill-n-1",
              !isCompact && "mr-3",
              item.active && !isCompact && "fill-n-1"
            )}
          />
          {!isCompact && item.title}
        </button>
      ))}
    </div>
  );
};

export default ToggleTheme;

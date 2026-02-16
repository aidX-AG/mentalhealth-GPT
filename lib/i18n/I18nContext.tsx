// lib/i18n/I18nContext.tsx
// I18n Context for SSR-safe translation in Client Components
// Provides locale + dictionary via React Context (works both server & client side)

"use client";

import { createContext, useContext, ReactNode } from "react";

export type Locale = "de" | "fr" | "en" | "es";

type I18nContextType = {
  locale: Locale;
  dict: Record<string, string>;
};

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  dict: {},
});

export type I18nProviderProps = {
  locale: Locale;
  dict: Record<string, string>;
  children: ReactNode;
};

export function I18nProvider({ locale, dict, children }: I18nProviderProps) {
  // 🔴 Safety: ensure dict is never undefined (fallback to empty object)
  const safeDict = dict ?? {};
  return (
    <I18nContext.Provider value={{ locale, dict: safeDict }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access current locale
 * Works in both SSR and client (as long as I18nProvider is in tree)
 */
export function useLocale(): Locale {
  const { locale } = useContext(I18nContext);
  return locale;
}

/**
 * Hook to access translation function
 * Works in both SSR and client (as long as I18nProvider is in tree)
 *
 * Usage: const t = useTranslation(); t("nav.search")
 * 🔴 Safety: uses optional chaining to prevent crashes if dict is undefined
 */
export function useTranslation() {
  const { dict } = useContext(I18nContext);
  return (key: string): string => dict?.[key] ?? key;
}

/**
 * Hook to access both locale and translation function
 * 🔴 Safety: uses optional chaining to prevent crashes if dict is undefined
 */
export function useI18n() {
  const { locale, dict } = useContext(I18nContext);
  const t = (key: string): string => dict?.[key] ?? key;
  return { locale, t };
}

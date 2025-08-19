// app/[locale]/layout.tsx
import type { Metadata } from "next";
import TxClientProvider from "../TxClientProvider"; // dein Client-Provider für Transifex
import { Suspense } from "react";
import GlobalLoading from "../GlobalLoading";       // optionaler, schon vorhandener Loader
import { Providers } from "../providers";           // deine bestehenden globalen Providers

// Statische Params für SSG: baue /, /de, /fr
export async function generateStaticParams() {
  return [{ locale: "en" }, { locale: "de" }, { locale: "fr" }];
}

// Optionale, einfache per-locale Metadaten (Root-SEO bleibt im Root-Layout)
export const metadata: Metadata = {
  title: "mentalhealthGPT",
};

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // ⚠️ Kein <html> hier – das ist Sache des Root-Layouts.
  // Wir hängen hier NUR den Transifex-Provider und deine globalen Providers davor.
  return (
    <Suspense fallback={<GlobalLoading />}>
      <TxClientProvider locale={params.locale}>
        <Providers>{children}</Providers>
      </TxClientProvider>
    </Suspense>
  );
}

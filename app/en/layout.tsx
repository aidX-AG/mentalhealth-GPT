// app/en/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import GlobalLoading from "../GlobalLoading";
import { loadMessages } from "@/lib/i18n-static";
import Script from "next/script";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  const dict = loadMessages("en");

  return (
    <>
      {/* ⚠️  Deprecated: Script ist nicht mehr nötig, da Providers locale+dict direkt bekommt */}
      {/* Wird beibehalten für Abwärtskompatibilität mit altem _() code (falls noch vorhanden) */}
      <Script
        id="i18n-en"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__I18N__={locale:"en",dict:${JSON.stringify(dict)}};`,
        }}
      />
      <Suspense fallback={<GlobalLoading />}>
        <Providers locale="en" dict={dict}>{children}</Providers>
      </Suspense>
    </>
  );
}

// app/de/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import GlobalLoading from "../GlobalLoading";
import { loadMessages } from "@/lib/i18n-static";
import Script from "next/script";

export default function GermanLayout({ children }: { children: React.ReactNode }) {
  const dict = loadMessages("de");

  return (
    <>
      {/* läuft vor Hydration, ohne zweites <html>/<head> zu rendern */}
      <Script
        id="i18n-de"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__I18N__={locale:"de",dict:${JSON.stringify(dict)}};`,
        }}
      />
      <Suspense fallback={<GlobalLoading />}>
        <Providers>{children}</Providers>
      </Suspense>
    </>
  );
}

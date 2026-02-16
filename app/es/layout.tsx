// app/es/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import GlobalLoading from "../GlobalLoading";
import { loadMessages } from "@/lib/i18n-static";
import Script from "next/script";

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  const dict = loadMessages("es");

  return (
    <>
      {/* läuft vor Hydration, ohne zweites <html>/<head> zu rendern */}
      <Script
        id="i18n-es"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__I18N__={locale:"es",dict:${JSON.stringify(dict)}};`,
        }}
      />
      <Suspense fallback={<GlobalLoading />}>
        <Providers locale="es" dict={dict}>{children}</Providers>
      </Suspense>
    </>
  );
}

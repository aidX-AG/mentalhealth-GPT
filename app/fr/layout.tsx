// app/fr/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import GlobalLoading from "../GlobalLoading";
import { loadMessages } from "@/lib/i18n-static";
import Script from "next/script";

export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  const dict = loadMessages("fr");

  return (
    <>
      <Script
        id="i18n-fr"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `window.__I18N__={locale:"fr",dict:${JSON.stringify(dict)}};`,
        }}
      />
      <Suspense fallback={<GlobalLoading />}>
        <Providers locale="fr" dict={dict}>{children}</Providers>
      </Suspense>
    </>
  );
}

// app/fr/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import TxClientProvider from "../TxClientProvider";
import GlobalLoading from "../GlobalLoading";

// ✅ i18n (Server-Runtime)
import { loadMessages, makeT } from "@/lib/i18n-static";
import { setT } from "@/lib/i18n-runtime";

export default function FrenchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1) Wörterbuch laden & T für SSR setzen (Server)
  const dict = loadMessages("fr");
  const t = makeT(dict);
  setT(t);

  // 2) Wörterbuch für den Client einbetten (damit getT() im Browser FR liefert)
  const inlineI18N = `
    (function () {
      try {
        window.__I18N__ = { locale: "fr", dict: ${JSON.stringify(dict)} };
        document.documentElement.setAttribute("lang", "fr");
        document.documentElement.setAttribute("dir", "ltr");
      } catch (e) {}
    })();
  `;

  return (
    <html lang="fr">
      <head>
        {/* Übergibt das Wörterbuch an den Client */}
        <script dangerouslySetInnerHTML={{ __html: inlineI18N }} />
      </head>
      <body>
        <Suspense fallback={<GlobalLoading />}>
          {/* Hält TX/Locale im Client in Sync */}
          <TxClientProvider locale="fr">
            <Providers>{children}</Providers>
          </TxClientProvider>
        </Suspense>
      </body>
    </html>
  );
}

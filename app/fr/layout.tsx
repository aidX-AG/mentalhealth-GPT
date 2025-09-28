// app/fr/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import TxClientProvider from "../TxClientProvider";
import GlobalLoading from "../GlobalLoading";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function FrenchLayout({ children }: { children: React.ReactNode }) {
  const dict = loadMessages("fr");
  const t = makeT(dict); // optional für <meta>

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
        <script dangerouslySetInnerHTML={{ __html: inlineI18N }} />
      </head>
      <body>
        <Suspense fallback={<GlobalLoading />}>
          <TxClientProvider locale="fr">
            <Providers>{children}</Providers>
          </TxClientProvider>
        </Suspense>
      </body>
    </html>
  );
}

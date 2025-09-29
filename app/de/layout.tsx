// app/de/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import GlobalLoading from "../GlobalLoading";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function GermanLayout({ children }: { children: React.ReactNode }) {
  // Wörterbuch laden (Server)
  const dict = loadMessages("de");
  const t = makeT(dict); // optional für <meta> etc. (falls nötig)

  // Wörterbuch an den Client injizieren
  const inlineI18N = `
    (function () {
      try {
        window.__I18N__ = { locale: "de", dict: ${JSON.stringify(dict)} };
        document.documentElement.setAttribute("lang", "de");
        document.documentElement.setAttribute("dir", "ltr");
      } catch (e) {}
    })();
  `;

  return (
    <html lang="de">
      <head>
        <script dangerouslySetInnerHTML={{ __html: inlineI18N }} />
        {/* Beispiel: Wenn du t() für Meta brauchst:
        <meta name="description" content={t("Expert AI for mental health – secure, private, and scientifically validated")} />
        */}
      </head>
      <body>
        <Suspense fallback={<GlobalLoading />}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}

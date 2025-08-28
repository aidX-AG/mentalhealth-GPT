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
  // Französisch setzen
  const t = makeT(loadMessages("fr"));
  setT(t);

  return (
    <html lang="fr">
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

// app/de/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import TxClientProvider from "../TxClientProvider";
import GlobalLoading from "../GlobalLoading";

// ✅ i18n (Server-Runtime)
import { loadMessages, makeT } from "@/lib/i18n-static";
import { setT } from "@/lib/i18n-runtime";

export default function GermanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Deutsch setzen
  const t = makeT(loadMessages("de"));
  setT(t);

  return (
    <html lang="de">
      <body>
        <Suspense fallback={<GlobalLoading />}>
          <TxClientProvider locale="de">
            <Providers>{children}</Providers>
          </TxClientProvider>
        </Suspense>
      </body>
    </html>
  );
}

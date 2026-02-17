// app/es/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import GlobalLoading from "../GlobalLoading";
import { loadMessages } from "@/lib/i18n-static";

export default function SpanishLayout({ children }: { children: React.ReactNode }) {
  const dict = loadMessages("es");

  return (
    <Suspense fallback={<GlobalLoading />}>
      <Providers locale="es" dict={dict}>{children}</Providers>
    </Suspense>
  );
}

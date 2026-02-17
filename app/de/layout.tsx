// app/de/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import GlobalLoading from "../GlobalLoading";
import { loadMessages } from "@/lib/i18n-static";

export default function GermanLayout({ children }: { children: React.ReactNode }) {
  const dict = loadMessages("de");

  return (
    <Suspense fallback={<GlobalLoading />}>
      <Providers locale="de" dict={dict}>{children}</Providers>
    </Suspense>
  );
}

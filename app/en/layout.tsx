// app/en/layout.tsx
import { Suspense } from "react";
import { Providers } from "../providers";
import GlobalLoading from "../GlobalLoading";
import { loadMessages } from "@/lib/i18n-static";

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  const dict = loadMessages("en");

  return (
    <Suspense fallback={<GlobalLoading />}>
      <Providers locale="en" dict={dict}>{children}</Providers>
    </Suspense>
  );
}

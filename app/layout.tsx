// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Karla } from "next/font/google";
import "./globals.css";
import type { Locale } from "@/lib/i18n-static";

// ✅ Serverseitige i18n (nutzt eure aus PO generierten JSONs)
import { loadMessages, makeT } from "@/lib/i18n-static";

const inter = Inter({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-inter",
});
const karla = Karla({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-karla",
});

// ✅ Helper: Locale sicher bestimmen
function getSafeLocale(params?: { locale?: string }): Locale {
  const raw = params?.locale || "en";
  if (raw.startsWith("de")) return "de";
  if (raw.startsWith("fr")) return "fr";
  return "en";
}

// ✅ generateMetadata bekommt params (für Locale)
export async function generateMetadata({
  params,
}: {
  params?: { locale?: string };
}): Promise<Metadata> {
  const lang = getSafeLocale(params);
  const t = makeT(loadMessages(lang)); // serverseitige Übersetzung

  return {
    title: {
      default: t("homepage.sections.brand"), // ✅ Korrigiert
      template: `%s | ${t("homepage.sections.brand")}`, // ✅ Korrigiert
    },
    description: t("home.sections.tagline"),
    alternates: {
      languages: { de: "/de", fr: "/fr", en: "/" },
    },
    openGraph: {
      title: t("homepage.sections.brand"), // ✅ Korrigiert
      description: t("homepage.sections.tagline"),
      url: "https://www.mentalhealth-gpt.ch",
      type: "website",
      images: ["/images/logo.webp"],
    },
    metadataBase: new URL("https://www.mentalhealth-gpt.ch"),
  };
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: { locale?: string };
}>) {
  // ⬇️ Strikt als Locale — vermeidet TS-Fehler
  const lang = getSafeLocale(params);

  return (
    <html lang={lang} suppressHydrationWarning>
      {/* ✅ All meta tags handled by generateMetadata() above - removed manual duplicates */}
      <body
        suppressHydrationWarning
        className={`${karla.variable} ${inter.variable} bg-white text-black dark:bg-n-7 dark:text-n-1 font-sans text-[1rem] leading-6 -tracking-[.01em] antialiased`}
      >
        {/* 🔴 NO Providers here! Language Layouts (de/fr/es/en) provide them */}
        {children}
      </body>
    </html>
  );
}

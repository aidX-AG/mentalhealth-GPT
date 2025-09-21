// app/layout.tsx
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Inter, Karla } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import GlobalLoading from "./GlobalLoading";

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

// ✅ generateMetadata bekommt params (für Locale)
export async function generateMetadata({
  params,
}: {
  params?: { locale?: string };
}): Promise<Metadata> {
  const lang = params?.locale || "en";
  const t = makeT(loadMessages(lang)); // serverseitige Übersetzung

  return {
    title: {
      default: "mentalhealthGPT",
      template: "%s | mentalhealthGPT",
    },
    description: t(
      "Expert AI for mental health – secure, private, and scientifically validated"
    ),
    alternates: {
      languages: {
        de: "/de",
        fr: "/fr",
        en: "/",
      },
    },
    openGraph: {
      title: "mentalhealthGPT",
      description: t(
        "Expert AI for mental health – secure, private, and scientifically validated"
      ),
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
  const lang = params?.locale || "en";
  const t = makeT(loadMessages(lang)); // serverseitiges t() für <head>

  return (
    <html lang={lang}>
      <head>
        {/* Fallback-Script, falls jemand direkt /de oder /fr unter diesem Layout öffnet */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var seg = (location.pathname.split('/')[1]||'').toLowerCase();
                  var l = (seg === 'de' || seg === 'fr') ? seg : 'en';
                  document.documentElement.setAttribute('lang', l);
                } catch(e){}
              })();
            `,
          }}
        />

        {/* ✅ Attribut-Namen bleiben literale Strings; nur Inhalte übersetzen */}
        <meta
          name="description"
          content={t(
            "Expert AI for mental health – secure, private, and scientifically validated"
          )}
        />
        <meta property="og:title" content="mentalhealthGPT" />
        <meta
          property="og:description"
          content={t(
            "Expert AI for mental health – secure, private, and scientifically validated"
          )}
        />
        <meta property="og:image" content="/images/logo.webp" />
        <meta property="og:url" content="https://www.mentalhealth-gpt.ch" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${karla.variable} ${inter.variable} bg-white text-black dark:bg-n-7 dark:text-n-1 font-sans text-[1rem] leading-6 -tracking-[.01em] antialiased`}
      >
        <Suspense fallback={<GlobalLoading />}>
          {/* ⛔️ TxClientProvider entfernt – bei gettext nicht nötig */}
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}

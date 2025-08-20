// app/layout.tsx
import type { Metadata } from "next";
import { Providers } from "./providers";
import { Inter, Karla } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import TxClientProvider from "./TxClientProvider";
import GlobalLoading from "./GlobalLoading";

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

// Dynamische Metadaten (mit hreflang-Alternates)
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "mentalhealthGPT",
      template: "%s | mentalhealthGPT",
    },
    description:
      "Expert AI for mental health – secure, private, and scientifically validated",
    alternates: {
      languages: {
        de: "/de",
        fr: "/fr",
        en: "/",
      },
    },
    openGraph: {
      title: "mentalhealthGPT",
      description:
        "Expert AI for mental health – secure, private, and scientifically validated",
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

  return (
    <html>
      <head>
        {/* Setze <html lang> früh basierend auf Pfad (/de, /fr) */}
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

        {/* SEO + OG Metadata (bewusst unverändert gelassen) */}
        <meta
          name="description"
          content="Expert AI for mental health – secure, private, and scientifically validated"
        />
        <meta property="og:title" content="mentalhealthGPT" />
        <meta
          property="og:description"
          content="Expert AI for mental health – secure, private, and scientifically validated"
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
          <TxClientProvider locale={lang}>
            <Providers>{children}</Providers>
          </TxClientProvider>
        </Suspense>
      </body>
    </html>
  );
}

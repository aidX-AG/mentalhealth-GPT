import { t } from '@transifex/native';

// app/layout.tsx
import type { Metadata } from "next";

import { Providers } from "./providers";
import { Inter, Karla } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import TxClientProvider from "./TxClientProvider";
import GlobalLoading from "./GlobalLoading";

// ✅ i18n (Server-Runtime)
import { loadMessages, makeT } from "@/lib/i18n-static";

import { setT } from "@/lib/i18n-runtime";
import { getT } from "@/lib/i18n-runtime";
const t = getT();

const inter = Inter({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-inter"
});

const karla = Karla({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "block",
  variable: "--font-karla"
});

// Dynamische Metadaten (mit hreflang-Alternates)
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: {
      default: "mentalhealthGPT",
      template: "%s | mentalhealthGPT"
    },
    description: t(
      'layout_tsx.body.text.expert_ai_mental_health_secure_private_scientifically_validated_8938',
      'Expert AI for mental health – secure, private, and scientifically validated'
    ),
    alternates: {
      languages: {
        de: "/de",
        fr: "/fr",
        en: "/"
      }
    },
    openGraph: {
      title: t('layout_tsx.body.text.mentalhealthgpt_0e4c', 'mentalhealthGPT'),
      description: t(
        'layout_tsx.body.text.expert_ai_mental_health_secure_private_scientifically_validated_75a1',
        'Expert AI for mental health – secure, private, and scientifically validated'
      ),
      url: "https://www.mentalhealth-gpt.ch",
      type: "website",
      images: ["/images/logo.webp"]
    },
    metadataBase: new URL("https://www.mentalhealth-gpt.ch")
  };
}

export default function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params?: {
    locale?: string;
  };
}>) {
  // Root ist EN
  const lang = params?.locale || "en";

  // ✅ Server-seitig die Übersetzungsfunktion für EN setzen
  const t = makeT(loadMessages("en"));
  setT(t);
  return (
    <html lang={lang}>
        <head>
          {/* Fallback-Script, falls jemand direkt /de oder /fr unter diesem Layout öffnet */}
          <script dangerouslySetInnerHTML={{
          __html: `
                (function(){
                  try {
                    var seg = (location.pathname.split('/')[1]||'').toLowerCase();
                    var l = (seg === 'de' || seg === 'fr') ? seg : 'en';
                    document.documentElement.setAttribute('lang', l);
                  } catch(e){}
                })();
              `
        }} />

          {/* SEO + OG Metadata (bewusst unverändert gelassen) */}
          <meta name={t('layout_tsx.body.text.description_e5d8', 'description')} content={t(
            'layout_tsx.body.text.expert_ai_mental_health_secure_private_scientifically_validated_5836',
            'Expert AI for mental health – secure, private, and scientifically validated'
          )} />
          <meta property="og:title" content={t('layout_tsx.body.text.mentalhealthgpt_1775', 'mentalhealthGPT')} />
          <meta property="og:description" content={t(
            'layout_tsx.body.text.expert_ai_mental_health_secure_private_scientifically_validated_f1df',
            'Expert AI for mental health – secure, private, and scientifically validated'
          )} />
          <meta property="og:image" content={t('layout_tsx.body.text.images_logo_webp_5384', '/images/logo.webp')} />
          <meta property="og:url" content="https://www.mentalhealth-gpt.ch" />
          <meta property="og:type" content={t('layout_tsx.body.text.website_ec69', 'website')} />
          <meta name={t('layout_tsx.body.text.twitter_card_23e0', 'twitter:card')} content={t('layout_tsx.body.text.summary_large_image_d645', 'summary_large_image')} />
          <meta name={t('layout_tsx.body.text.theme_color_0bc2', 'theme-color')} content={t('layout_tsx.body.text.ffffff_ef12', '#ffffff')} />
          <meta name={t('layout_tsx.body.text.viewport_86ed', 'viewport')} content={t(
            'layout_tsx.body.text.width_device_width_initial_scale_1_5284',
            'width=device-width, initial-scale=1'
          )} />
        </head>
        <body className={`${karla.variable} ${inter.variable} bg-white text-black dark:bg-n-7 dark:text-n-1 font-sans text-[1rem] leading-6 -tracking-[.01em] antialiased`}>
          <Suspense fallback={<GlobalLoading />}>
            <TxClientProvider locale={lang}>
              <Providers>{children}</Providers>
            </TxClientProvider>
          </Suspense>
        </body>
      </html>
  );
}
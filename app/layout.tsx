import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Inter, Karla } from "next/font/google";
import "./globals.css";
import ClientProviders from "./ClientProviders";
import { Providers } from "./providers";

const inter = Inter({ weight: ["500","600","700"], subsets: ["latin"], display: "block", variable: "--font-inter" });
const karla = Karla({ weight: ["400","700"], subsets: ["latin"], display: "block", variable: "--font-karla" });

const LanguagePrompt = dynamic(() => import("@/components/I18n/LanguagePrompt"), { ssr: false });

export const metadata: Metadata = {
  title: "mentalhealthGPT",
  description: "Expert AI for mental health – secure, private, and scientifically validated",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        {/* setzt <html lang> VOR Hydration aus gespeicherter Sprache */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var l = localStorage.getItem('i18nextLng');
                if (l) document.documentElement.lang = l.split('-')[0].toLowerCase();
              } catch (e) {}
            `,
          }}
        />
        <meta property="og:title" content="mentalhealthGPT" />
        <meta property="og:description" content="Expert AI for mental health – secure, private, and scientifically validated" />
        <meta property="og:image" content="https://www.mentalhealth-gpt.ch/images/logo-960w.webp" />
        <meta property="og:image:width" content="960" />
        <meta property="og:image:height" content="960" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:url" content="https://www.mentalhealth-gpt.ch" />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body className={`${karla.variable} ${inter.variable} bg-n-1 dark:bg-n-7 font-sans text-[1rem] leading-6`}>
        <ClientProviders>
          <Providers>{children}</Providers>
          <LanguagePrompt />
        </ClientProviders>
        <noscript>JavaScript erforderlich</noscript>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Providers } from "./providers";
import { Inter, Karla } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "mentalhealthGPT",
  description: "Expert AI for mental health – secure, private, and scientifically validated",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* SEO + OG Metadata */}
        <meta name="description" content="Expert AI for mental health – secure, private, and scientifically validated" />
        <meta property="og:title" content="mentalhealthGPT" />
        <meta property="og:description" content="Expert AI for mental health – secure, private, and scientifically validated" />
        <meta property="og:image" content="/Logo_V_4_0.png" />
        <meta property="og:url" content="https://www.mentalhealth-gpt.ch" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Weglot Integration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var s=document.createElement("script");
                s.type="text/javascript";
                s.async=true;
                s.src="https://cdn.weglot.com/weglot.min.js";
                s.onload=function(){
                  Weglot.initialize({ api_key: "wg_d9cb54c80d40ded6bb70278dc06ee7f97" });
                };
                document.head.appendChild(s);
              })();
            `,
          }}
        />
      </head>
      <body className={`${karla.variable} ${inter.variable} bg-n-7 font-sans text-[1rem] leading-6 -tracking-[.01em] text-n-7 antialiased md:bg-n-1 dark:text-n-1 dark:md:bg-n-6`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

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
  description:
    "Expert AI for mental health – secure, private, and scientifically validated",
  openGraph: {
    title: "mentalhealthGPT",
    description:
      "Expert AI for mental health – secure, private, and scientifically validated",
    url: "https://www.mentalhealth-gpt.ch",
    type: "website",
    images: [
      {
        url: "/logo-1440w.webp",
        width: 1440,
        height: 960,
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "mentalhealthGPT",
    description:
      "Expert AI for mental health – secure, private, and scientifically validated",
    images: ["/logo-1440w.webp"],
  },
  metadataBase: new URL("https://www.mentalhealth-gpt.ch"),
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Weglot: Config VOR dem Script setzen (Subdirectories-ready) */}
        <script
          // NEXT_PUBLIC_WEGLOT_KEY in .env setzen: wg_...
          dangerouslySetInnerHTML={{
            __html: `window.WeglotConfig={api_key:'${process.env.NEXT_PUBLIC_WEGLOT_KEY}'};`,
          }}
        />
        <script src="https://cdn.weglot.com/weglot.min.js" async />

        {/* Basis-Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />

        {/* Fallback OG (zusätzlich zu metadata.openGraph) */}
        <meta property="og:image" content="/logo-1440w.webp" />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:width" content="1440" />
        <meta property="og:image:height" content="960" />
      </head>
      <body
        className={`${karla.variable} ${inter.variable} bg-n-7 font-sans text-[1rem] leading-6 -tracking-[.01em]`}
      >
        {/* Dynamische/PII-Bereiche im Code mit className="notranslate" markieren */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

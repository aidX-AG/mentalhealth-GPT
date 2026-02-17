// app/layout.tsx
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

// ✅ NO generateMetadata in root layout - each locale provides its own
// This prevents duplicate/conflicting meta tags from merging

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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

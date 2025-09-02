// components/Logo/index.tsx
// --------------------------------------------------------------------------
// [logo-link] v1.0.0 — 2025-09-02
// CHANGELOG:
// - v1.0.0: Link vom internen "/" auf externe URL https://aidx.ch geändert.
//           Alles andere bleibt unverändert.
// --------------------------------------------------------------------------

import Link from "next/link";
import Image from "@/components/Image";
import { getT } from "@/lib/i18n-runtime";
const t = getT();

type LogoProps = {
  className?: string;
  dark?: boolean;
};

const Logo = ({
  className = "",
  dark = false
}: LogoProps) => (
  // NUR HIER geändert: href -> "https://aidx.ch" (statt "/")
  // Alles andere unverändert (gleiche Klassen, gleiche Image-Props)
  <Link className={`flex w-[11.88rem] ${className}`} href="https://aidx.ch" target="_self">
    <Image
      className="w-full h-auto"
      src={dark ? "images/logo-dark" : "images/logo"}
      alt={t("aidX")}
      widths={[480, 960, 1440]}
      format="webp"
      fallbackFormat="jpg"
      basePath="/"
      width={190}
      height={40}
    />
  </Link>
);

export default Logo;

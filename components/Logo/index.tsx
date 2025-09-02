// components/Logo/index.tsx
// --------------------------------------------------------------------------
// [logo-link] v1.0.0 — 2025-09-02
// CHANGELOG:
// - v1.0.0: Link vom internen "/" auf externe URL https://aidx.ch geändert.
//           Alles andere bleibt unverändert.
// --------------------------------------------------------------------------

import Link from "next/link"; // bleibt importiert, falls anderswo noch genutzt
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
  // [GEÄNDERT] Statt <Link href="/"> → <a href="https://aidx.ch">
  <a
    className={`flex w-[11.88rem] ${className}`}
    href="https://aidx.ch"
    target="_self" // bewusst kein _blank → bleibt im gleichen Tab
    rel="noopener noreferrer"
  >
    <Image
      className="w-full h-auto"
      src={dark ? "images/logo-dark" : "images/logo"}
      alt={t("aidX")}
      widths={[400]}
      sizes="100vw"
    />
  </a>
);

export default Logo;

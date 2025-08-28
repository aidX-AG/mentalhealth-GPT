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
}: LogoProps) => <Link className={`flex w-[11.88rem] ${className}`} href="/">
    <Image className="w-full h-auto" src={dark ? "images/logo-dark" : "images/logo"} alt={t("aidX")} widths={[480, 960, 1440]} format="webp" fallbackFormat="jpg" basePath="/" width={190} height={40} />
  </Link>;
export default Logo;
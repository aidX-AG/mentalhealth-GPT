import Link from "next/link";
import Image from "@/components/Image";

type LogoProps = {
  className?: string;
  dark?: boolean;
};

const Logo = ({ className = "", dark = false }: LogoProps) => (
  <Link className={`flex w-[11.88rem] ${className}`} href="/">
    <Image
      className="w-full h-auto"
      src={dark ? "images/logo-dark" : "images/logo"}
      alt="aidX"
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

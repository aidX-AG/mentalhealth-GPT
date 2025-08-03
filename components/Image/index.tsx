import { useState } from "react";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sources?: {
    src: string;
    width: number;
  }[];
}

const Image = ({
  className = "",
  src,
  alt,
  width,
  height,
  sources = [],
  ...rest
}: ResponsiveImageProps) => {
  const [loaded, setLoaded] = useState(false);

  // Erzeuge srcSet automatisch, falls Quellen vorhanden
  const srcSet = sources.length
    ? sources.map((s) => `${s.src} ${s.width}w`).join(", ")
    : undefined;

  return (
    <img
      className={`inline-block align-top opacity-0 transition-opacity ${
        loaded ? "opacity-100" : ""
      } ${className}`}
      src={src}
      srcSet={srcSet}
      sizes="(max-width: 768px) 100vw, 768px"
      alt={alt}
      width={width}
      height={height}
      onLoad={() => setLoaded(true)}
      {...rest}
    />
  );
};

export default Image;

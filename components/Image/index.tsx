import { useState } from "react";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;               // Basis ohne Endung, z. B. "/images/hero"
  alt: string;
  widths?: number[];         // Breakpoints, z. B. [480, 960, 1440]
  fill?: boolean;
  format?: "webp" | "jpg" | "png"; // Primärformat (webp bevorzugt)
  fallbackFormat?: "jpg" | "png";  // Fallback für <img> und <source>
}

const Image = ({
  className = "",
  src,
  alt,
  widths = [480, 960, 1440],
  fill = false,
  format = "webp",
  fallbackFormat = "jpg",
  ...rest
}: ResponsiveImageProps) => {
  const [loaded, setLoaded] = useState(false);

  const generateSrcSet = (ext: string) =>
    widths.map((w) => `${src}-${w}w.${ext} ${w}w`).join(", ");

  const defaultSrc = `${src}-${widths[1]}w.${fallbackFormat}`;

  return (
    <picture>
      {/* WebP first */}
      {format === "webp" && (
        <source
          type="image/webp"
          srcSet={generateSrcSet("webp")}
          sizes="(max-width: 768px) 100vw, 768px"
        />
      )}

      {/* Fallback: jpg/png */}
      <source
        srcSet={generateSrcSet(fallbackFormat)}
        sizes="(max-width: 768px) 100vw, 768px"
      />

      <img
        className={`inline-block align-top transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        src={defaultSrc}
        alt={alt}
        width={fill ? undefined : rest.width}
        height={fill ? undefined : rest.height}
        style={
          fill
            ? {
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }
            : undefined
        }
        onLoad={() => setLoaded(true)}
        loading="lazy"
        decoding="async"
        {...rest}
      />
    </picture>
  );
};

export default Image;

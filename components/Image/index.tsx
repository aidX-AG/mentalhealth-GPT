import { useState, useEffect } from 'react';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;                // Pfad ohne Endung (z.B. "images/hero" ohne führenden /)
  alt: string;
  widths?: number[];
  fill?: boolean;
  format?: "webp" | "jpg" | "png";
  fallbackFormat?: "jpg" | "png";
  basePath?: string;
  sizes?: string;
  disableFade?: boolean;
  eager?: boolean;
}

const Image = ({
  className = "",
  src,
  alt,
  widths = [480, 960, 1440],
  fill = false,
  format = "webp",
  fallbackFormat = "jpg",
  basePath = "/",
  sizes = "100vw",
  disableFade = true,
  eager = false,
  ...rest
}: ResponsiveImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const defaultWidth = widths[Math.floor(widths.length / 2)];

  // 1. Pfadsanierung (entfernt doppelte Schrägstriche)
  const sanitizePath = (path: string) => path.replace(/([^:]\/)\/+/g, '$1');

  // 2. Generiere korrekte Pfade
  const generateSrc = (width: number, ext: string) => {
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    return sanitizePath(`${basePath}${cleanSrc}-${width}w.${ext}`);
  };

  // 3. Debugging
  useEffect(() => {
    console.log('Image paths:', {
      webp: widths.map(w => generateSrc(w, 'webp')),
      fallback: widths.map(w => generateSrc(w, fallbackFormat)),
      default: generateSrc(defaultWidth, fallbackFormat)
    });
  }, [src]);

  return (
    <picture>
      {/* WebP Quelle */}
      {format === "webp" && (
        <source
          type="image/webp"
          srcSet={widths.map(w => `${generateSrc(w, 'webp')} ${w}w`).join(', ')}
          sizes={sizes}
        />
      )}

      {/* Fallback Quelle */}
      <source
        type={fallbackFormat === 'jpg' ? 'image/jpeg' : `image/${fallbackFormat}`}
        srcSet={widths.map(w => `${generateSrc(w, fallbackFormat)} ${w}w`).join(', ')}
        sizes={sizes}
      />

      {/* Fallback <img> */}
      <img
        className={`inline-block align-top ${!disableFade ? `transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}` : ''} ${className}`}
        src={generateSrc(defaultWidth, fallbackFormat)}
        alt={alt}
        width={fill ? undefined : rest.width}
        height={fill ? undefined : rest.height}
        style={fill ? { 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover' 
        } : rest.style}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          console.error('Failed to load image:', e.currentTarget.src);
          setLoaded(true); // Fallback anzeigen
        }}
        {...rest}
      />
    </picture>
  );
};

export default Image;

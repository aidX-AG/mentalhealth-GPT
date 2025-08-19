// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // Statischer Export
  trailingSlash: true,       // Wichtig: erzeugt /de/index.html
  images: { 
    unoptimized: true        // Nginx kümmert sich um Bilder
  },
  // ❌ KEIN i18n-Block mehr (wird manuell implementiert)
};

export default nextConfig;

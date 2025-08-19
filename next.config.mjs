/** @type {import('next').NextConfig} */
const nextConfig = {
  // Statischer Export (für Nginx-Hosting ohne Node-Server)
  output: 'export',

  // Next.js i18n-Routing (wir bauen /, /de, /fr)
  i18n: {
    locales: ['en', 'de', 'fr'],
    defaultLocale: 'en',
    localeDetection: false,
  },

  // Erzeugt /about/index.html statt /about.html (wichtiger für Nginx-Rewrites)
  trailingSlash: true,

  // Da Nginx die Assets direkt ausliefert
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

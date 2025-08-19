/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',        // statischer Export (SSG)
  images: {
    unoptimized: true,     // KEINE _next/image-Proxy-URLs, direkt /images/… nutzen
  },
};

module.exports = nextConfig;

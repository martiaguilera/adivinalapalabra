/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compressió i optimitzacions
  compress: true,
  poweredByHeader: false,

  // Imatges
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // Headers de seguretat i SEO
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Cache llarg per assets estàtics
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // Redirects canònics
  async redirects() {
    return [
      // Forçar www (ajusta si uses domini sense www)
      // {
      //   source: "/(.*)",
      //   has: [{ type: "host", value: "adivinalapalabra.com" }],
      //   destination: "https://www.adivinalapalabra.com/:path*",
      //   permanent: true,
      // },
    ];
  },
};

module.exports = nextConfig;

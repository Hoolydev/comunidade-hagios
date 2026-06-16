import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/comunidade",
        destination: "/movimento",
        permanent: true,
      },
      {
        source: "/comunidade/:path*",
        destination: "/movimento/:path*",
        permanent: true,
      },
      {
        source: "/admin/comunidade",
        destination: "/admin/membros",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
    ],
  },
};

export default nextConfig;

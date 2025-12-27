import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com',
        pathname: '/**/image/upload/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**/image/upload/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/proxy/:path*', // The fake path on frontend
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`, // The real backend
      },
    ];
  },
};

export default nextConfig;

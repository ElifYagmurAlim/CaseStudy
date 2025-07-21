import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: false, // <-- önemli
  },
  images: {
    domains: ['localhost'],
  },
  reactStrictMode: true,
};
export default nextConfig;













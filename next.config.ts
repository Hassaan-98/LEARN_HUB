import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      domains: ["sb9wv7zt6w9eccqw.public.blob.vercel-storage.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
       {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Force fresh build - 2026-05-04
}

module.exports = nextConfig

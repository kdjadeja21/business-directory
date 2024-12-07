/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true, domains: ['maps.googleapis.com', 'maps.gstatic.com'] },
};

module.exports = nextConfig;


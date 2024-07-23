/** @type {import('next').NextConfig} */
      const nextConfig = {experimental: {
        serverActions: true,
      },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },}

module.exports = nextConfig

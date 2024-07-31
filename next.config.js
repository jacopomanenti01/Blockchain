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
    reactStrictMode: true,
  webpack: config => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
  },}

module.exports = nextConfig



  


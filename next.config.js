const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // If serverActions needs to be enabled and it's configurable as a boolean in your version,
  // verify with the specific Next.js documentation.
  // However, typically, this should be an object or not used if it's experimental and not well documented.
  experimental: {
    // serverActions might need specific properties here, or be removed if causing issues
    // serverActions: {},
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, 'components'); // Adatta questo al tuo progetto
    return config;
  },
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },

};

module.exports = nextConfig;

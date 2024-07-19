/** @type {import('next').NextConfig} */
const nextConfig = {
        images: {
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'media-assets.wired.it'
            },
          ],
        },
      };



export default nextConfig;


  
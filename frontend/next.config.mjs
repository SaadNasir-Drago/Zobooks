/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.gr-assets.com', 'placehold.co', 'example.com',  'placehold.jp', 'localhost'], // Add the domain here
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/600x400/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

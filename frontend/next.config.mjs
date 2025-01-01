/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
   // Disable TypeScript type checks during builds:
   typescript: {
    ignoreBuildErrors: true,
  },
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

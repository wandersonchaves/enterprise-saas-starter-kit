/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@enterprise/common", "@enterprise/database", "@enterprise/events"],
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },
};

export default nextConfig;

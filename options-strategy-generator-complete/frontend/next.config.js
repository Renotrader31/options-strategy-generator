/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  env: {
    POLYGON_API_KEY: process.env.POLYGON_API_KEY,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8000/api/:path*'
          : '/api/:path*',
      },
    ];
  },
  images: {
    domains: ['polygon.io'],
  },
  experimental: {
    serverComponentsExternalPackages: ['axios'],
  },
}

module.exports = nextConfig

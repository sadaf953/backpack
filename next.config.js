/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'i.ytimg.com',
      'img.youtube.com',
      'img-b.udemycdn.com',
      'img-c.udemycdn.com'
    ]
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle prisma for client-side
      config.resolve.alias = {
        ...config.resolve.alias,
        '@prisma/client': false,
      }
    }
    return config
  }
}

module.exports = nextConfig

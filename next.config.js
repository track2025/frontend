// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true'
// });
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/race-track/:brand',
        destination: '/products?brand=:brand'
      },
      {
        source: '/race-track/events',
        destination: '/products?top=1'
      },
      {
        source: '/event/:brand/:date/pictures/:slug',
        destination: '/product/:slug'
      }
    ];
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false };
    return config;
  },
  env: {
    BASE_URL: process.env.BASE_URL,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    BASE_CURRENCY: process.env.BASE_CURRENCY,
    SHIPPING_FEE: process.env.SHIPPING_FEE,
    JWT_SECRET: process.env.JWT_SECRET,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    DO_SPACES_BUCKET: process.env.DO_SPACES_BUCKET,
    DO_SPACES_KEY: process.env.DO_SPACES_KEY,
    DO_SPACES_SECRET: process.env.DO_SPACES_SECRET
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nextall.vercel.app'
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com'
      },
      {
        protocol: 'https',
        hostname: 'shouttymedia.nyc3.digitaloceanspaces.com'
      },
      {
        protocol: 'https',
        hostname: 'nyc3.digitaloceanspaces.com'
      },
      {
        protocol: 'https',
        hostname: 'placehold.co'
      },
      {
        protocol: 'https',
        hostname: 'lapsnaps.com'
      }
    ]
  }
};

module.exports = nextConfig;

// remotePatterns: [
//   {
//     protocol: 'https',
//     hostname: 'res.cloudinary.com',
//     port: '',
//     pathname: ''
//   },
//   {
//     protocol: 'https',
//     hostname: 'nextall.vercel.app',
//     port: '',
//     pathname: ''
//   }
// ]

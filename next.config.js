const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    // Exclude large static assets from serverless function bundles (Vercel 250MB limit)
    outputFileTracingExcludes: {
      '**': [
        'public/media/products/**',
        'public/assets/images/bedroom/**',
        'public/assets/images/bathroom/**',
        'public/assets/images/kitchen/**',
        'public/assets/images/livingroom/**',
        'public/assets/images/homeoffice/**',
        'public/assets/images/kidsroom/**',
        'public/assets/images/office/**',
        'public/assets/images/outdoor/**',
        'public/assets/images/maingate/**',
      ],
      '/api/email-visualiser-summary': [
        'public/assets/Ai/**',
        'public/uploads/**',
        'public/assets/images/bathroom/**',
        'public/assets/images/bedroom/**',
        'public/assets/images/homeoffice/**',
        'public/assets/images/kitchen/**',
        'public/assets/images/kidsroom/**',
        'public/assets/images/maingate/**',
        'public/assets/images/office/**',
        'public/assets/images/outdoor/**',
        'public/assets/images/livingroom/**',
        'public/assets/images/brand-logos/**',
      ],
    },
  },
  // Don't transpile Prisma client - we're using compiled JavaScript files
  // transpilePackages: ['@prisma/client'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack(config, { isServer }) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: { and: [/\.(js|ts)x?$/] },
      use: ['@svgr/webpack'],
    });
    
    // Externalize Prisma client - it needs to be loaded at runtime
    // This prevents webpack from trying to bundle Prisma internals
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@prisma/client': 'commonjs @prisma/client',
      });
    }
    
    return config;
  },
};

const wpRedirects = require('./wp-redirects.json');
const seoLegacyRedirects = require('./seo-legacy-redirects.json');
const gsc404Redirects = require('./seo-gsc-404-redirects.json');

module.exports = {
  ...nextConfig,
  async rewrites() {
    return [
      { source: '/sitemap-index.xml', destination: '/api/sitemap-index' },
      { source: '/sitemap-colour-visualiser.xml', destination: '/api/sitemap-colour-visualiser' },
      { source: '/sitemap-products-asian-paints.xml', destination: '/api/sitemap-products-asian-paints' },
    ];
  },
  async redirects() {
    return [
      {
        source: '/terms-of-service',
        destination: '/terms-and-condition',
        permanent: true,
      },
      {
        source: '/color-visualiser/:path*',
        destination: '/colour-visualiser/:path*',
        permanent: true,
      },
      // Legacy mistaken double segment (old CMS / bad links) → canonical single prefix
      {
        source: '/colour-visualiser/colour-visualiser/:path*',
        destination: '/colour-visualiser/:path*',
        permanent: true,
      },
      // Ensure crawlers don't rely on client-side redirects for the visualiser entrypoint
      {
        source: '/colour-visualiser/basic',
        destination: '/colour-visualiser/basic/asian-paints',
        permanent: true,
      },
      {
        source: '/colour-visualiser/basic/',
        destination: '/colour-visualiser/basic/asian-paints',
        permanent: true,
      },
      {
        source: '/home/',
        destination: '/',
        permanent: true,
      },
      // Legacy WordPress junk: numeric post IDs, archives, and login endpoints
      {
        source: '/:id(\\d+).htm',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/:year(\\d{4})/:month(\\d{2})',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/wp-login.php',
        destination: '/admin/login',
        permanent: true,
      },
      {
        source: '/wp-admin',
        destination: '/admin/login',
        permanent: true,
      },
      {
        source: '/wp-admin/post.php',
        destination: '/admin/login',
        permanent: true,
      },
      {
        source: '/wp-admin/:path*',
        destination: '/admin/login',
        permanent: true,
      },
      {
        source: '/amp',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/amp/',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/services',
        destination: '/services/painting',
        permanent: true,
      },
      {
        source: '/services/wood',
        destination: '/services/wood-services',
        permanent: true,
      },
      // Legacy product URLs (Mongo ObjectId segment) → canonical Asian Paints product path
      {
        source: '/products/:mongoId([a-f0-9]{24})/:slug',
        destination: '/products/asian-paints/:slug',
        permanent: true,
      },
      // Specific legacy tag URLs → canonical blog posts (must run before /tag/:path* catch-all)
      ...seoLegacyRedirects.map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: r.permanent !== false,
      })),
      ...gsc404Redirects.map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: r.permanent !== false,
      })),
      // WordPress tag/category/page archives (catch-all so GSC URLs like /tag/distempering-services get 301)
      { source: '/tag/:path*', destination: '/blog', permanent: true },
      { source: '/category/:path*', destination: '/blog', permanent: true },
      { source: '/page/:path*', destination: '/blog', permanent: true },
      ...wpRedirects,
      // After JSON lists: legacy WP numeric .html and bogus slug/.html (explicit JSON rules win first)
      {
        source: '/:id(\\d+).html',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/:slug/.html',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },
};
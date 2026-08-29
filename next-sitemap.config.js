const {
  pathnameFromLoc,
  normalizeLocLowercase,
  isJunkPathname,
} = require('./scripts/lib/sitemap-junk-paths');
const { apexHomeglazerBase } = require('./scripts/lib/sitemap-base-url');

const apexSiteUrl = () =>
  apexHomeglazerBase(process.env.SITE_URL || 'https://www.homeglazer.com');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: apexSiteUrl(),
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/admin', '/admin/*', '/api/*', '/404'],
  transform: async (config, locPath) => {
    const canonicalLoc = normalizeLocLowercase(locPath);
    const pathname = pathnameFromLoc(canonicalLoc);
    if (isJunkPathname(pathname)) {
      return { loc: canonicalLoc, exclude: true };
    }
    return {
      loc: canonicalLoc,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
  additionalPaths: async (config) => {
    const result = [];
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      const [products, blogPosts] = await Promise.all([
        prisma.product.findMany({
          select: { slug: true, brand: { select: { slug: true } }, updatedAt: true },
        }),
        prisma.blogPost.findMany({
          where: { published: true },
          select: { slug: true, updatedAt: true },
        }),
      ]);
      await prisma.$disconnect();

      const ASIAN_PAINTS_SLUG = 'asian-paints';
      // Asian Paints product URLs live only in sitemap-products-asian-paints.xml (sitemap index) to avoid duplicate <loc> entries.
      for (const p of products) {
        const brandSlug = p.brand?.slug ? String(p.brand.slug).toLowerCase() : '';
        if (brandSlug === ASIAN_PAINTS_SLUG) continue;
        result.push({
          loc: `/products/${brandSlug}/${String(p.slug).toLowerCase()}`,
          changefreq: 'weekly',
          priority: 0.6,
          lastmod: p.updatedAt?.toISOString?.() || new Date().toISOString(),
        });
      }
      for (const b of blogPosts) {
        result.push({
          loc: `/blog/${String(b.slug).toLowerCase()}`,
          changefreq: 'monthly',
          priority: 0.6,
          lastmod: b.updatedAt?.toISOString?.() || new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('next-sitemap: Could not fetch dynamic paths (DATABASE_URL may be unset):', err?.message || err);
    }
    return result;
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      // AI Crawlers - Allow for AI search visibility
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'CCBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'Bytespider', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Applebot', allow: '/' },
      { userAgent: 'DeepSeekBot', allow: '/' },
    ],
    transformRobotsTxt: async (_, robotsTxt) => {
      const base = apexSiteUrl();
      const body = robotsTxt
        .split('\n')
        .filter((line) => !/^\s*Sitemap:\s*/i.test(line))
        .filter((line) => !/^\s*Host:\s*/i.test(line))
        .filter((line) => !/^\s*#\s*Host\s*$/i.test(line))
        .filter((line) => !/^\s*#\s*Sitemaps?\s*$/i.test(line))
        .join('\n')
        .replace(/\n{3,}/g, '\n\n')
        .trimEnd();
      return `${body}\n\n# Host\nHost: ${base}\n\nSitemap: ${base}/sitemap-index.xml\n`;
    },
  },
}

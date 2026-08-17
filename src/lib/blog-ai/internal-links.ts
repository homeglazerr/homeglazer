import { prisma } from '@/lib/prisma';
import { STATIC_INTERLINK_PAGES } from './constants';

/**
 * Short instruction block listing internal URLs the model may link on first mention of each concept.
 */
export async function buildInterlinkCatalogText(): Promise<string> {
  const lines: string[] = [];

  for (const p of STATIC_INTERLINK_PAGES) {
    lines.push(`- "${p.label}" -> ${p.path}`);
  }

  const products = await prisma.product.findMany({
    take: 60,
    orderBy: { updatedAt: 'desc' },
    include: { brand: { select: { slug: true, name: true } } },
  });

  for (const p of products) {
    const path = `/products/${p.brand.slug}/${p.slug}`;
    lines.push(`- Product "${p.name}" (${p.brand.name}) -> ${path}`);
  }

  const blogs = await prisma.blogPost.findMany({
    where: { published: true },
    take: 40,
    orderBy: { publishedAt: 'desc' },
    select: { title: true, slug: true },
  });

  for (const b of blogs) {
    lines.push(`- Blog "${b.title}" -> /blog/${b.slug}`);
  }

  return [
    'Use relative paths only starting with /. When a phrase matches below, wrap the FIRST natural occurrence in an anchor: <a href="...">matching phrase</a> inside valid HTML paragraphs.',
    'Do not spam links; prioritize reader value (roughly 5-12 internal links depending on length).',
    'Catalog:',
    ...lines,
  ].join('\n');
}

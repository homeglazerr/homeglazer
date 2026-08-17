import { prisma } from '@/lib/prisma';

export const BLOG_LIST_PAGE_SIZE = 6;

export const blogListSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  author: true,
  readTime: true,
  coverImage: true,
  categories: true,
  publishedAt: true,
  featuredOrder: true,
} as const;

type BlogListRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  coverImage: string;
  categories: unknown;
  publishedAt: Date | null;
  featuredOrder?: number | null;
};

export interface BlogListItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  coverImage: string;
  categories: string[];
}

export function formatBlogListItem(blog: BlogListRow): BlogListItem {
  return {
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    excerpt: blog.excerpt,
    author: blog.author,
    readTime: blog.readTime,
    coverImage: blog.coverImage,
    categories: blog.categories as string[],
    date: blog.publishedAt
      ? new Date(blog.publishedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '',
  };
}

export async function getFeaturedBlogPost(): Promise<BlogListItem | null> {
  const featured = await prisma.blogPost.findFirst({
    where: { published: true, featuredOrder: { not: null } },
    orderBy: [{ featuredOrder: 'asc' }, { publishedAt: 'desc' }],
    select: blogListSelect,
  });

  if (featured) {
    return formatBlogListItem(featured);
  }

  const latest = await prisma.blogPost.findFirst({
    where: { published: true },
    orderBy: { publishedAt: 'desc' },
    select: blogListSelect,
  });

  return latest ? formatBlogListItem(latest) : null;
}

export async function getBlogCategories(): Promise<string[]> {
  const rows = await prisma.blogPost.findMany({
    where: { published: true },
    select: { categories: true },
  });

  const unique = new Set<string>();
  for (const row of rows) {
    for (const category of row.categories as string[]) {
      if (category) unique.add(category);
    }
  }

  return Array.from(unique).sort();
}

interface BlogListPageOptions {
  page?: number;
  limit?: number;
  excludeId?: string;
  category?: string;
}

export async function getBlogListPage({
  page = 1,
  limit = BLOG_LIST_PAGE_SIZE,
  excludeId,
  category,
}: BlogListPageOptions): Promise<{
  posts: BlogListItem[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}> {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), 24);
  const skip = (safePage - 1) * safeLimit;

  const baseWhere = {
    published: true,
    ...(excludeId ? { id: { not: excludeId } } : {}),
  };

  if (category && category !== 'All') {
    const meta = await prisma.blogPost.findMany({
      where: baseWhere,
      select: { id: true, categories: true, publishedAt: true },
      orderBy: { publishedAt: 'desc' },
    });

    type MetaItem = { id: string; categories: unknown };
    const filteredIds = (meta as MetaItem[])
      .filter((row) => (row.categories as string[]).includes(category))
      .map((row) => row.id);

    const pageIds = filteredIds.slice(skip, skip + safeLimit);
    const rows = pageIds.length
      ? await prisma.blogPost.findMany({
          where: { id: { in: pageIds } },
          select: blogListSelect,
        })
      : [];

    const typedRows = rows as BlogListRow[];
    const rowById = new Map(typedRows.map((row) => [row.id, row]));
    const posts = pageIds
      .map((id) => rowById.get(id))
      .filter((row): row is NonNullable<typeof row> => Boolean(row))
      .map(formatBlogListItem);

    const total = filteredIds.length;
    return {
      posts,
      total,
      hasMore: skip + posts.length < total,
      page: safePage,
      limit: safeLimit,
    };
  }

  const [rows, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: baseWhere,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: safeLimit,
      select: blogListSelect,
    }),
    prisma.blogPost.count({ where: baseWhere }),
  ]);

  return {
    posts: (rows as BlogListRow[]).map(formatBlogListItem),
    total,
    hasMore: skip + rows.length < total,
    page: safePage,
    limit: safeLimit,
  };
}

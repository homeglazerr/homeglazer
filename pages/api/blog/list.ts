import type { NextApiRequest, NextApiResponse } from 'next';
import { getBlogListPage } from '@/lib/blog/list';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
    const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : undefined;
    const excludeId =
      typeof req.query.excludeId === 'string' && req.query.excludeId.trim()
        ? req.query.excludeId.trim()
        : undefined;
    const category =
      typeof req.query.category === 'string' && req.query.category.trim()
        ? req.query.category.trim()
        : undefined;

    if (Number.isNaN(page) || page < 1) {
      return res.status(400).json({ error: 'Invalid page' });
    }

    const result = await getBlogListPage({ page, limit, excludeId, category });

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(result);
  } catch (error) {
    console.error('[API /blog/list] Error:', error);
    return res.status(500).json({ error: 'Unable to load blog posts' });
  }
}

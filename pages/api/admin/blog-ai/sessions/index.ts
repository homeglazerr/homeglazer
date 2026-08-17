import type { NextApiResponse } from 'next';
import type { AuthenticatedRequest } from '@/lib/middleware';
import { requireAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import { createBlogAiSession } from '@/lib/blog-ai/orchestrator';

export default requireAuth(async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.method === 'GET') {
    const sessions = await prisma.blogAiSession.findMany({
      where: { createdByUserId: req.user.userId },
      orderBy: { updatedAt: 'desc' },
      take: 15,
      select: {
        id: true,
        status: true,
        blogPostId: true,
        updatedAt: true,
        createdAt: true,
      },
    });
    res.status(200).json({ sessions });
    return;
  }

  if (req.method === 'POST') {
    const { id } = await createBlogAiSession(req.user.userId);

    const session = await prisma.blogAiSession.findUnique({
      where: { id },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    res.status(201).json({ session });
    return;
  }

  res.status(405).json({ error: 'Method not allowed' });
});

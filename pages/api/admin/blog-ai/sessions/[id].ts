import type { NextApiResponse } from 'next';
import type { AuthenticatedRequest } from '@/lib/middleware';
import { requireAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';

export default requireAuth(async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse,
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { id } = req.query;
  if (typeof id !== 'string' || !id) {
    res.status(400).json({ error: 'Invalid session id' });
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const session = await prisma.blogAiSession.findFirst({
    where: { id, createdByUserId: req.user.userId },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      topicCandidates: { orderBy: [{ batchIndex: 'desc' }, { title: 'asc' }] },
    },
  });

  if (!session) {
    res.status(404).json({ error: 'Session not found' });
    return;
  }

  res.status(200).json({ session });
});

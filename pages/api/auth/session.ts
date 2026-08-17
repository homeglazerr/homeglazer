import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let verifyToken: any;
    let prisma: any;

    try {
      const authModule = await import('@/lib/auth');
      verifyToken = authModule.verifyToken;
    } catch (authError: any) {
      return res.status(500).json({ error: 'Authentication service failed' });
    }

    try {
      const prismaModule = await import('@/lib/prisma');
      prisma = prismaModule.prisma;
    } catch {
      return res.status(500).json({ error: 'Database connection failed' });
    }

    const token =
      req.cookies.token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    return res.status(200).json({
      authenticated: true,
      user,
    });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}


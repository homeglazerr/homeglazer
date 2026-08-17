import type { NextApiRequest, NextApiResponse } from 'next';

function validateLogin(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== 'string' || data.email.trim() === '') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push('Invalid email address');
    }
  }

  if (!data.password || typeof data.password !== 'string' || data.password.trim() === '') {
    errors.push('Password is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let prisma: any;
    let verifyPassword: any;
    let generateToken: any;

    try {
      const prismaModule = await import('@/lib/prisma');
      prisma = prismaModule.prisma;
    } catch {
      return res.status(500).json({
        error: 'Database connection failed',
        message: 'Failed to initialize database connection. Please check server logs.',
      });
    }

    try {
      const authModule = await import('@/lib/auth');
      verifyPassword = authModule.verifyPassword;
      generateToken = authModule.generateToken;
    } catch {
      return res.status(500).json({
        error: 'Authentication service failed',
        message: 'Failed to initialize authentication. Please check server logs.',
      });
    }

    if (!req.body) {
      return res.status(400).json({
        error: 'Request body is required',
      });
    }

    const validationResult = validateLogin(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationResult.errors,
      });
    }

    const email = req.body.email.trim();
    const password = req.body.password;

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbError: any) {
      return res.status(500).json({
        error: 'Database query failed',
        message: process.env.NODE_ENV === 'development' ? dbError?.message : undefined,
      });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    let isValidPassword = false;
    try {
      isValidPassword = await verifyPassword(password, user.passwordHash);
    } catch (verifyError: any) {
      return res.status(500).json({
        error: 'Password verification failed',
        message: process.env.NODE_ENV === 'development' ? verifyError?.message : undefined,
      });
    }

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    let token: string;
    try {
      token = generateToken({
        userId: user.id,
        email: user.email,
      });
    } catch (tokenError: any) {
      return res.status(500).json({
        error: 'Token generation failed',
        message: process.env.NODE_ENV === 'development' ? tokenError?.message : undefined,
      });
    }

    res.setHeader(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}; ${
        process.env.NODE_ENV === 'production' ? 'Secure;' : ''
      }`
    );

    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error?.message : undefined,
    });
  }
}

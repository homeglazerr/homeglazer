import type { NextApiResponse } from 'next';
import type { AuthenticatedRequest } from '@/lib/middleware';
import { requireAuth } from '@/lib/middleware';
import { prisma } from '@/lib/prisma';
import {
  processBlogAiEvent,
  type BlogAiEvent,
} from '@/lib/blog-ai/orchestrator';

function isBlogAiEvent(body: unknown): body is BlogAiEvent {
  if (!body || typeof body !== 'object') return false;
  const raw = body as { type?: unknown; payload?: unknown };
  const t = raw.type;
  const valid = new Set([
    'user_message',
    'refresh_topics',
    'approve_topic',
    'generate_content',
    'humanize_draft',
    'humanize_again',
    'approve_draft',
    'save_as_blog_draft',
  ]);
  if (typeof t !== 'string' || !valid.has(t)) return false;

  if (t === 'user_message') {
    const p = raw.payload as { text?: unknown } | undefined;
    return !!(p && typeof p.text === 'string');
  }
  if (t === 'approve_topic') {
    const p = raw.payload as { title?: unknown } | undefined;
    return !!(p && typeof p.title === 'string' && p.title.trim().length > 0);
  }
  return true;
}

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

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body;
  if (!isBlogAiEvent(body)) {
    res.status(400).json({ error: 'Invalid event body' });
    return;
  }

  try {
    await processBlogAiEvent(id, req.user.userId, body as BlogAiEvent);
  } catch (e: unknown) {
    const rawMsg = e instanceof Error ? e.message : 'Blog AI error';

    // Rate limit on Groq free tier — give the user actionable guidance instead of the raw error
    const isRateLimit = /rate_limit_exceeded|\b413\b|\b429\b|tokens per minute|TPM/i.test(rawMsg);
    const msg = isRateLimit
      ? 'Groq free-tier rate limit reached. Wait about 60 seconds for the per-minute quota to reset, then click again. (Upgrade plan: https://console.groq.com/settings/billing)'
      : rawMsg;

    const upstream =
      isRateLimit ||
      /Cannot reach LLM API|LLM API HTTP|Empty LLM|LLM API: invalid JSON|LLM generation failed|Article generation failed|ECONNRESET|ETIMEDOUT|ENOTFOUND|fetch failed/i.test(
        rawMsg,
      );
    res.status(upstream ? 502 : 400).json({ error: msg });
    return;
  }

  const session = await prisma.blogAiSession.findFirst({
    where: { id, createdByUserId: req.user.userId },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      topicCandidates: { orderBy: [{ batchIndex: 'desc' }, { title: 'asc' }] },
    },
  });

  res.status(200).json({ session });
});

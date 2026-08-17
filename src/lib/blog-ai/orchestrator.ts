import { prisma } from '@/lib/prisma';
import { BLOG_AI_COVER_PLACEHOLDER, BLOG_AI_DEFAULT_AUTHOR } from './constants';
import { buildInterlinkCatalogText } from './internal-links';
import { generateHumanize, generateJson, generateText, generateTopicsJson, humanizeShouldSplit } from './kimi';
import {
  articleDraftPrompt,
  humanizePolishPrompt,
  humanizePrompt,
  outlinePrompt,
  topicsPrompt,
} from './prompts';
import { slugifyForBlog, isValidSlug } from './slug';
import type { BlogAiArtifact, BlogAiArtifactProgress } from './types';
import { lintArticleSEO, estimateReadTimeFromHtml } from './seo';

type AiSessionStatus =
  | 'trending_proposed'
  | 'topic_locked'
  | 'draft_generating'
  | 'draft_ready'
  | 'content_approved'
  | 'draft_saved';

function asDbStatus(status: AiSessionStatus): AiSessionStatus {
  return status;
}

const SYS =
  'You are an expert SEO strategist and editorial assistant for Home Glazer. Respond only when asked with the prescribed format for each step. Never fabricate citations.';

export type BlogAiEvent =
  | { type: 'user_message'; payload: { text: string } }
  | { type: 'refresh_topics'; payload?: { part?: 0 | 1 } }
  | { type: 'approve_topic'; payload: { title: string } }
  | { type: 'generate_content'; payload?: Record<string, never> }
  | { type: 'humanize_draft'; payload?: Record<string, never> }
  | { type: 'humanize_again'; payload?: Record<string, never> }
  | { type: 'approve_draft'; payload?: Record<string, never> }
  | { type: 'save_as_blog_draft'; payload?: Record<string, never> };

function artifactOf(sessionArtifact: unknown): BlogAiArtifactProgress {
  if (!sessionArtifact || typeof sessionArtifact !== 'object') return {};
  return { ...(sessionArtifact as BlogAiArtifactProgress) };
}

function parseTopics(payload: unknown): { title: string; rationale?: string; sourceNotes?: string }[] {
  if (!payload || typeof payload !== 'object') return [];
  const ar = (payload as { topics?: unknown }).topics;
  if (!Array.isArray(ar)) return [];
  return ar
    .filter((row) => row && typeof row === 'object' && typeof (row as { title?: unknown }).title === 'string')
    .map((row) => ({
      title: String((row as { title: string }).title).trim(),
      rationale:
        typeof (row as { rationale?: unknown }).rationale === 'string'
          ? (row as { rationale: string }).rationale.trim()
          : undefined,
      sourceNotes:
        typeof (row as { sourceNotes?: unknown }).sourceNotes === 'string'
          ? (row as { sourceNotes: string }).sourceNotes.trim()
          : undefined,
    }))
    .filter((t) => t.title.length > 0);
}

function parseHumanized(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null;
  const h = (payload as { contentHtml?: unknown }).contentHtml;
  return typeof h === 'string' ? h : null;
}

function splitHtmlIntoParts(html: string): [string, string] {
  const midpoint = Math.floor(html.length / 2);
  let splitPos = midpoint;

  // Search backward for a block boundary (</h2>, </h3>, or </p>)
  // within 20% of the midpoint to avoid breaking content
  const searchStart = Math.max(0, midpoint - Math.floor(html.length * 0.1));
  const searchEnd = Math.min(html.length, midpoint + Math.floor(html.length * 0.1));

  for (let i = midpoint; i >= searchStart; i--) {
    const substr = html.substring(Math.max(0, i - 5), i + 1);
    if (substr.includes('</h2>') || substr.includes('</h3>') || substr.includes('</p>')) {
      const closeTagMatch = html.substring(i).match(/^<\/(h[2-3]|p)>/);
      if (closeTagMatch) {
        splitPos = i + closeTagMatch[0].length;
        break;
      }
    }
  }

  const part1 = html.substring(0, splitPos).trim();
  const part2 = html.substring(splitPos).trim();

  return [part1, part2];
}

function parseArticleBundle(payload: unknown): {
  title: string;
  slug: string;
  excerpt: string;
  contentHtml: string;
  metaDescription: string;
  metaKeywords: string;
  categories: string[];
} | null {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, unknown>;
  const cats = Array.isArray(p.categories)
    ? (p.categories.filter((x) => typeof x === 'string') as string[])
    : [];
  const t = typeof p.title === 'string' ? p.title.trim() : '';
  const slug = typeof p.slug === 'string' ? p.slug.trim() : '';
  const excerpt = typeof p.excerpt === 'string' ? p.excerpt.trim() : '';
  const contentHtml = typeof p.contentHtml === 'string' ? p.contentHtml.trim() : '';
  const metaDescription =
    typeof p.metaDescription === 'string' ? p.metaDescription.trim() : '';
  const metaKeywords = typeof p.metaKeywords === 'string' ? p.metaKeywords.trim() : '';
  if (!t || !slug || !excerpt || !contentHtml || !metaDescription || !metaKeywords || cats.length === 0)
    return null;
  return { title: t, slug, excerpt, contentHtml, metaDescription, metaKeywords, categories: cats };
}

async function appendMessage(
  sessionId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  metadata?: object,
): Promise<void> {
  await prisma.blogAiMessage.create({
    data: {
      sessionId,
      role: role as never,
      content,
      metadata: metadata ? (metadata as object) : undefined,
    },
  });
}

const EXCLUDE_BLOG_TITLES_LIMIT = 50;

async function excludeBlogIndexLine(): Promise<string> {
  const rows = await prisma.blogPost.findMany({
    select: { title: true, slug: true },
    orderBy: { updatedAt: 'desc' },
    take: EXCLUDE_BLOG_TITLES_LIMIT,
  });
  return rows.map((r: { title: string; slug: string }) => `- ${r.title} (/${r.slug})`).join('\n');
}

function formatTopicList(
  topics: { title: string; rationale?: string; sourceNotes?: string }[],
): string {
  return topics
    .map(
      (t, i) =>
        `**${i + 1}. ${t.title}**\n${t.rationale ? `_${t.rationale}_\n` : ''}${t.sourceNotes ? `Note: ${t.sourceNotes}` : ''}`,
    )
    .join('\n\n');
}

async function refreshTopicsWorkflow(sessionId: string, part: 0 | 1): Promise<void> {
  const exclude = await excludeBlogIndexLine();
  const raw = await generateTopicsJson(SYS, topicsPrompt(exclude, part));
  const topics = parseTopics(raw);

  const agg = await prisma.blogAiTopicCandidate.aggregate({
    where: { sessionId },
    _max: { batchIndex: true },
  });
  let batchIndex = agg._max.batchIndex ?? -1;

  if (part === 0) {
    batchIndex += 1;
    if (topics.length === 0) {
      await appendMessage(
        sessionId,
        'assistant',
        'No topics parsed from the model. Try **Refresh trending topics** again.',
      );
      return;
    }
    await prisma.blogAiTopicCandidate.createMany({
      data: topics.map((t) => ({
        sessionId,
        batchIndex,
        title: t.title,
        rationale: t.rationale,
        sources: t.sourceNotes ? ({ note: t.sourceNotes } as object) : undefined,
      })),
    });
    await appendMessage(
      sessionId,
      'assistant',
      'Loaded the first batch of topic ideas. Fetching a second batch…',
    );
    return;
  }

  if (batchIndex < 0) {
    batchIndex = 0;
  }

  if (topics.length > 0) {
    await prisma.blogAiTopicCandidate.createMany({
      data: topics.map((t) => ({
        sessionId,
        batchIndex,
        title: t.title,
        rationale: t.rationale,
        sources: t.sourceNotes ? ({ note: t.sourceNotes } as object) : undefined,
      })),
    });
  }

  const rows = await prisma.blogAiTopicCandidate.findMany({
    where: { sessionId, batchIndex },
    orderBy: { title: 'asc' },
  });

  if (rows.length === 0) {
    await appendMessage(
      sessionId,
      'assistant',
      'No topics parsed from the model. Try **Refresh trending topics** again.',
    );
    return;
  }

  const list = formatTopicList(
    rows.map(
      (r: {
        title: string;
        rationale: string | null;
        sources: unknown;
      }) => ({
        title: r.title,
        rationale: r.rationale ?? undefined,
        sourceNotes:
          r.sources && typeof r.sources === 'object' && 'note' in (r.sources as object) ?
            String((r.sources as { note?: unknown }).note ?? '')
          : undefined,
      }),
    ),
  );

  await appendMessage(
    sessionId,
    'assistant',
    [
      'Here are **trend-aligned topic suggestions** for Home Glazer (verify before publishing).',
      '',
      list,
      '',
      'Pick a suggestion or enter a Custom topic.',
    ].join('\n'),
  );
}

async function runArticlePipelineStep(sessionId: string): Promise<void> {
  const session = await prisma.blogAiSession.findUnique({
    where: { id: sessionId },
  });
  if (!session) throw new Error('Session not found');
  if (session.status !== 'draft_generating') return;

  const topic = session.selectedTopic as { title?: string } | null;
  const topicTitle = topic?.title?.trim();
  if (!topicTitle) throw new Error('No topic locked for this session.');

  let art = artifactOf(session.artifact);
  const phase = art.genPhase ?? 'outline';
  const interlinks = await buildInterlinkCatalogText();

  switch (phase) {
    case 'outline': {
      const outline = await generateText(SYS, outlinePrompt(topicTitle, interlinks));
      await prisma.blogAiSession.update({
        where: { id: sessionId },
        data: {
          artifact: {
            ...art,
            _priorStatus: art._priorStatus,
            genPhase: 'draft',
            outline,
          } as object,
        },
      });
      return;
    }
    case 'draft': {
      const outline = art.outline?.trim();
      if (!outline) throw new Error('Missing outline for draft step');
      const draftRaw = await generateJson(SYS, articleDraftPrompt(topicTitle, outline, interlinks));
      const bundle = parseArticleBundle(draftRaw);
      if (!bundle) throw new Error('Model returned invalid article JSON');
      const expectedSlug = slugifyForBlog(bundle.title);
      const slugFinal = bundle.slug !== expectedSlug ? expectedSlug : bundle.slug;
      await prisma.blogAiSession.update({
        where: { id: sessionId },
        data: {
          artifact: {
            ...art,
            _priorStatus: art._priorStatus,
            genPhase: 'finalize',
            title: bundle.title.trim(),
            slug: slugFinal,
            excerpt: bundle.excerpt,
            contentHtml: bundle.contentHtml.trim(),
            metaDescription: bundle.metaDescription,
            metaKeywords: bundle.metaKeywords,
            categories: bundle.categories.map((c) => c.trim()).filter(Boolean),
          } as object,
        },
      });
      return;
    }
    case 'finalize': {
      let humanHtml = art.contentHtml?.trim() ?? '';
      const bundleTitle = art.title?.trim() ?? '';
      let slugFinal = art.slug?.trim() ?? '';
      if (slugFinal !== slugifyForBlog(bundleTitle)) {
        slugFinal = slugifyForBlog(bundleTitle);
      }

      let lint = lintArticleSEO(bundleTitle, slugFinal, humanHtml);
      let seoWarnings = [...lint.warnings];
      const mergedWarnings = seoWarnings.concat(
        lint.errors.length ? [`SEO lint blocked: ${lint.errors.join('; ')}`] : [],
      );

      if (!lint.ok && !art._seoFixDone) {
        const fixPrompt = `Fix the HTML so it passes SEO checks errors: ${lint.errors.join('; ')}. Preserve meaning and links. Return JSON {"contentHtml":"..."}`;
        const fixPayload = await generateJson(SYS, `${fixPrompt}\nHTML:\n${humanHtml}`);
        const fixed = parseHumanized(fixPayload);
        if (fixed) {
          humanHtml = fixed.trim();
          lint = lintArticleSEO(bundleTitle, slugFinal, humanHtml);
          seoWarnings = [...seoWarnings, ...lint.warnings];
          if (!lint.ok) {
            seoWarnings.push(`SEO lint still failing: ${lint.errors.join('; ')}`);
          }
        }
        await prisma.blogAiSession.update({
          where: { id: sessionId },
          data: {
            artifact: {
              ...art,
              _priorStatus: art._priorStatus,
              genPhase: 'finalize',
              contentHtml: humanHtml,
              _seoFixDone: true,
            } as object,
          },
        });
        return;
      }

      const readTime = estimateReadTimeFromHtml(humanHtml);
      const postLint = lintArticleSEO(bundleTitle, slugFinal, humanHtml);

      const persisted: BlogAiArtifact = {
        outline: art.outline,
        title: bundleTitle,
        slug: slugFinal,
        excerpt: art.excerpt ?? '',
        contentHtml: humanHtml,
        metaDescription: art.metaDescription ?? '',
        metaKeywords: art.metaKeywords ?? '',
        categories: (art.categories && art.categories.length > 0 ? art.categories : ['Home Glazer']).map((c) =>
          c.trim(),
        ),
        seoWarnings: mergedWarnings.concat(postLint.errors.length ? postLint.errors : []),
      };

      await prisma.blogAiSession.update({
        where: { id: sessionId },
        data: {
          status: asDbStatus('draft_ready') as never,
          artifact: persisted as object,
        },
      });

      const warnBlock =
        persisted.seoWarnings?.length ?
          `\n\nWarnings:\n${persisted.seoWarnings.map((w) => `- ${w}`).join('\n')}`
        : '';

      await appendMessage(
        sessionId,
        'assistant',
        `Draft ready (read approx. ${readTime}). Expand **Draft preview** below.${warnBlock}`,
        {
          artifactPreview: {
            title: persisted.title,
            slug: persisted.slug,
            excerpt: persisted.excerpt,
            categories: persisted.categories,
            previewHtml: truncate(persisted.contentHtml ?? '', 2000),
          },
        },
      );
      return;
    }
    default:
      throw new Error('Unknown generation phase');
  }
}

function truncate(s: string, n: number): string {
  if (s.length <= n) return s;
  return `${s.slice(0, n)}...`;
}

export async function processBlogAiEvent(
  sessionId: string,
  userId: string,
  event: BlogAiEvent,
): Promise<void> {
  const session = await prisma.blogAiSession.findFirst({
    where: { id: sessionId, createdByUserId: userId },
  });
  if (!session) throw new Error('Session not found');

  switch (event.type) {
    case 'user_message': {
      const text = event.payload.text.trim();
      if (!text) return;
      await appendMessage(sessionId, 'user', text);
      return;
    }
    case 'refresh_topics': {
      if (session.status !== 'trending_proposed' && session.status !== 'topic_locked') {
        throw new Error('Refresh topics is only available before a draft is generated.');
      }
      const part: 0 | 1 = event.payload?.part === 1 ? 1 : 0;
      if (part === 0) {
        await prisma.blogAiSession.update({
          where: { id: sessionId },
          data: {
            status: asDbStatus('trending_proposed') as never,
            selectedTopic: undefined,
            artifact: undefined,
          },
        });
        await prisma.blogAiTopicCandidate.deleteMany({ where: { sessionId } });
        await appendMessage(
          sessionId,
          'assistant',
          'Refreshing trending topics (step 1 of 2)…',
        );
      }
      await refreshTopicsWorkflow(sessionId, part);
      return;
    }
    case 'approve_topic': {
      const title = event.payload.title.trim();
      if (!title) throw new Error('Topic title required');

      if (session.status === 'topic_locked') {
        const existing = (session.selectedTopic as { title?: string } | null)?.title?.trim();
        if (existing === title) {
          return;
        }
        throw new Error(
          'A topic is already locked for this session. Use **New conversation** to choose another topic.',
        );
      }
      if (session.status !== 'trending_proposed') {
        throw new Error('Topic can only be approved from the trending list stage.');
      }
      await prisma.blogAiSession.update({
        where: { id: sessionId },
        data: {
          status: asDbStatus('topic_locked') as never,
          selectedTopic: { title } as object,
        },
      });
      await appendMessage(sessionId, 'user', `Selected topic: ${title}`);
      await appendMessage(
        sessionId,
        'assistant',
        'Topic saved. Use **Generate article** to produce the full draft.',
      );
      return;
    }
    case 'generate_content': {
      if (
        session.status !== 'topic_locked' &&
        session.status !== 'draft_ready' &&
        session.status !== 'draft_generating'
      ) {
        throw new Error(
          'Generate article only after a topic is approved (or regenerate from draft ready).',
        );
      }

      let priorForRollback: AiSessionStatus;
      if (session.status === 'draft_generating') {
        const progress = artifactOf(session.artifact);
        if (progress._priorStatus === 'topic_locked' || progress._priorStatus === 'draft_ready') {
          priorForRollback = progress._priorStatus;
        } else {
          priorForRollback = 'topic_locked';
        }
      } else {
        priorForRollback = session.status as AiSessionStatus;
      }

      if (session.status === 'topic_locked' || session.status === 'draft_ready') {
        await prisma.blogAiSession.update({
          where: { id: sessionId },
          data: {
            status: asDbStatus('draft_generating') as never,
            artifact: {
              _priorStatus: priorForRollback,
              genPhase: 'outline',
            } as object,
          },
        });
        await appendMessage(
          sessionId,
          'assistant',
          'Generating outline and full draft. On cloud hosting this runs as a few quick steps so the request does not time out.',
        );
      }

      try {
        await runArticlePipelineStep(sessionId);
      } catch (e: unknown) {
        await prisma.blogAiSession.update({
          where: { id: sessionId },
          data: {
            status: priorForRollback as never,
            artifact: undefined,
          },
        });
        const msg = e instanceof Error ? e.message : 'Generation failed';
        await appendMessage(
          sessionId,
          'assistant',
          `Article generation failed: ${msg}. Verify LLM API keys and NVIDIA_API_BASE in your hosting environment.`,
        );
        throw e;
      }
      return;
    }
    case 'humanize_draft': {
      if (session.status !== 'draft_ready') {
        throw new Error('Humanise is only available once a draft has been generated.');
      }
      const hArt = artifactOf(session.artifact);
      const rawHtml = hArt.contentHtml?.trim();
      if (!rawHtml) throw new Error('No draft content to humanise.');

      const HUMANIZE_SYS = 'You are an expert editor. Follow all rewrite instructions exactly as given. Return only the JSON requested.';
      let finalHtml: string;

      if (humanizeShouldSplit()) {
        await appendMessage(sessionId, 'assistant', 'Humanising the article (splitting into 2 parts)…');
        const [part1, part2] = splitHtmlIntoParts(rawHtml);
        await appendMessage(sessionId, 'assistant', 'Processing part 1 of 2…');
        const part1Final = parseHumanized(await generateHumanize(HUMANIZE_SYS, humanizePrompt(part1))) ?? part1;
        await appendMessage(sessionId, 'assistant', 'Processing part 2 of 2…');
        const part2Final = parseHumanized(await generateHumanize(HUMANIZE_SYS, humanizePrompt(part2))) ?? part2;
        finalHtml = (part1Final + part2Final).trim();
      } else {
        await appendMessage(sessionId, 'assistant', 'Humanising the article…');
        finalHtml = (parseHumanized(await generateHumanize(HUMANIZE_SYS, humanizePrompt(rawHtml))) ?? rawHtml).trim();
      }

      await prisma.blogAiSession.update({
        where: { id: sessionId },
        data: {
          artifact: {
            ...hArt,
            contentHtml: finalHtml,
            humanized: true,
          } as object,
        },
      });
      await appendMessage(
        sessionId,
        'assistant',
        'Article humanised (both parts processed). Test on QuillBot — if the score is still high, click **Humanise again** for another pass, otherwise **Approve draft**.',
      );
      return;
    }
    case 'humanize_again': {
      if (session.status !== 'draft_ready') {
        throw new Error('Humanise again is only available after a draft has been humanised.');
      }
      const againArt = artifactOf(session.artifact);
      if (!againArt.humanized) {
        throw new Error('Run **Humanise article** first before requesting another pass.');
      }
      const currentHtml = againArt.contentHtml?.trim();
      if (!currentHtml) throw new Error('No content to humanise.');

      const AGAIN_SYS = 'You are an expert editor. Follow all rewrite instructions exactly as given. Return only the JSON requested.';
      let polishedHtml: string;

      if (humanizeShouldSplit()) {
        await appendMessage(sessionId, 'assistant', 'Running another humanisation pass (splitting into 2 parts)…');
        const [part1, part2] = splitHtmlIntoParts(currentHtml);
        await appendMessage(sessionId, 'assistant', 'Polishing part 1 of 2…');
        const part1Polished = parseHumanized(await generateHumanize(AGAIN_SYS, humanizePrompt(part1))) ?? part1;
        await appendMessage(sessionId, 'assistant', 'Polishing part 2 of 2…');
        const part2Polished = parseHumanized(await generateHumanize(AGAIN_SYS, humanizePrompt(part2))) ?? part2;
        polishedHtml = (part1Polished + part2Polished).trim();
      } else {
        await appendMessage(sessionId, 'assistant', 'Running another humanisation pass…');
        polishedHtml = (parseHumanized(await generateHumanize(AGAIN_SYS, humanizePrompt(currentHtml))) ?? currentHtml).trim();
      }

      await prisma.blogAiSession.update({
        where: { id: sessionId },
        data: {
          artifact: {
            ...againArt,
            contentHtml: polishedHtml,
          } as object,
        },
      });
      await appendMessage(
        sessionId,
        'assistant',
        'Additional pass complete. Test on QuillBot again — click **Humanise again** for more rounds or **Approve draft** when ready.',
      );
      return;
    }
    case 'approve_draft': {
      if (session.status === 'content_approved') {
        return;
      }
      if (session.status !== 'draft_ready') {
        throw new Error('No draft awaiting approval.');
      }
      await prisma.blogAiSession.update({
        where: { id: sessionId },
        data: { status: asDbStatus('content_approved') as never },
      });
      await appendMessage(
        sessionId,
        'assistant',
        'Draft marked approved. Click **Save article as draft** to create an unpublished admin blog post.',
      );
      return;
    }
    case 'save_as_blog_draft': {
      if (session.blogPostId) {
        await appendMessage(
          sessionId,
          'assistant',
          'Blog draft already exists for this session. Use **Open in editor**, or start **New conversation**.',
        );
        return;
      }
      if (session.status !== 'content_approved') {
        throw new Error('Approve the draft before saving as a blog post.');
      }

      const art = artifactOf(session.artifact);
      const title = art.title?.trim();
      let slug = art.slug?.trim();
      const content = art.contentHtml?.trim();
      const excerpt = art.excerpt?.trim();
      const metaDescription = art.metaDescription?.trim();
      const metaKeywords = art.metaKeywords?.trim();

      if (!title || !slug || !content || !excerpt || !metaDescription || !metaKeywords) {
        throw new Error('Incomplete artifact; regenerate the article.');
      }

      slug = slugifyForBlog(title);
      if (!isValidSlug(slug)) {
        throw new Error(`Invalid slug: ${slug}`);
      }

      const exists = await prisma.blogPost.findUnique({ where: { slug } });
      if (exists) {
        slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
      }

      try {
        const blog = await prisma.blogPost.create({
          data: {
            title,
            slug,
            excerpt,
            content,
            coverImage: BLOG_AI_COVER_PLACEHOLDER,
            author: BLOG_AI_DEFAULT_AUTHOR,
            readTime: estimateReadTimeFromHtml(content),
            categories: (art.categories && art.categories.length > 0 ?
              art.categories
            : ['Home Glazer']) as never,
            published: false,
            publishedAt: null,
            metaDescription,
            metaKeywords,
          },
        });

        await prisma.blogAiSession.update({
          where: { id: sessionId },
          data: {
            blogPostId: blog.id,
            status: asDbStatus('draft_saved') as never,
          },
        });

        await appendMessage(
          sessionId,
          'assistant',
          `Unpublished blog draft created. Replace the placeholder hero in the editor before publishing:\n/admin/blogs/${blog.id}/edit`,
          { blogPostId: blog.id },
        );
      } catch (err: unknown) {
        const code = (err as { code?: string })?.code;
        if (code === 'P2002') {
          throw new Error(
            'Slug conflict with an existing post. Regenerate or edit the title in the editor.',
          );
        }
        throw err;
      }
      return;
    }
    default:
      throw new Error('Unknown blog AI event type');
  }
}

export async function createBlogAiSession(userId: string): Promise<{ id: string }> {
  const session = await prisma.blogAiSession.create({
    data: {
      createdByUserId: userId,
      status: asDbStatus('trending_proposed') as never,
    },
  });
  await appendMessage(
    session.id,
    'assistant',
    [
      '**Hello** - welcome to Home Glazer AI.',
      'Use **Refresh trending topics** to get started.',
    ].join('\n'),
  );
  return { id: session.id };
}

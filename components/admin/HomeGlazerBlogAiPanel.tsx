'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Info, ArrowLeft } from 'lucide-react';
import { prepareBlogContentHtml } from '@/lib/mediaUrl';
import 'react-quill/dist/quill.snow.css';

const BLOG_AI_SESSION_STORAGE_KEY = 'hg-blog-ai-session-id';

const SESSION_PROGRESS_RANK: Record<string, number> = {
  content_approved: 5,
  draft_ready: 4,
  draft_generating: 3,
  topic_locked: 2,
  trending_proposed: 1,
};

/** After draft is approved or saved to CMS — do not auto-reopen on page load. */
const AUTO_RESUME_EXCLUDE_STATUSES = new Set(['content_approved', 'draft_saved']);

function shouldAutoResumeBlogAiSession(status: string): boolean {
  return !AUTO_RESUME_EXCLUDE_STATUSES.has(status);
}

function topicDraftStorageKey(sessionId: string): string {
  return `hg-blog-ai-topic-draft:${sessionId}`;
}

function persistSessionId(id: string): void {
  try {
    localStorage.setItem(BLOG_AI_SESSION_STORAGE_KEY, id);
  } catch {
    /* ignore quota / private mode */
  }
}

function clearBlogAiClientCache(forSessionId: string): void {
  try {
    localStorage.removeItem(BLOG_AI_SESSION_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  try {
    sessionStorage.removeItem(topicDraftStorageKey(forSessionId));
  } catch {
    /* ignore */
  }
}

type MessageRole = 'user' | 'assistant' | 'system';

interface ChatMessageRow {
  id: string;
  role: MessageRole;
  content: string;
}

interface TopicRow {
  id: string;
  title: string;
  batchIndex: number;
}

interface SessionPayload {
  id: string;
  status: string;
  blogPostId: string | null;
  artifact: unknown;
  messages: { id: string; role: MessageRole; content: string }[];
  topicCandidates: TopicRow[];
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function lightweightMarkdown(htmlEscapeInput: string): string {
  const esc = escapeHtml(htmlEscapeInput);
  return esc
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/_([^_\n]+?)_/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
}

const PRIMARY_BTN =
  '!border-0 !bg-[var(--brand-pink)] !text-white shadow-sm hover:!bg-[#c91e63] focus-visible:!ring-[var(--brand-pink)] disabled:!opacity-60';
const SECONDARY_OUTLINE_BTN =
  'border-[#299dd7] bg-white text-[#237bb0] shadow-sm hover:bg-sky-50 hover:text-[#1a6088]';
const SECONDARY_TOPIC_BTN =
  'border-[#299dd7]/40 bg-sky-50 text-[#237bb0] shadow-sm hover:bg-sky-100 hover:border-[#299dd7]/60';

export function HomeGlazerBlogAiPanel() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [session, setSession] = useState<SessionPayload | null>(null);
  const [topicDraft, setTopicDraft] = useState('');
  const [bootStarted, setBootStarted] = useState(false);
  const topicDraftHydratedRef = useRef(false);
  const eventInFlightRef = useRef(false);

  const loadSessionById = useCallback(async (id: string): Promise<SessionPayload | null> => {
    const res = await fetch(`/api/admin/blog-ai/sessions/${id}`);
    const data = await res.json().catch(() => ({}));
    if (!res.ok) return null;
    return (data.session as SessionPayload) ?? null;
  }, []);

  const resumeOrStartSession = useCallback(async () => {
    setError(null);
    setBusy(true);
    topicDraftHydratedRef.current = false;
    try {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem(BLOG_AI_SESSION_STORAGE_KEY);
      } catch {
        /* ignore */
      }

      if (stored) {
        const loaded = await loadSessionById(stored);
        if (loaded?.id && shouldAutoResumeBlogAiSession(loaded.status)) {
          persistSessionId(loaded.id);
          setSessionId(loaded.id);
          setSession(loaded);
          try {
            const savedDraft = sessionStorage.getItem(topicDraftStorageKey(loaded.id));
            if (savedDraft !== null) setTopicDraft(savedDraft);
            else setTopicDraft('');
          } catch {
            setTopicDraft('');
          }
          topicDraftHydratedRef.current = true;
          return;
        }
        if (loaded?.id && !shouldAutoResumeBlogAiSession(loaded.status)) {
          clearBlogAiClientCache(loaded.id);
        }
      }

      const listRes = await fetch('/api/admin/blog-ai/sessions');
      const listData = await listRes.json().catch(() => ({}));
      if (!listRes.ok) throw new Error(listData.error || 'Failed to list sessions');

      const rows = Array.isArray(listData.sessions) ? listData.sessions : [];
      type ListRow = { id: string; status: string; updatedAt: string };
      const sorted = (rows as ListRow[])
        .filter(
          (r) =>
            r.id &&
            SESSION_PROGRESS_RANK[r.status] !== undefined &&
            shouldAutoResumeBlogAiSession(r.status),
        )
        .sort((a, b) => {
          const rankDiff = SESSION_PROGRESS_RANK[b.status] - SESSION_PROGRESS_RANK[a.status];
          if (rankDiff !== 0) return rankDiff;
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });

      if (sorted.length > 0) {
        const loaded = await loadSessionById(sorted[0].id);
        if (loaded?.id) {
          persistSessionId(loaded.id);
          setSessionId(loaded.id);
          setSession(loaded);
          try {
            const savedDraft = sessionStorage.getItem(topicDraftStorageKey(loaded.id));
            if (savedDraft !== null) setTopicDraft(savedDraft);
            else setTopicDraft('');
          } catch {
            setTopicDraft('');
          }
          topicDraftHydratedRef.current = true;
          return;
        }
      }

      const res = await fetch('/api/admin/blog-ai/sessions', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to start AI session');
      const s = data.session as SessionPayload;
      persistSessionId(s.id);
      setSessionId(s.id);
      setSession(s);
      setTopicDraft('');
      topicDraftHydratedRef.current = true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(false);
    }
  }, [loadSessionById]);

  const startNewSession = useCallback(async () => {
    setError(null);
    setBusy(true);
    topicDraftHydratedRef.current = false;
    try {
      const res = await fetch('/api/admin/blog-ai/sessions', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Failed to start AI session');
      const s = data.session as SessionPayload;
      persistSessionId(s.id);
      setSessionId(s.id);
      setSession(s);
      setTopicDraft('');
      topicDraftHydratedRef.current = true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (bootStarted) return;
    setBootStarted(true);
    void resumeOrStartSession();
  }, [bootStarted, resumeOrStartSession]);

  useEffect(() => {
    if (!sessionId || !topicDraftHydratedRef.current) return;
    try {
      sessionStorage.setItem(topicDraftStorageKey(sessionId), topicDraft);
    } catch {
      /* ignore */
    }
  }, [sessionId, topicDraft]);

  const fireEvent = async (body: object) => {
    if (!sessionId || eventInFlightRef.current) return;
    eventInFlightRef.current = true;
    setBusy(true);
    setError(null);

    const postBlogAiEvent = async (requestBody: object): Promise<SessionPayload> => {
      let res: Response;
      try {
        res = await fetch(`/api/admin/blog-ai/sessions/${sessionId}/events`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
      } catch (netErr) {
        const m = netErr instanceof Error ? netErr.message : String(netErr);
        const transport =
          /^failed to fetch$/i.test(m) ||
          /networkerror/i.test(m) ||
          /load failed/i.test(m) ||
          /failed to fetch/i.test(m);
        throw new Error(
          transport ?
            'Browser could not reach the app server. Check Wi‑Fi, that Next.js is still running, and try again.'
          : m,
        );
      }

      const text = await res.text();
      let data: { error?: string; session?: SessionPayload } = {};
      if (text) {
        try {
          data = JSON.parse(text) as typeof data;
        } catch {
          if (!res.ok) {
            throw new Error(
              `Request failed (${res.status}). Response was not JSON: ${text.slice(0, 200)}`,
            );
          }
        }
      }
      if (!res.ok) {
        if (res.status === 504) {
          throw new Error(
            'Request timed out (504). On cloud hosting, each step must finish in ~30 seconds. Wait a moment and try again, or use a faster model (meta/llama-3.1-8b-instruct) in KIMI_FALLBACK_MODELS.',
          );
        }
        throw new Error(
          (typeof data.error === 'string' && data.error) || `Request failed (${res.status})`,
        );
      }
      const next = data.session;
      if (!next) {
        throw new Error('Missing session in response');
      }
      return next;
    };

    try {
      const ev = body as { type?: string };
      const maxSteps =
        ev.type === 'generate_content' ? 14
        : ev.type === 'refresh_topics' ? 2
        : 1;
      let next: SessionPayload | null = null;
      for (let step = 0; step < maxSteps; step++) {
        let payload: object;
        if (ev.type === 'generate_content') {
          payload = step === 0 ? body : { type: 'generate_content' as const };
        } else if (ev.type === 'refresh_topics') {
          payload = { type: 'refresh_topics', payload: { part: step as 0 | 1 } };
        } else {
          payload = body;
        }
        next = await postBlogAiEvent(payload);
        setSession(next);
        if (ev.type !== 'generate_content' && ev.type !== 'refresh_topics') break;
        if (ev.type === 'generate_content' && next.status !== 'draft_generating') break;
      }

      if (!next) return;

      const evType = ev.type;
      if (evType === 'approve_draft' || evType === 'save_as_blog_draft') {
        if (next.id) clearBlogAiClientCache(next.id);
        setTopicDraft('');
      } else if (next.id) {
        persistSessionId(next.id);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error');
    } finally {
      eventInFlightRef.current = false;
      setBusy(false);
    }
  };

  const candidatesByLatestBatch =
    session?.topicCandidates?.length ?
      [...session.topicCandidates].sort((a, b) => b.batchIndex - a.batchIndex)
    : [];
  const latestBatch =
    candidatesByLatestBatch.length > 0 ? candidatesByLatestBatch[0].batchIndex : null;
  const visibleCandidates =
    latestBatch !== null ?
      candidatesByLatestBatch.filter((c) => c.batchIndex === latestBatch)
    : [];

  const status = session?.status;
  const blogPostId = session?.blogPostId;
  const artifact = session?.artifact as Record<string, unknown> | null | undefined;
  const isHumanized = artifact?.humanized === true;

  const showGenerateArticle =
    status === 'topic_locked' || status === 'draft_ready' || status === 'draft_generating';
  const generateArticleLabel =
    status === 'draft_ready' ? 'Regenerate article'
    : status === 'draft_generating' ?
      busy ? 'Generating article…'
    : 'Continue generation'
    : 'Generate article';

  const buildMessageList = (): ChatMessageRow[] => {
    if (!session?.messages) return [];
    return session.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
    }));
  };

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const showArtifactPreview =
    session?.artifact &&
    typeof session.artifact === 'object' &&
    session.artifact &&
    ['draft_ready', 'content_approved', 'draft_saved'].includes(status ?? '');

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [session?.messages, showArtifactPreview, blogPostId, error]);

  const messages = buildMessageList();

  return (
    <div className="mx-auto max-w-6xl space-y-4 pb-16 px-1 sm:px-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-[#299dd7]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Blog Posts
        </Link>
      </div>

      <p className="text-sm text-slate-600">
        Draft an <strong>unpublished</strong> blog with suggested topics, then add your cover image and publish from
        the blog list.
      </p>

      {/* Single chat window: transcript → preview → actions footer */}
      <div className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-[#e4ded5] shadow-lg ring-1 ring-black/[0.06] min-h-[min(520px,calc(100vh-12rem))] max-h-[min(820px,calc(100vh-7rem))]">
        <header className="flex shrink-0 items-center gap-3 border-b border-slate-300/60 bg-[#f0f2f5] px-4 py-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#299dd7] text-white shadow-sm">
            <Sparkles className="h-5 w-5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-semibold text-slate-800">Home Glazer AI</h1>
            <p className="flex items-center gap-1.5 truncate text-xs text-slate-500" title={status || ''}>
              <Info className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
              <span className="font-mono">{status || 'starting…'}</span>
              {busy ? <span className="text-slate-500">· Working…</span> : null}
            </p>
          </div>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
          <ul className="flex flex-col gap-3">
            {messages.length === 0 ?
              <li className="text-center text-sm text-slate-500 py-8">Starting chat…</li>
            : messages.map((m) => {
                const isUser = m.role === 'user';
                const isSystem = m.role === 'system';
                const label =
                  m.role === 'assistant' ? 'Home Glazer AI' : m.role === 'system' ? 'System' : 'You';

                if (isSystem) {
                  return (
                    <li key={m.id} className="flex justify-center">
                      <div className="w-full max-w-[min(100%,560px)]">
                        <span className="mb-1 block text-center text-[10px] font-medium uppercase tracking-wide text-slate-500">
                          {label}
                        </span>
                        <div className="rounded-xl border border-amber-200/80 bg-amber-50/95 px-3 py-2.5 text-sm text-amber-950 shadow-sm">
                          <div
                            className="leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html: lightweightMarkdown(m.content),
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                }

                return (
                  <li
                    key={m.id}
                    className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex max-w-[min(92%,520px)] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      <span className="mb-0.5 px-1 text-[10px] font-medium uppercase tracking-wide text-slate-600/90">
                        {label}
                      </span>
                      <div
                        className={[
                          'rounded-2xl px-3.5 py-2.5 text-[13px] leading-snug shadow-sm',
                          isUser ?
                            'rounded-br-md bg-[#d9fdd3] text-slate-900'
                          : 'rounded-bl-md border border-white/60 bg-white text-slate-800',
                        ].join(' ')}
                      >
                        {isUser ?
                          <div className="whitespace-pre-wrap">{m.content}</div>
                        : <div
                            className="leading-relaxed [&_em]:italic [&_strong]:font-semibold"
                            dangerouslySetInnerHTML={{
                              __html: lightweightMarkdown(m.content),
                            }}
                          />
                        }
                      </div>
                    </div>
                  </li>
                );
              })}

            {showArtifactPreview ?
              <li className="flex w-full justify-start pt-1">
                <div className="w-full max-w-[min(100%,560px)]">
                  <span className="mb-0.5 block px-1 text-[10px] font-medium uppercase tracking-wide text-slate-600/90">
                    Home Glazer AI
                  </span>
                  <div className="rounded-2xl rounded-bl-md border border-white/60 bg-white px-0 py-0 text-slate-800 shadow-sm overflow-hidden">
                    <ArtifactPreview artifact={session!.artifact as Record<string, unknown>} />
                  </div>
                </div>
              </li>
            : null}

            {error ?
              <li className="flex justify-center px-1">
                <p
                  className="w-full max-w-[min(100%,560px)] text-sm text-red-800 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5"
                  role="alert"
                >
                  {error}
                </p>
              </li>
            : null}

            <div ref={messagesEndRef} aria-hidden className="h-1 w-full shrink-0" />
          </ul>
        </div>

        <footer className="shrink-0 border-t border-slate-300/50 bg-[#f0f2f5]">
          <div className="max-h-[min(40vh,380px)] overflow-y-auto p-2.5 sm:p-3">
            <div className="rounded-xl border border-slate-200/90 bg-white/95 p-3 sm:p-3.5 shadow-sm space-y-3 backdrop-blur-sm">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </p>
              <div className="flex flex-row flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={busy || !sessionId}
                  className={`min-h-10 min-w-0 flex-1 basis-[calc(50%-4px)] justify-center px-2 text-center text-[11px] leading-tight sm:text-xs ${SECONDARY_OUTLINE_BTN}`}
                  onClick={() => fireEvent({ type: 'refresh_topics' })}
                >
                  Refresh trending topics
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`min-h-10 min-w-0 flex-1 basis-[calc(50%-4px)] justify-center px-2 text-center text-[11px] leading-tight sm:text-xs ${SECONDARY_OUTLINE_BTN}`}
                  disabled={busy}
                  onClick={() => startNewSession()}
                >
                  New conversation
                </Button>
              </div>

              {visibleCandidates.length > 0 && status === 'trending_proposed' ?
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <p className="text-xs font-semibold text-slate-700">Suggested topics</p>
                  <div className="flex max-h-[140px] flex-col gap-1.5 overflow-y-auto pr-1">
                    {visibleCandidates.map((c, idx) => (
                      <Button
                        key={c.id}
                        variant="outline"
                        size="sm"
                        className={`h-auto min-h-9 w-full whitespace-normal justify-start text-left text-xs leading-snug ${SECONDARY_TOPIC_BTN}`}
                        disabled={busy}
                        onClick={() =>
                          fireEvent({
                            type: 'approve_topic',
                            payload: { title: c.title },
                          })
                        }
                      >
                        <span className="font-medium">{idx + 1}.</span> {c.title}
                      </Button>
                    ))}
                  </div>
                </div>
              : null}

              {status === 'trending_proposed' ?
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <label htmlFor="hg-ai-custom-topic" className="block text-xs font-medium text-slate-600">
                    Custom topic
                  </label>
                  <Input
                    id="hg-ai-custom-topic"
                    value={topicDraft}
                    onChange={(e) => setTopicDraft(e.target.value)}
                    placeholder="e.g. Waterproofing before monsoon"
                    className="border-slate-300 text-sm"
                  />
                  <Button
                    size="sm"
                    className={`w-full justify-center ${PRIMARY_BTN}`}
                    disabled={busy || !topicDraft.trim()}
                    onClick={() => {
                      fireEvent({
                        type: 'approve_topic',
                        payload: { title: topicDraft.trim() },
                      });
                      setTopicDraft('');
                    }}
                  >
                    Use this topic
                  </Button>
                </div>
              : null}

              <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
                {showGenerateArticle ?
                  <Button
                    size="sm"
                    className={`w-full justify-center ${PRIMARY_BTN}`}
                    disabled={busy}
                    onClick={() => fireEvent({ type: 'generate_content' })}
                  >
                    {generateArticleLabel}
                  </Button>
                : null}

                {status === 'draft_ready' && !isHumanized ?
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full justify-center ${SECONDARY_OUTLINE_BTN}`}
                    disabled={busy}
                    onClick={() => fireEvent({ type: 'humanize_draft' })}
                  >
                    {busy ? 'Humanising…' : 'Humanise article'}
                  </Button>
                : null}

                {status === 'draft_ready' && isHumanized ?
                  <Button
                    variant="outline"
                    size="sm"
                    className={`w-full justify-center ${SECONDARY_OUTLINE_BTN}`}
                    disabled={busy}
                    onClick={() => fireEvent({ type: 'humanize_again' })}
                  >
                    {busy ? 'Humanising…' : 'Humanise again'}
                  </Button>
                : null}

                {status === 'draft_ready' && isHumanized ?
                  <Button
                    size="sm"
                    className={`w-full justify-center ${PRIMARY_BTN}`}
                    disabled={busy}
                    onClick={() => fireEvent({ type: 'approve_draft' })}
                  >
                    Approve draft
                  </Button>
                : null}

                {status === 'content_approved' ?
                  <Button
                    size="sm"
                    className={`w-full justify-center ${PRIMARY_BTN}`}
                    disabled={busy}
                    onClick={() => fireEvent({ type: 'save_as_blog_draft' })}
                  >
                    Save article as draft
                  </Button>
                : null}

                {blogPostId ?
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className={`w-full justify-center ${SECONDARY_OUTLINE_BTN}`}
                  >
                    <Link href={`/admin/blogs/${blogPostId}/edit`}>Open in editor</Link>
                  </Button>
                : null}

                {busy ? <p className="text-center text-xs text-slate-500">Working…</p> : null}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function ArtifactPreview({ artifact }: { artifact: Record<string, unknown> }) {
  const title = typeof artifact.title === 'string' ? artifact.title : '';
  const slug = typeof artifact.slug === 'string' ? artifact.slug : '';
  const excerpt = typeof artifact.excerpt === 'string' ? artifact.excerpt : '';
  const html =
    typeof artifact.contentHtml === 'string' ? artifact.contentHtml : '';
  const warn = Array.isArray(artifact.seoWarnings) ? artifact.seoWarnings : [];

  if (!title && !html) return null;

  return (
    <details className="group text-xs bg-slate-50/50" open>
      <summary className="cursor-pointer list-none px-3 py-2.5 font-semibold text-slate-800 border-b border-slate-100 [&::-webkit-details-marker]:hidden flex items-center gap-1">
        <span className="text-slate-400 group-open:rotate-90 transition-transform inline-block">▸</span>
        Draft preview
      </summary>
      <div className="px-3 py-3 space-y-3 text-slate-600 max-h-[min(52vh,560px)] overflow-y-auto">
        <div className="space-y-1 border-b border-slate-200/80 pb-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">Metadata</p>
          {title ?
            <p>
              <span className="font-semibold">Title / H1:</span> {title}
            </p>
          : null}
          {slug ?
            <p>
              <span className="font-semibold">Slug:</span> {slug}
            </p>
          : null}
          {excerpt ?
            <p>
              <span className="font-semibold">Excerpt:</span> {excerpt}
            </p>
          : null}
          {warn.length > 0 ?
            <div>
              <span className="font-semibold">SEO notes:</span>
              <ul className="list-disc pl-4">
                {(warn as string[]).map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          : null}
        </div>
        {html ?
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 mb-2">Article body</p>
            <p className="text-[10px] text-slate-500 mb-2">
              Uses the same Quill (React) styles as the blog editor: heading scale, lists, links, and blockquotes.
            </p>
            <div className="rounded-md border border-slate-200 bg-white max-h-[min(42vh,480px)] overflow-y-auto">
              <div className="ql-container ql-snow !h-auto w-full border-0">
                <div
                  className="ql-editor !h-auto min-h-[80px] !overflow-visible [&_img]:max-w-full [&_img]:h-auto"
                  dangerouslySetInnerHTML={{
                    __html: prepareBlogContentHtml(html),
                  }}
                />
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-2 leading-snug">
              Content is the same HTML that will be saved when you approve and use Save article as draft.
            </p>
          </div>
        : null}
      </div>
    </details>
  );
}

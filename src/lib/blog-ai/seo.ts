import { slugifyForBlog } from './slug';

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function extractFirstH1InnerHtml(html: string): string | null {
  const m = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  return m ? m[1].trim() : null;
}

export function extractH1PlainText(html: string): string | null {
  const inner = extractFirstH1InnerHtml(html);
  if (!inner) return null;
  return stripTags(inner);
}

/** Count visible words after stripping HTML */
export function approximateWordCount(html: string): number {
  const t = stripTags(html);
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

/** ~200 wpm reading speed */
export function estimateReadTimeFromHtml(html: string): string {
  const w = approximateWordCount(html);
  const mins = Math.max(1, Math.ceil(w / 200));
  return `${mins} min read`;
}

export type SeoLintResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

/** Enforce title / slug alignment and single H1 matching title */
export function lintArticleSEO(
  title: string,
  slug: string,
  contentHtml: string,
): SeoLintResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const expectedSlug = slugifyForBlog(title);
  if (slug !== expectedSlug) {
    errors.push(
      `Slug must match slugified title. Expected "${expectedSlug}", got "${slug}".`,
    );
  }

  const h1Count = (contentHtml.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count !== 1) {
    errors.push(
      h1Count === 0
        ? 'Content must contain exactly one <h1> matching the title.'
        : `Content must contain exactly one <h1>; found ${h1Count}.`,
    );
  }

  const h1Plain = extractH1PlainText(contentHtml);
  if (!h1Plain) {
    errors.push('Could not extract H1 plain text.');
  } else if (h1Plain !== title.trim()) {
    errors.push(
      `H1 text must match page title exactly. Title: "${title.trim()}" vs H1: "${h1Plain}".`,
    );
  }

  const words = approximateWordCount(contentHtml);
  if (words < 600) {
    warnings.push(
      `Article is short (~${words} words). Target ~800+ for most topics; go deeper for competitive keywords.`,
    );
  }

  return { ok: errors.length === 0, errors, warnings };
}

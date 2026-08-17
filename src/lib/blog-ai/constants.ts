/** Placeholder until the author uploads a real cover in the blog editor */
export const BLOG_AI_COVER_PLACEHOLDER =
  process.env.BLOG_AI_COVER_PLACEHOLDER || '/uploads/living-room.svg';

export const BLOG_AI_DEFAULT_AUTHOR =
  process.env.BLOG_AI_DEFAULT_AUTHOR?.trim() || 'Home Glazer';

/** Current Kimi on NVIDIA integrate API (Mar 2026). */
export const NVIDIA_NIM_KIMI_MODEL = 'moonshotai/kimi-k2.6';

/** Moonshot-style ids that 404 or are EOL on NVIDIA — map to the live NIM id. */
const NVIDIA_MODEL_ALIASES: Record<string, string> = {
  'kimi-k2-0905-preview': NVIDIA_NIM_KIMI_MODEL,
  'kimi-k2.6': NVIDIA_NIM_KIMI_MODEL,
  'kimi-latest': NVIDIA_NIM_KIMI_MODEL,
  'moonshotai/kimi-k2-instruct-0905': NVIDIA_NIM_KIMI_MODEL,
  'moonshotai/kimi-k2-instruct': NVIDIA_NIM_KIMI_MODEL,
};

/** Groq (groq.com) — keys start with gsk_, base URL api.groq.com. NOT the same as xAI Grok. */
export function isGroqGateway(): boolean {
  const k = (process.env.GROK_API_KEY || '').trim().replace(/^Bearer\s+/i, '');
  return k.startsWith('gsk_');
}

/** @deprecated use isGroqGateway */
export const isGrokGateway = isGroqGateway;

export function isNvidiaNimGateway(): boolean {
  // Groq takes priority if GROK_API_KEY is set
  if (isGroqGateway()) return false;
  const k = (process.env.NVIDIA_API_KEY || process.env.NVAPI_KEY || '')
    .trim()
    .replace(/^Bearer\s+/i, '');
  if (k.startsWith('nvapi-')) return true;
  const base = (
    process.env.KIMI_API_BASE ||
    process.env.MOONSHOT_BASE_URL ||
    process.env.NVIDIA_API_BASE ||
    ''
  ).trim();
  return base.includes('integrate.api.nvidia.com');
}

/** Map env model ids to a valid id for the active gateway. */
export function normalizeBlogAiModelId(modelId: string): string {
  const m = modelId.trim();
  if (!m) return m;
  if (!isNvidiaNimGateway()) return m;
  if (NVIDIA_MODEL_ALIASES[m]) return NVIDIA_MODEL_ALIASES[m];
  if (!m.includes('/')) return NVIDIA_NIM_KIMI_MODEL;
  return m;
}

function defaultBlogAiPrimaryModel(): string {
  const fromEnv = process.env.KIMI_MODEL?.trim();
  if (fromEnv) return normalizeBlogAiModelId(fromEnv);
  // Groq: llama-3.3-70b-versatile has 12 000 TPM on free tier (vs 6 000 for 8b)
  // and is still fast on Groq (~3-5 s per step). Higher quality too.
  if (isGroqGateway()) return 'llama-3.3-70b-versatile';
  // NVIDIA NIM: llama-8b fits in Amplify's 29 s gateway limit
  if (isNvidiaNimGateway()) return 'meta/llama-3.1-8b-instruct';
  return 'kimi-k2.6';
}

/**
 * Primary model id for your gateway:
 * - Groq:       llama-3.3-70b-versatile (12 000 TPM, ~3-5 s; fallback to 8b if rate-limited)
 * - NVIDIA NIM: meta/llama-3.1-8b-instruct
 * - Moonshot:   kimi-k2.6
 */
const DEFAULT_PRIMARY = defaultBlogAiPrimaryModel();

const DEFAULT_FALLBACKS_GROQ = [
  'llama-3.1-8b-instant', // smaller TPM (6 000) but very fast — fallback if 70b hits limit
] as const;

const DEFAULT_FALLBACKS_NVIDIA = [
  'meta/llama-3.1-70b-instruct',
  NVIDIA_NIM_KIMI_MODEL,
] as const;

const DEFAULT_FALLBACKS_MOONSHOT = [
  'kimi-k2.6',
  'kimi-k2-0905-preview',
  'kimi-latest',
  'moonshot-v1-128k',
] as const;

/** Faster models first — used for refresh_topics. */
export function resolveTopicsModelChain(): string[] {
  if (isGroqGateway()) {
    return ['llama-3.1-8b-instant', 'llama-3.3-70b-versatile'];
  }
  if (isNvidiaNimGateway()) {
    return [
      normalizeBlogAiModelId('meta/llama-3.1-8b-instruct'),
      normalizeBlogAiModelId(NVIDIA_NIM_KIMI_MODEL),
    ];
  }
  const head = normalizeBlogAiModelId(DEFAULT_PRIMARY);
  return [head, ...DEFAULT_FALLBACKS_MOONSHOT.map(normalizeBlogAiModelId)].filter(
    (m, i, a) => a.indexOf(m) === i,
  );
}

/** Gemini API keys start with AIza — used to route to Google's OpenAI-compat endpoint. */
export function isGeminiKey(key: string): boolean {
  return key.startsWith('AIza');
}

export const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1beta/openai';

/** Gemini model chain for humanization — fastest/best first. */
export function resolveGeminiHumanizeModelChain(): string[] {
  return ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
}

/**
 * Humanise step model chain — prioritises quality.
 *
 * Groq:                llama-3.3-70b-versatile (best quality on Groq, still very fast)
 * Moonshot direct key: moonshot-v1-8k (~15-20 s) → kimi-k2.6
 * NVIDIA NIM only:     llama-70b → llama-8b
 */
export function resolveHumanizeModelChain(hasDedicatedMoonshotKey = false): string[] {
  if (isGroqGateway()) {
    // Primary: llama-3.3-70b-versatile (280 T/sec).
    // Fallback: llama-3.1-8b-instant (560 T/sec, fast) if 70b hits TPM limits.
    // (gemma2-9b-it was deprecated Oct 2025; replaced by official recommendation llama-3.1-8b-instant)
    return ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'];
  }
  if (hasDedicatedMoonshotKey) {
    return ['moonshot-v1-8k', 'kimi-k2.6'];
  }
  return ['meta/llama-3.1-70b-instruct', 'meta/llama-3.1-8b-instruct'];
}

/** Article generation chain — first entry wins; duplicates removed. */
export function resolveKimiModelChain(): string[] {
  const extras =
    process.env.KIMI_FALLBACK_MODELS?.split(',')
      .map((s) => s.trim())
      .filter(Boolean) ?? [];

  if (isGroqGateway()) {
    const defaults = DEFAULT_FALLBACKS_GROQ as unknown as string[];
    return [...new Set([DEFAULT_PRIMARY, ...extras, ...defaults].filter(Boolean))];
  }

  const defaults = isNvidiaNimGateway() ? DEFAULT_FALLBACKS_NVIDIA : DEFAULT_FALLBACKS_MOONSHOT;
  const merged = [DEFAULT_PRIMARY, ...extras, ...defaults].map(normalizeBlogAiModelId);
  return [...new Set(merged.filter(Boolean))];
}

/** Default primary model id */
export const KIMI_DEFAULT_MODEL = DEFAULT_PRIMARY;

/** Canonical internal URLs (relative) for editorial interlinking */
export const STATIC_INTERLINK_PAGES: { label: string; path: string }[] = [
  { label: 'Home Glazer', path: '/' },
  { label: 'Colour Visualiser', path: '/colour-visualiser' },
  { label: 'Painting services', path: '/painting-services' },
  { label: 'Residential painting', path: '/services/painting/residential' },
  { label: 'Exterior painting', path: '/services/customized-painting/exterior-painting' },
  { label: 'Wood services', path: '/services/wood-services' },
  { label: 'Products', path: '/products' },
  { label: 'Blog', path: '/blog' },
];

import {
  isNvidiaNimGateway,
  isGeminiKey,
  GEMINI_API_BASE,
  resolveGeminiHumanizeModelChain,
  resolveHumanizeModelChain,
  resolveKimiModelChain,
  resolveTopicsModelChain,
} from './constants';

/** OpenAI-compatible Chat Completions (Grok / NVIDIA NIM / Moonshot). */
function normalizeApiKey(raw: string): string {
  return raw.trim().replace(/^Bearer\s+/i, '');
}

function peekApiKey(): string | undefined {
  const k =
    process.env.GROK_API_KEY ||
    process.env.NVIDIA_API_KEY ||
    process.env.NVAPI_KEY ||
    process.env.MOONSHOT_API_KEY ||
    process.env.KIMI_API_KEY;
  return typeof k === 'string' ? normalizeApiKey(k) : undefined;
}

function requireApiKey(): string {
  const k = peekApiKey();
  if (!k) {
    throw new Error(
      'No LLM API key set. Add GROK_API_KEY to .env.local (server only). Key: https://console.x.ai/',
    );
  }
  return k;
}

function apiBase(): string {
  const raw = (
    process.env.KIMI_API_BASE ||
    process.env.MOONSHOT_BASE_URL ||
    process.env.NVIDIA_API_BASE ||
    ''
  ).trim();
  if (raw) return raw.replace(/\/$/, '');
  const k = peekApiKey();
  if (k?.startsWith('nvapi-')) return 'https://integrate.api.nvidia.com/v1';
  if (k?.startsWith('gsk_')) return 'https://api.groq.com/openai/v1';
  return 'https://api.moonshot.ai/v1';
}

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

function isRetryableError(e: unknown): boolean {
  const msg = errorMessage(e);
  return (
    /\b404\b/.test(msg) ||
    /\b410\b/.test(msg) ||
    /\b413\b/.test(msg) ||
    /\b503\b/.test(msg) ||
    /\b429\b/.test(msg) ||
    /\b529\b/.test(msg) ||
    /\b502\b/.test(msg) ||
    /UNAVAILABLE/i.test(msg) ||
    /overload/i.test(msg) ||
    /rate_limit_exceeded/i.test(msg) ||
    /ECONNRESET/i.test(msg) ||
    /ETIMEDOUT/i.test(msg) ||
    /fetch failed/i.test(msg) ||
    /Cannot reach LLM API/i.test(msg) ||
    /timeout/i.test(msg)
  );
}

function parseRetryDelayMs(msg: string): number | null {
  const m = msg.match(/retry[_\s-]*after[:\s]+(\d+)/i) || msg.match(/retry in ([\d.]+)s/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  if (!Number.isFinite(n) || n < 0) return null;
  const ms = m[0].toLowerCase().includes('retry after') ? n * 1000 : Math.ceil(n * 1000) + 500;
  return Math.min(ms, 120_000);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function messageTextFromCompletion(data: {
  choices?: {
    message?: {
      content?: string | null;
      reasoning_content?: string | null;
    };
  }[];
}): string | null {
  const msg = data?.choices?.[0]?.message;
  if (!msg) return null;
  const content = typeof msg.content === 'string' ? msg.content.trim() : '';
  if (content) return content;
  const reasoning = typeof msg.reasoning_content === 'string' ? msg.reasoning_content.trim() : '';
  if (reasoning) return reasoning;
  return null;
}

function isTransportFetchFailure(e: unknown): boolean {
  const msg = errorMessage(e);
  return (
    /fetch failed/i.test(msg) ||
    /failed to fetch/i.test(msg) ||
    /ECONNRESET/i.test(msg) ||
    /ECONNREFUSED/i.test(msg) ||
    /ETIMEDOUT/i.test(msg) ||
    /ENOTFOUND/i.test(msg) ||
    /socket hang up/i.test(msg) ||
    /network.*error/i.test(msg)
  );
}

async function chatCompletion(params: {
  model: string;
  system: string;
  user: string;
  temperature: number;
  maxTokens: number;
  jsonMode?: boolean;
  apiKeyOverride?: string;
  apiBaseOverride?: string;
}): Promise<string> {
  const resolvedBase = (params.apiBaseOverride ?? apiBase()).replace(/\/$/, '');
  const resolvedKey = params.apiKeyOverride ?? requireApiKey();
  const url = `${resolvedBase}/chat/completions`;
  const body: Record<string, unknown> = {
    model: params.model,
    messages: [
      { role: 'system', content: params.system },
      { role: 'user', content: params.user },
    ],
    temperature: params.temperature,
    max_tokens: params.maxTokens,
  };
  // Gemini's OpenAI-compat endpoint routes json_object to a constrained-generation handler
  // that returns 404 for most model names. Gemini returns valid JSON via the prompt alone.
  const isGeminiEndpoint = resolvedBase.includes('generativelanguage.googleapis.com');
  if (params.jsonMode && !isGeminiEndpoint) {
    body.response_format = { type: 'json_object' };
  }
  // Gemini 2.5 Flash thinks before generating, adding 15-25 s of latency that pushes past
  // Amplify's 29 s gateway limit. "none" disables thinking — confirmed ~1.4 s response time.
  // Creative rewriting (Ravi persona) does not benefit from extended reasoning.
  if (isGeminiEndpoint) {
    body.reasoning_effort = 'none';
  }

  const base = resolvedBase;
  const MAX_TRANSPORT_ATTEMPTS = 4;
  // Stay well under the ~29 s Amplify / Vercel gateway limit so a slow model times out
  // gracefully and the fallback chain can try the next (faster) model.
  const FETCH_TIMEOUT_MS = 25_000;
  let res: Response | undefined;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${resolvedKey}`,
  } as const;
  const payload = JSON.stringify(body);

  for (let transportAttempt = 0; transportAttempt < MAX_TRANSPORT_ATTEMPTS; transportAttempt++) {
    if (transportAttempt > 0) {
      const waitMs = 1000 * Math.pow(2, transportAttempt - 1);
      await sleep(waitMs);
    }

    try {
      res = await fetch(url, {
        method: 'POST',
        headers: { ...headers },
        body: payload,
        signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
      break;
    } catch (e) {
      const isTimeout = e instanceof Error && (e.name === 'TimeoutError' || e.name === 'AbortError');
      if (isTimeout) {
        // Throw a retryable error so chatWithFallbackOnChain tries the next model in the chain.
        throw new Error(
          `LLM API timeout after ${FETCH_TIMEOUT_MS / 1000}s (model "${params.model}" too slow). timeout`,
        );
      }
      const cause = errorMessage(e);
      const canRetry =
        transportAttempt < MAX_TRANSPORT_ATTEMPTS - 1 && isTransportFetchFailure(e);
      if (!canRetry) {
        throw new Error(
          `Cannot reach LLM API (${base}): ${cause}. On the machine running Next.js, check internet/VPN/firewall, that ${base} is reachable, API keys (MOONSHOT_API_KEY / NVIDIA_API_KEY), and KIMI_API_BASE if you override the URL.`,
        );
      }
    }
  }

  if (!res) {
    throw new Error(`Cannot reach LLM API (${base}): exhausted retries.`);
  }

  const rawText = await res.text();
  if (!res.ok) {
    if (res.status === 404 && isNvidiaNimGateway() && !params.apiBaseOverride) {
      throw new Error(
        `LLM API HTTP 404: model "${params.model}" is not available on NVIDIA NIM. Set KIMI_MODEL=moonshotai/kimi-k2.6 in .env.local (not Moonshot-only names like kimi-k2-0905-preview). ${rawText.slice(0, 120)}`,
      );
    }
    throw new Error(`LLM API HTTP ${res.status}: ${rawText.slice(0, 800)}`);
  }

  let data: {
    choices?: {
      message?: { content?: string | null; reasoning_content?: string | null };
    }[];
  };
  try {
    data = JSON.parse(rawText) as typeof data;
  } catch {
    throw new Error(`LLM API: invalid JSON response: ${rawText.slice(0, 200)}`);
  }

  const text = messageTextFromCompletion(data);
  if (!text) {
    throw new Error('Empty LLM response');
  }
  return text;
}

async function chatWithFallbackOnChain<T>(
  chain: string[],
  run: (modelId: string) => Promise<T>,
  maxModels = chain.length,
): Promise<{ result: T; modelUsed: string }> {
  const tryChain = chain.slice(0, Math.max(1, maxModels));
  let lastErr: unknown;
  for (let i = 0; i < tryChain.length; i++) {
    const modelId = tryChain[i];
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const result = await run(modelId);
        return { result, modelUsed: modelId };
      } catch (e) {
        lastErr = e;
        const msg = errorMessage(e);

        const is429 = /\b429\b/.test(msg) || /rate limit/i.test(msg);
        if (is429 && attempt === 0) {
          // Cap at 20 s so a retry still fits within Amplify's 29 s gateway limit
          const waitMs = Math.min(parseRetryDelayMs(msg) ?? 20_000, 20_000);
          await sleep(waitMs);
          continue;
        }

        const hasNextModel = i < tryChain.length - 1;
        if (hasNextModel && isRetryableError(e)) break;

        throw e;
      }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error('LLM generation failed');
}

async function chatWithFallback<T>(
  run: (modelId: string) => Promise<T>,
): Promise<{ result: T; modelUsed: string }> {
  return chatWithFallbackOnChain(resolveKimiModelChain(), run);
}

/** Returns false for Gemini — it's fast enough for full articles and splits cause it to invent new H1/intro sections for fragments. */
export function humanizeShouldSplit(): boolean {
  const k = process.env.GEMINI_API_KEY?.trim();
  return !(k && isGeminiKey(k));
}

export async function generateText(systemPreamble: string, userPrompt: string): Promise<string> {
  const system = systemPreamble.trim();
  const user = userPrompt.trim();
  // Use the topics/fast chain (8b first on Groq) so outline doesn't compete with
  // the 70b TPM bucket that the heavier draft step needs.
  const { result } = await chatWithFallbackOnChain(resolveTopicsModelChain(), (modelId) =>
    chatCompletion({
      model: modelId,
      system,
      user,
      temperature: 0.65,
      maxTokens: 1200, // outline only — section headers + bullets, no full prose
    }),
  );
  return result;
}

export async function generateJson(systemPreamble: string, userPrompt: string): Promise<unknown> {
  const raw = await generateJsonText(systemPreamble, userPrompt, {
    maxTokens: 2500, // 1 000-word HTML article ≈ 1 700 tokens; this leaves headroom and keeps total request under Groq free-tier TPM caps
    temperature: 0.55,
  });
  return JSON.parse(raw) as unknown;
}

/**
 * Humanise step — uses a higher-quality model from the same API key.
 * With GEMINI_API_KEY:    Gemini 2.0 Flash → 1.5 Flash via Google's OpenAI-compat endpoint.
 * With NVIDIA NIM key:    llama-70b → llama-8b.
 * With dedicated Moonshot key: moonshot-v1-8k → kimi-k2.6.
 * Falls back to the standard chain otherwise.
 */
export async function generateHumanize(
  systemPreamble: string,
  userPrompt: string,
  opts?: { preferModel?: string; maxTokens?: number },
): Promise<unknown> {
  const geminiKey = process.env.GEMINI_API_KEY?.trim();

  const dedicatedKey = (
    process.env.HUMANIZE_API_KEY ||
    process.env.MOONSHOT_API_KEY ||
    process.env.KIMI_API_KEY
  )?.trim().replace(/^Bearer\s+/i, '');

  let apiKeyOverride: string | undefined;
  let apiBaseOverride: string | undefined;
  let chain: string[];

  if (geminiKey && isGeminiKey(geminiKey)) {
    // Google Gemini via OpenAI-compatible endpoint.
    // Gemini 2.5 Flash uses thinking tokens that count against max_tokens via the
    // OpenAI-compat layer — use a large budget so content isn't truncated mid-article.
    apiKeyOverride = geminiKey;
    apiBaseOverride = GEMINI_API_BASE;
    const geminiChain = resolveGeminiHumanizeModelChain();
    chain = opts?.preferModel
      ? [opts.preferModel, ...geminiChain.filter((m) => m !== opts.preferModel)]
      : geminiChain;
  } else if (dedicatedKey?.startsWith('nvapi-')) {
    // NVIDIA NIM key for humanization — use NVIDIA models
    apiKeyOverride = dedicatedKey;
    apiBaseOverride = 'https://integrate.api.nvidia.com/v1';
    const nvidiaChain = ['meta/llama-3.1-70b-instruct', 'meta/llama-3.1-8b-instruct'];
    chain = opts?.preferModel
      ? [opts.preferModel, ...nvidiaChain.filter((m) => m !== opts.preferModel)]
      : nvidiaChain;
  } else if (dedicatedKey && !dedicatedKey.startsWith('gsk_')) {
    // Moonshot key for humanization
    apiKeyOverride = dedicatedKey;
    apiBaseOverride = process.env.HUMANIZE_API_BASE?.trim().replace(/\/$/, '') || 'https://api.moonshot.ai/v1';
    const moonshotChain = resolveHumanizeModelChain(true);
    chain = opts?.preferModel
      ? [opts.preferModel, ...moonshotChain.filter((m) => m !== opts.preferModel)]
      : moonshotChain;
  } else {
    // Default chain (Groq or whatever the environment is set to)
    const baseChain = resolveHumanizeModelChain(false);
    chain = opts?.preferModel
      ? [opts.preferModel, ...baseChain.filter((m) => m !== opts.preferModel)]
      : baseChain;
  }

  // Gemini 2.5 Flash counts thinking tokens against max_tokens via the OpenAI-compat
  // layer, so we need a large budget. NVIDIA is slow at high token counts, keep it lower.
  const isGemini = !!geminiKey && isGeminiKey(geminiKey);
  const raw = await generateJsonText(systemPreamble, userPrompt, {
    maxTokens: opts?.maxTokens ?? (isGemini ? 8000 : 2000),
    temperature: 0.7,
    chain,
    apiKeyOverride,
    apiBaseOverride,
  });
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    // Truncated JSON (token limit hit mid-string) — recover the contentHtml via regex
    // so the humanise step still succeeds instead of erroring out entirely.
    const html = extractContentHtmlFromPartialJson(raw);
    if (html) return { contentHtml: html };
    throw new Error('Humanise response was truncated and contentHtml could not be recovered. Try regenerating.');
  }
}

function extractContentHtmlFromPartialJson(raw: string): string | null {
  // Match "contentHtml":"...everything until the response was cut off..."
  // Handles escaped quotes (\") inside the string.
  const match = raw.match(/"contentHtml"\s*:\s*"((?:[^"\\]|\\.)*)/);
  if (!match || !match[1]) return null;
  const captured = match[1];
  // Try to parse it as a JSON string literal (handles all \uXXXX, \n, \" etc.)
  try {
    const parsed = JSON.parse(`"${captured}"`);
    return typeof parsed === 'string' ? parsed : null;
  } catch {
    // Last-resort manual unescape for the most common sequences
    return captured
      .replace(/\\u003c/gi, '<')
      .replace(/\\u003e/gi, '>')
      .replace(/\\u0026/gi, '&')
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\');
  }
}

/** Lighter JSON generation for topic refresh (shorter output, faster model, 2-model cap). */
export async function generateTopicsJson(systemPreamble: string, userPrompt: string): Promise<unknown> {
  const raw = await generateJsonText(systemPreamble, userPrompt, {
    maxTokens: 1400,
    temperature: 0.45,
    chain: resolveTopicsModelChain(),
    maxModels: 2,
  });
  return JSON.parse(raw) as unknown;
}

async function generateJsonText(
  systemPreamble: string,
  userPrompt: string,
  opts: {
    maxTokens: number;
    temperature: number;
    chain?: string[];
    maxModels?: number;
    apiKeyOverride?: string;
    apiBaseOverride?: string;
  },
): Promise<string> {
  const chain = opts.chain ?? resolveKimiModelChain();
  const system = systemPreamble.trim();
  const user = userPrompt.trim();

  async function tryModel(modelId: string, jsonMode: boolean): Promise<string> {
    return chatCompletion({
      model: modelId,
      system,
      user,
      temperature: opts.temperature,
      maxTokens: opts.maxTokens,
      jsonMode,
      apiKeyOverride: opts.apiKeyOverride,
      apiBaseOverride: opts.apiBaseOverride,
    });
  }

  const { result } = await chatWithFallbackOnChain(chain, async (modelId) => {
    try {
      let t = await tryModel(modelId, true);
      t = unwrapJsonFence(t);
      return t;
    } catch (e) {
      const msg = errorMessage(e);
      if (/response_format|json_object|unsupported|json_validate_failed|failed to generate json/i.test(msg)) {
        const t = unwrapJsonFence(await tryModel(modelId, false));
        return t;
      }
      throw e;
    }
  }, opts.maxModels);
  return result;
}

function unwrapJsonFence(s: string): string {
  if (s.startsWith('```')) {
    const stripped = s.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    return stripped.trim();
  }
  return s.trim();
}

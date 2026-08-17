export const BRAND_VOICE_BLOCK = `
You write for Home Glazer (India-focused home painting & decor services). Audience: homeowners and procurement for light commercial.
Tone: clear, trustworthy, moderately warm; Indian English spelling where natural.
Forbidden: unsubstantiated statistics, fabricated regulations, pretending to cite sources you cannot access.
Avoid generic AI cliches ("delve", "landscape", "game-changer").
`.trim();

export function topicsPrompt(excludeTitles: string, part: 0 | 1 = 0): string {
  const slice =
    part === 0 ?
      'Produce exactly 4 topic ideas (set A of 8).'
    : 'Produce exactly 4 more topic ideas (set B of 8), different from set A.';
  return `
${BRAND_VOICE_BLOCK}

${slice} Trending or timely blog TOPIC IDEAS for paints, coatings, interiors, waterproofing, wood finishes, and Indian homeowners.

Exclude overlap with existing posts:
${excludeTitles || '(none)'}

Keep rationale under 20 words each. Return JSON only:
{"topics":[{"title":"","rationale":"","sourceNotes":""}]}
`.trim();
}

export function outlinePrompt(topicTitle: string, interlinks: string): string {
  return `
${BRAND_VOICE_BLOCK}

Chosen topic headline: "${topicTitle}"

${interlinks}

Draft a numbered outline only (sections H2 names, bullets for H3), including:
- Opening that answers intent in plain language quickly
- Main expert sections tailored to homeowners
- A short FAQ sub-section suited for AI assistants (GEO)
- Mention where internal links naturally fit but do NOT output URLs in the outline

Return plain text markdown outline, no JSON.
`.trim();
}

export function articleDraftPrompt(topicTitle: string, outline: string, interlinks: string): string {
  return `
${BRAND_VOICE_BLOCK}

Topic headline: "${topicTitle}"

Approved outline:
${outline}

Internal linking catalogue (follow first-mention rule using HTML <a href="RELATIVE_URL">exact anchor text</a>):
${interlinks}

Write the full article as HTML for a rich text editor (React Quill):
- Single <h1> at the very top; the visible H1 text MUST match the final page title EXACTLY (character-for-character after you choose the title).
- Then use <h2>, <h3>, <p>, <ul><li>, <strong>, <em>, <blockquote> as needed.
- Include a near-top short direct answer in the first <p> after the H1 for snippet/AEO.
- Add an <h2> FAQ section with 4-6 Q&A pairs.
- Target ~1,000 words. Be concise — quality over length.
- Write naturally: vary sentence length, avoid repetition, no filler phrases, no generic AI clichés.
- metaDescription ~150-160 chars; metaKeywords comma-separated.
- categories: 2-4 short strings for the site CMS.

Return JSON only:
{
  "title": "must match H1 text exactly",
  "slug": "lowercase-with-hyphens derived from title; only a-z0-9-",
  "excerpt": "1-2 sentence preview",
  "contentHtml": "full html string",
  "metaDescription": "",
  "metaKeywords": "",
  "categories": ["..."]
}
`.trim();
}

export function humanizePrompt(contentHtml: string): string {
  return `
Rewrite the HTML article below as though it was written by Ravi, a 38-year-old Bangalore homeowner who renovated his flat last year and now shares practical painting and home-improvement advice in a casual but knowledgeable tone on a community forum.

Ravi's writing style:
- Contractions everywhere — "don't", "it's", "you'll", "there's", "can't", "we're", "isn't". He never writes "do not" or "it is".
- Sentence length varies a lot. Short. Then longer. Sometimes a winding sentence that builds through a thought before landing its point. Then short again. Never three similar-length sentences in a row.
- He starts some sentences with "And", "But", "So", "Look —". He sometimes opens a paragraph mid-thought rather than with a topic sentence.
- He drops in casual asides — "and honestly, most people skip this" or "trust me, I learnt this the hard way".
- He uses realistic scenarios: "Imagine you've just finished painting and two weeks later the surface starts peeling…"
- He asks questions mid-paragraph: "So why does this actually matter?"
- His paragraphs vary in length — some are one punchy sentence, some are four or five sentences.
- His bullet lists are uneven — some bullets are three words, some are a full sentence, never all the same structure.
- He never writes: Furthermore, Moreover, In addition, Additionally, It is important to note, In conclusion, To summarize, delve, landscape, game-changer, seamlessly, unlock, comprehensive, navigate, crucial, ensure. He replaces these with plain everyday words.
- He writes in Indian English — "colour" not "color", "labour" not "labor".

WHAT YOU MUST NOT CHANGE:
- The exact text inside <h1> (not even punctuation)
- Any href attribute values in links
- Heading tag levels and their text (<h2>, <h3>)
- All factual information, numbers, and product/brand names
- The HTML tag structure (<p>, <ul>, <li>, <strong>, <em>, <blockquote>, <a> etc.)

Return JSON only — no preamble, no explanation: {"contentHtml":"..."}

Article to rewrite:
${contentHtml}
`.trim();
}

export function humanizePolishPrompt(contentHtml: string): string {
  return humanizePrompt(contentHtml);
}

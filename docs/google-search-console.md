# Google Search Console — indexing checklist

Use these steps after deploy so crawling signals stay consistent with the site implementation.

## Property URL

- Prefer a single Search Console property for the apex domain: `https://homeglazer.com` (URL-prefix or domain property covering non-www).
- `www.homeglazer.com` requests redirect to the apex in application middleware; avoid treating www as a separate canonical site.

## Sitemaps

- Submit **one** sitemap URL in GSC: `https://homeglazer.com/sitemap-index.xml`.
- That index lists the main `sitemap.xml`, colour visualiser, and product sitemaps. Do **not** also submit `sitemap.xml` separately unless you remove it from GSC first, to avoid duplicate URL discovery for the same pages.
- Remove legacy or duplicate sitemap submissions that point at overlapping URL sets.
- **WWW vs non-WWW:** In Google Search Console "Sitemaps", remove any submission whose URL starts with `https://www.homeglazer.com/` (for example `https://www.homeglazer.com/sitemap-index.xml`). Keep only the **apex** (`https://homeglazer.com/...`) sitemap. The site’s `robots.txt` and generated XML use the apex origin only.

## Verification after changes

- URL Inspection: pick a service page, a blog post, and a product URL; confirm **one** `rel="canonical"` and that the canonical uses `https://homeglazer.com` with a lowercase path.
- Optional: re-run your external SEO crawl on the same URLs and confirm duplicate-canonical and redundant-sitemap warnings are cleared.

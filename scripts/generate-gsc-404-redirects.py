#!/usr/bin/env python3
"""Generate seo-gsc-404-redirects.json from GSC 404 export + blog-articles.json slugs."""

import argparse
import csv
import json
import os
import re
import sys
from difflib import SequenceMatcher
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
# Last committed GSC 404 URL export (regenerate JSON without passing paths). Not used at runtime — only seo-gsc-404-redirects.json is.
DEFAULT_SOURCE_CSV = ROOT / "scripts/data/gsc-404-source-urls.csv"
BLOG_JSON = ROOT / "public/uploads/blogs/blog-articles.json"
WP_REDIRECTS = ROOT / "wp-redirects.json"
OUT = ROOT / "seo-gsc-404-redirects.json"

# Do not emit redirects for these file extensions (pathname last segment).
STATIC_EXT = frozenset(
    {".pdf", ".doc", ".docx", ".xls", ".xlsx", ".zip", ".ppt", ".pptx", ".rtf"}
)

STATIC = {"home": "/", "about-us": "/about"}

# Paths that fuzzy slug matching would miss or mis-route (services, legal, WP permutations).
MANUAL: dict[str, str] = {
    "/5-charmwood-pu-and-pu-emporio-difference": "/blog/6-charmwood-pu-features-and-benefits-that-make-it-attractive",
    "/5-important-dos-for-the-use-of-wood-stain": "/blog/wood-stains-and-its-5-important-features-and-benefits",
    "/5-reasons-why-italian-pu-is-more-popular": "/blog/5-reasons-italian-pu-is-more-popular-than-economical-pu",
    "/5-restore-polyester-polish-chipping-steps": "/blog/5-simple-steps-to-repair-polyester-polish-chipping",
    "/5-ways-to-find-a-good-wood-polisher-skilled-polisher": "/blog/5-ways-to-find-a-good-wood-polishers",
    "/5-wood-stain-features-make-your-home": "/blog/wood-stains-and-its-5-important-features-and-benefits",
    "/6-brands-for-melamine-polish": "/blog/6-best-melamine-polish-brand-in-india-for-wood-polish",
    "/7-key-reasons-why-luxury-wall-paint-is-essential-in-luxury-homes": "/blog/why-luxury-paints-is-essential-in-luxury-homes",
    "/asian-paints-apcolite-premium-emulsion-vs-dulux-supercover-premium-emulsion": "/blog/asian-paints-apcolite-vs-dulux-supercover",
    "/asian-paints-royale-luxury-emulsion-vs-dulux-velvet-touch-pearl-glo": "/blog/asian-paints-vs-dulux-velvet-touch-pearl-glo",
    "/asian-paints-royale-matt-vs-asian-paints-royale-shyne-luxury-emulsion": "/blog/asian-paints-royale-matt-vs-shyne-luxury",
    "/best-colour-combination-for-the-newly-married-couple": "/blog/best-colours-for-married-couple-bedroom",
    "/best-time-and-tips-to-plan-for-painting-a-business-space-while-running-it": "/blog/tips-to-plan-painting-a-running-business-space",
    "/best-time-for-painting-a-business-space-without-disturbance": "/blog/tips-to-plan-painting-a-running-business-space",
    "/carpenters-craftsmen-turn-imagination-into-reality": "/blog/carpenters-are-craftsmen",
    "/carpentry": "/services/wood/carpentry",
    "/carpentry-services-skilled-carpenter-contractor-for-home-and-office": "/services/wood/carpentry",
    "/commercial-painting": "/services/painting/commercial",
    "/difference-between-pu-gloss-polyester-coatings": "/blog/polyester-polish-and-pu-polish-difference",
    "/difference-between-water-based-enamel-paint-and-oil-based-enamel-paint": "/blog/water-based-and-oil-based-enamel-paint",
    "/how-many-paint-coats-are-essential-for-a-better-finish-painting-coat": "/blog/paint-coats-for-better-finish-painting-coat",
    "/how-to-paint-a-newly-built-house-the-first-time-painting": "/blog/painting-process-to-paint-a-newly-built-house",
    "/how-to-paint-a-room": "/blog/how-painters-paint-a-room-the-painting-process",
    "/how-to-paint-or-repaint-a-room": "/blog/how-painters-paint-a-room-the-painting-process",
    "/how-to-paint-or-repaint-a-room-painting-a-room-house": "/blog/how-painters-paint-a-room-the-painting-process",
    "/kids-room-painting": "/services/painting/kids-room",
    "/local-unskilled-painters-vs-home-glazer-professional-painting-services": "/blog/5-signs-of-a-good-painter-home-glazers-painters",
    "/oikos-paints-acquired-by-sirca-paints": "/blog/reasons-why-sirca-paints-acquired-oikos-paints",
    "/oikos-paints-acquired-by-sirica-paints": "/blog/reasons-why-sirca-paints-acquired-oikos-paints",
    "/paint-your-home-or-business-space-during-lockdown-epidemic-covid19": "/blog/effects-of-covid-19-on-painting-business-interior-designing-business",
    "/painting-contractor-in-delhi-painters-in-delhi": "/blog/what-to-consider-while-selecting-a-good-painting-contractor-in-delhi",
    "/painting-your-house-is-an-investment-not-an-expense": "/blog/paintings-your-house-is-an-investment",
    "/power-of-perception-psychology-of-colour-in-commercial-space": "/blog/power-of-perception-unraveling-the-secrets",
    "/privacy": "/privacy-policy",
    "/some-best-colour-for-front-door-painters-in-delhi-ncr": "/blog/best-paint-colour-for-front-door",
    "/support": "/contact",
    "/terms-conditions": "/terms-and-condition",
    "/things-to-avoid-while-painting-your-home": "/blog/common-painting-mistakes-while-painting-your-home",
    "/tips-from-home-glazer-for-maintenance-of-duco-paint-furniture": "/blog/6-amazing-tips-to-maintain-duco-paint-surface",
    "/trending-colour-for-house-painting-house-painters-near-me": "/blog/7-trending-colours-for-house-painting-house",
    "/vastu-colours-colours-for-a-home-based-on-vastu-shastra": "/blog/vastu-shastra-colours",
    "/vibrant-colour-combination-for-your-kids-room-to-decorate-kids-space": "/blog/best-colour-combination-for-kids-room-kids-room-decor",
    "/wallpaper-painting": "/services/wall-decor/wallpaper",
    "/what-is-the-plastic-paint-what-are-its-types-and-price-of-plastic-paint": "/blog/know-about-plastic-paint",
    "/why-painting-your-home-is-important-best-house-painting-services": "/blog/painting-your-house-important-best-home-painting",
    "/why-should-landlord-paint-their-property-before-giving-it-on-rent": "/blog/benefits-of-painting-the-property-before-rent",
    "/why-should-office-get-paint-regularly": "/blog/why-you-should-paint-your-office-keep-your-office-painted",
    "/wood-polishing-2": "/services/wood/wood-polishing",
    "/wood-polishing-services/1000": "/services/wood/wood-polishing",
    "/wood-solutions": "/services/wood-services",
    "/wow-one-day": "/services/customized-painting/one-day-painting",
    "/wow-per-day": "/services/customized-painting/per-day-painting",
    # GSC 404 export edge cases (junk paths, /contact-us tails, AMP)
    "/residential-painting": "/services/painting/residential",
    "/exterior-painting": "/services/customized-painting/exterior-painting",
    "/blog/[slug]": "/blog",
    "/products/[brand]/[slug]": "/products",
    "/types-of-paint-what-all-are-types-of-wall-paint/amp": "/blog/types-of-paints",
    "/why-should-office-get-paint-regularly/contact-us": "/blog/why-you-should-paint-your-office-keep-your-office-painted",
    "/exterior-painting-services-in-delhi-ncr/contact-us": "/services/customized-painting/exterior-painting",
    "/wow-per-day/contact-us": "/services/customized-painting/per-day-painting",
    "/graffiti/contact-us": "/services/wall-decor/graffiti-painting",
    "/contact-us/contact-us": "/contact",
    "/how-to-figure-out-the-quality-of-paint-job-quality-finish": "/blog/how-for-paint-job-quality-finish",
    "/when-you-should-paint-your-office-painters-in-delhi": "/blog/what-is-the-best-time-to-paint-your-office-office-painting-time",
}


def norm_url(u: str) -> str:
    u = u.strip().strip('"')
    return re.sub(r"\s+", "", u)


def path_only(url: str) -> str:
    p = urlparse(url)
    return (p.path or "/").split("?")[0]


def is_static_asset_path(p: str) -> bool:
    last = p.rstrip("/").rsplit("/", 1)[-1]
    if "." not in last:
        return False
    suf = Path(last).suffix.lower()
    return suf in STATIC_EXT


def legacy_mongo_product_path(p: str) -> bool:
    """Handled by next.config.js redirect to /products/asian-paints/:slug."""
    return bool(re.fullmatch(r"/products/[a-f0-9]{24}/[^/]+", p))


def strip_numeric_tail(p: str) -> str:
    path = p
    while True:
        m = re.search(r"/(\d+)$", path)
        if not m:
            break
        path = path[: m.start()] or "/"
    return path or "/"


def next_builtin(p: str) -> bool:
    if re.fullmatch(r"/\d+\.htm", p):
        return True
    if re.match(r"^/\d{4}/\d{2}$", p):
        return True
    if p.startswith("/wp-login") or p.startswith("/wp-admin"):
        return True
    if p.startswith("/tag/") or p.startswith("/category/") or p.startswith("/page/"):
        return True
    return False


def slug_score(a: str, b: str) -> float:
    """Similarity 0..1 for near-miss slugs (typos, shortened WP paths)."""
    a, b = a.lower(), b.lower()
    if a == b:
        return 1.0
    if a in b or b in a:
        return 0.94
    return SequenceMatcher(None, a, b).ratio()


def resolve_slug(raw: str, slug_set: set, slug_list: list) -> str | None:
    if raw in slug_set:
        return raw
    prefixed = [s for s in slug_list if s.startswith(raw + "-")]
    if len(prefixed) == 1:
        return prefixed[0]
    if len(prefixed) > 1:
        return None
    best = None
    best_s = 0.0
    for s in slug_list:
        sc = slug_score(raw, s)
        if sc > best_s:
            best_s = sc
            best = s
    if best_s >= 0.82:
        return best
    return None


def load_paths_from_csvs(csv_paths: list[Path]) -> set[str]:
    paths: set[str] = set()
    for csv_path in csv_paths:
        if not csv_path.is_file():
            raise SystemExit(f"CSV not found: {csv_path}")
        with open(csv_path, newline="", encoding="utf-8-sig") as f:
            reader = csv.DictReader(f)
            for row in reader:
                u = norm_url(row.get("URL") or "")
                if not u.startswith("http"):
                    continue
                p = path_only(u)
                p = p.rstrip("/") or "/"
                paths.add(p)
    return paths


def resolve_csv_paths(argv_csv: list[str]) -> list[Path]:
    """GSC 404 export CSV(s) with a URL column. Override with CLI args or GSC_404_CSV; else bundled snapshot."""
    if argv_csv:
        return [Path(p).expanduser().resolve() for p in argv_csv]
    env = (os.environ.get("GSC_404_CSV") or "").strip()
    if env:
        return [Path(p.strip()).expanduser().resolve() for p in env.split(",") if p.strip()]
    if DEFAULT_SOURCE_CSV.is_file():
        return [DEFAULT_SOURCE_CSV.resolve()]
    print(
        "No CSV input and no bundled snapshot. Pass a GSC export, set GSC_404_CSV, or restore:\n"
        f"  {DEFAULT_SOURCE_CSV}\n"
        "  python3 scripts/generate-gsc-404-redirects.py /path/to/Table.csv\n"
        "  GSC_404_CSV=/path/to/a.csv,/path/to/b.csv npm run generate:gsc-404-redirects",
        file=sys.stderr,
    )
    raise SystemExit(1)


def main() -> None:
    ap = argparse.ArgumentParser(
        description="Generate seo-gsc-404-redirects.json from GSC 404 CSV export(s) (URL column)."
    )
    ap.add_argument(
        "csv",
        nargs="*",
        type=str,
        help="GSC Table.csv path(s). If omitted: GSC_404_CSV env, else scripts/data/gsc-404-source-urls.csv.",
    )
    args = ap.parse_args()
    csv_paths = resolve_csv_paths(args.csv)
    paths = load_paths_from_csvs(csv_paths)
    if not paths:
        raise SystemExit(f"No URLs loaded; check CSV path(s): {csv_paths}")

    with open(BLOG_JSON, encoding="utf-8") as f:
        data = json.load(f)
    slug_list = [a["slug"] for a in data.get("articles", []) if a.get("slug")]
    slug_set = set(slug_list)

    with open(WP_REDIRECTS, encoding="utf-8") as f:
        wp = json.load(f)
    wp_sources = {(r.get("source") or "").rstrip("/") or "/" for r in wp}

    seen = set(wp_sources)
    out: list[dict] = []

    for p in sorted(paths):
        if (
            p in seen
            or next_builtin(p)
            or p.startswith("/amp")
            or is_static_asset_path(p)
            or legacy_mongo_product_path(p)
        ):
            continue

        dest = MANUAL.get(p)
        if not dest and p == "/home":
            dest = "/"
        elif not dest:
            seg = p[1:] if p.startswith("/") else p
            first = seg.split("/")[0] if seg else ""
            if first in STATIC and "/" not in seg.strip("/"):
                dest = STATIC[first]

        if not dest and p.startswith("/author/"):
            dest = "/blog"

        if not dest and p.startswith("/painting-and-wood-coating-blog"):
            dest = "/blog"

        if not dest and p.startswith("/blog/"):
            rest = p[len("/blog/") :].split("/")[0]
            if rest and rest not in slug_set:
                dest = "/blog"

        if not dest:
            stripped = strip_numeric_tail(p)
            slug_part = stripped[1:] if stripped.startswith("/") else stripped
            if not slug_part:
                pass
            elif "/" in slug_part:
                dest = "/blog"
            else:
                resolved = resolve_slug(slug_part, slug_set, slug_list)
                if resolved:
                    dest = f"/blog/{resolved}"

        if not dest and len(p) < 35 and p.rstrip("/").endswith("-"):
            dest = "/blog"

        if dest:
            seen.add(p)
            out.append({"source": p, "destination": dest, "permanent": True})

    OUT.write_text(json.dumps(out, indent=2), encoding="utf-8")

    miss = sum(
        1
        for p in paths
        if p not in seen
        and not next_builtin(p)
        and not p.startswith("/amp")
        and not is_static_asset_path(p)
        and not legacy_mongo_product_path(p)
    )
    print(f"Wrote {len(out)} redirects to {OUT.name}")
    print(f"404 paths still without a rule: {miss}")


if __name__ == "__main__":
    main()

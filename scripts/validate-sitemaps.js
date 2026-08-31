#!/usr/bin/env node
/**
 * Fail the build if any sitemap <loc> matches legacy WordPress junk patterns.
 * Run after next-sitemap in postbuild.
 */
const fs = require('fs');
const path = require('path');
const { validateSitemapLoc } = require('./lib/sitemap-junk-paths');

const PUBLIC = path.join(process.cwd(), 'public');

function listSitemapFiles() {
  if (!fs.existsSync(PUBLIC)) return [];
  return fs
    .readdirSync(PUBLIC)
    .filter((name) => /^sitemap.*\.xml$/i.test(name))
    .map((name) => path.join(PUBLIC, name));
}

function extractLocs(xml) {
  const locs = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml)) !== null) {
    locs.push(m[1].trim());
  }
  return locs;
}

function main() {
  const files = listSitemapFiles();
  if (files.length === 0) {
    console.warn('validate-sitemaps: no public/sitemap*.xml files found; skipping');
    return;
  }

  const failures = [];

  for (const file of files) {
    let xml;
    try {
      xml = fs.readFileSync(file, 'utf8');
    } catch (e) {
      failures.push({ file, loc: '(read error)', reason: e.message });
      continue;
    }

    const locs = extractLocs(xml);
    for (const loc of locs) {
      if (/^https?:\/\/homeglazer\.com/i.test(loc) && !/^https?:\/\/www\.homeglazer\.com/i.test(loc)) {
        failures.push({
          file,
          loc,
          reason: 'use canonical origin https://www.homeglazer.com (with www) in sitemap <loc>',
        });
        continue;
      }
      if (xml.includes('<sitemapindex')) {
        continue;
      }
      const r = validateSitemapLoc(loc);
      if (!r.ok) {
        failures.push({ file, loc, reason: r.reason, path: r.path });
      }
    }
  }

  if (failures.length > 0) {
    console.error('validate-sitemaps: found legacy/junk URLs in sitemaps:\n');
    for (const f of failures.slice(0, 50)) {
      console.error(`  ${f.file}: ${f.loc} (${f.reason}${f.path ? ` ? ${f.path}` : ''})`);
    }
    if (failures.length > 50) {
      console.error(`  ... and ${failures.length - 50} more`);
    }
    process.exit(1);
  }

  console.log(`validate-sitemaps: OK (${files.length} file(s) checked)`);
}

main();

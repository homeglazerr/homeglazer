/**
 * One-off: parse public/whitsandoffwhitesAsianPaints.html → Whites & Off Whites array.
 * Run: node scripts/extract-whites-off-whites-asian-paints.js
 */
const fs = require('fs');
const path = require('path');

function slugToName(slug) {
  return slug.replace(/-/g, ' ').toLowerCase();
}

const htmlPath = path.join(process.cwd(), 'public', 'whitsandoffwhitesAsianPaints.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const items = [];
const reLi = /<li[^>]*class="[^"]*cc-swatch-list[^"]*"([^>]*)>([\s\S]*?)<\/li>/g;
let m;
while ((m = reLi.exec(html)) !== null) {
  const attrs = m[1];
  const inner = m[2];
  const pageMatch = attrs.match(
    /data-pageurl="https:\/\/www\.asianpaints\.com\/colour-catalogue\/off-white-wall-colours\/([^"]+)\.html"/
  );
  const hexMatch = inner.match(/background-color:\s*(#[0-9A-Fa-f]{6})/i);
  const codeMatch = inner.match(/cc-swatch--desc--skucode">([^<]+)</);
  const titleMatch = inner.match(/title="([^"]+)"[^>]*class="[^"]*cc-swatch--desc--colorName/);
  if (!hexMatch || !codeMatch) continue;
  const hex = hexMatch[1].toUpperCase();
  const code = codeMatch[1].trim();
  let colorName;
  if (pageMatch) colorName = slugToName(pageMatch[1]);
  else if (titleMatch) colorName = titleMatch[1].trim().toLowerCase();
  else continue;
  items.push({ colorName, colorCode: code, colorHex: hex });
}

const colorsPath = path.join(process.cwd(), 'src', 'data', 'colors', 'asian_paints_colors.json');
const db = JSON.parse(fs.readFileSync(colorsPath, 'utf8'));

if (items.length !== 144) {
  console.error('Expected 144 swatches, got', items.length);
  process.exit(1);
}

db.colorTypes['Whites & Off Whites'] = items;
let n = 0;
for (const arr of Object.values(db.colorTypes)) n += arr.length;
db.totalColors = n;
fs.writeFileSync(colorsPath, JSON.stringify(db, null, 2) + '\n', 'utf8');
console.log('Wrote Whites & Off Whites:', items.length, 'shades. totalColors:', db.totalColors);

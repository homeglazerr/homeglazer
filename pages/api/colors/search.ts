import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { BRAND_CONFIG } from '@/data/colorBrands';

type ColorSwatch = {
  colorName: string;
  colorCode: string;
  colorHex: string;
};

type BrandColorData = {
  brand: string;
  totalColors: number;
  colorTypes: Record<string, ColorSwatch[]>;
};

export type ColorSearchResult = {
  brandId: string;
  brandName: string;
  category: string;
  colorName: string;
  colorCode: string;
  colorHex: string;
  slug: string;
};

let cachedIndex: ColorSearchResult[] | null = null;

function toKebabCase(str: string): string {
  if (!str) return '';
  return str.toLowerCase().replace(/\s+/g, '-');
}

function buildColorSlug(colorName: string, colorCode: string): string {
  const cleanCode = (colorCode || '').toString().replace(/\s+/g, '-');
  return `${toKebabCase(colorName)}-${cleanCode}`;
}

function getColorIndex(): ColorSearchResult[] {
  if (cachedIndex) {
    return cachedIndex;
  }

  const results: ColorSearchResult[] = [];
  const colorsDir = path.join(process.cwd(), 'src', 'data', 'colors');

  for (const brand of BRAND_CONFIG) {
    const filePath = path.join(colorsDir, brand.fileName);
    if (!fs.existsSync(filePath)) continue;

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data: BrandColorData = JSON.parse(raw);
      const colorTypes = data.colorTypes || {};

      for (const [category, colors] of Object.entries(colorTypes)) {
        if (!Array.isArray(colors)) continue;

        for (const c of colors) {
          if (!c || !c.colorName || !c.colorCode) continue;

          results.push({
            brandId: brand.id,
            brandName: brand.name,
            category,
            colorName: c.colorName,
            colorCode: c.colorCode,
            colorHex: c.colorHex,
            slug: buildColorSlug(c.colorName, c.colorCode),
          });
        }
      }
    } catch (err) {
      // If one brand file fails, skip it but continue others
      // eslint-disable-next-line no-console
      console.error('[ColorSearch] Failed to index brand colors:', brand.id, err);
      continue;
    }
  }

  cachedIndex = results;
  return results;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ColorSearchResult[] | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const rawQuery = (req.query.q ?? '').toString();
  const query = rawQuery.trim().toLowerCase();

  if (!query) {
    return res.status(200).json([]);
  }

  try {
    const index = getColorIndex();
    const matches: ColorSearchResult[] = [];

    for (const entry of index) {
      const nameMatch = entry.colorName.toLowerCase().includes(query);
      const codeMatch = entry.colorCode.toLowerCase().includes(query);
      const hexMatch = entry.colorHex?.toLowerCase().includes(query);
      const brandMatch = entry.brandName.toLowerCase().includes(query);

      if (nameMatch || codeMatch || hexMatch || brandMatch) {
        matches.push(entry);
      }

      // Hard cap to keep response small and fast
      if (matches.length >= 100) break;
    }

    return res.status(200).json(matches);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error('[ColorSearch] Error handling request:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


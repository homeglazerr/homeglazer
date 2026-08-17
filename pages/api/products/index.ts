import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import asianPaintsCatalog from '@/data/asian_paints_products.json';

type CatalogProduct = {
  slug?: string;
  availableSizesText?: string;
};

const SIZE_TOKEN_REGEX = /\b(\d+(?:\.\d+)?)\s*(ML|L|KG|K|PCS?|NOS?|G|GM)\b/gi;

function normalizeSizeToken(quantityRaw: string, unitRaw: string): string {
  const quantity = quantityRaw.trim();
  const unitUpper = unitRaw.trim().toUpperCase();
  if (unitUpper === 'ML') {
    const ml = Number(quantity);
    if (Number.isFinite(ml) && ml > 0) {
      return `${Number((ml / 1000).toFixed(3))}L`;
    }
    return `${quantity}ML`;
  }
  if (unitUpper === 'KG' || unitUpper === 'K') return `${quantity}K`;
  if (unitUpper === 'PCS' || unitUpper === 'PC' || unitUpper === 'NOS' || unitUpper === 'NO') {
    return `${quantity}P`;
  }
  if (unitUpper === 'GM') return `${quantity}G`;
  return `${quantity}${unitUpper}`;
}

function extractCompactSizesFromText(text?: string | null): string[] {
  if (!text || typeof text !== 'string') return [];
  const seen = new Set<string>();
  const extracted: string[] = [];
  for (const match of text.matchAll(SIZE_TOKEN_REGEX)) {
    const token = normalizeSizeToken(match[1], match[2]);
    if (!seen.has(token)) {
      seen.add(token);
      extracted.push(token);
    }
  }
  return extracted;
}

function extractCompactSizesFromPrices(pricesObj: Record<string, unknown>): string[] {
  return Object.keys(pricesObj)
    .filter((k) => Boolean(pricesObj[k]))
    .map((k) => k.replace(/\s+/g, '').toUpperCase())
    .sort();
}

const availableSizesTextBySlug = new Map<string, string>(
  (((asianPaintsCatalog as any)?.products || []) as CatalogProduct[])
    .filter((p) => typeof p.slug === 'string' && typeof p.availableSizesText === 'string')
    .map((p) => [p.slug as string, (p.availableSizesText as string).trim()])
);

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { page, limit, brandId, search } = req.query;
    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 100;
    const skip = (pageNumber - 1) * pageSize;
    
    const whereClause = brandId ? { brandId: brandId as string } : undefined;

    const totalCount = await prisma.product.count({ where: whereClause });

    let products = await prisma.product.findMany({
      where: whereClause,
      take: pageSize,
      skip: skip,
      select: {
        id: true,
        brandId: true,
        name: true,
        slug: true,
        description: true,
        shortDescription: true,
        category: true,
        subCategory: true,
        sheenLevel: true,
        surfaceType: true,
        usage: true,
        image: true,
        bannerImage: true,
        prices: true,
        sizeUnit: true,
        colors: true,
        features: true,
        specifications: true,
        createdAt: true,
        updatedAt: true,
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        relatedProducts: {
          include: {
            relatedProduct: {
              select: {
                id: true,
                name: true,
                slug: true,
                brand: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    products = products.filter((product: any) => product.brand !== null);

    if (search) {
      const searchLower = (search as string).toLowerCase();
      products = products.filter((product: any) => {
        const nameMatch = product.name?.toLowerCase().includes(searchLower) || false;
        const descriptionMatch = product.description?.toLowerCase().includes(searchLower) || false;
        const brandMatch = product.brand?.name?.toLowerCase().includes(searchLower) || false;
        const categoryMatch = product.category?.toLowerCase().includes(searchLower) || false;
        const subCategoryMatch = product.subCategory?.toLowerCase().includes(searchLower) || false;
        return nameMatch || descriptionMatch || brandMatch || categoryMatch || subCategoryMatch;
      });
    }

    const productsWithSizesText = products.map((product: any) => {
      const pricesObj =
        product?.prices && typeof product.prices === 'object' && !Array.isArray(product.prices)
          ? (product.prices as Record<string, unknown>)
          : {};
      const compactFromPrices = extractCompactSizesFromPrices(pricesObj);
      const hasAvailableSizes = compactFromPrices.length > 0;
      const fallbackAvailableSizesText =
        !hasAvailableSizes && typeof product?.slug === 'string'
          ? availableSizesTextBySlug.get(product.slug) || null
          : null;
      const compactFromFallback = !hasAvailableSizes
        ? extractCompactSizesFromText(fallbackAvailableSizesText)
        : [];

      return {
        ...product,
        availableSizesText: fallbackAvailableSizesText,
        availableSizesCompact: hasAvailableSizes ? compactFromPrices : compactFromFallback,
      };
    });

    const totalPages = Math.ceil(totalCount / pageSize);

    return res.status(200).json({
      data: productsWithSizesText,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: totalCount,
        totalPages: totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const createProduct = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const data = req.body;

    if (!data.brandId || !data.name || !data.slug) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        brandId_slug: {
          brandId: data.brandId,
          slug: data.slug,
        },
      },
    });

    if (existingProduct) {
      return res.status(409).json({ error: 'Product with this slug already exists for this brand' });
    }

    const { relatedProductIds, ...productData } = data;

    if (productData.prices) {
      const normalizedPrices: Record<string, number> = {};
      for (const [key, value] of Object.entries(productData.prices)) {
        normalizedPrices[key] = typeof value === 'string' ? parseFloat(value as string) : Number(value);
      }
      productData.prices = normalizedPrices;
    }

    const product = await prisma.product.create({
      data: {
        ...productData,
        colors: productData.colors || [],
        features: productData.features || [],
        specifications: productData.specifications || {},
      },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (relatedProductIds && Array.isArray(relatedProductIds) && relatedProductIds.length > 0) {
      const uniqueRelatedIds = Array.from(new Set(relatedProductIds as string[])).filter(
        (id: string) => id !== product.id
      );

      if (uniqueRelatedIds.length > 0) {
        await Promise.all(
          uniqueRelatedIds.map(async (relatedId) => {
            try {
              await prisma.productRelatedProduct.create({
                data: {
                  productId: product.id,
                  relatedProductId: relatedId,
                },
              });
            } catch (err: any) {
              if (err?.code !== 'P2002') throw err;
            }
          })
        );
      }
    }

    const productWithRelations = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        relatedProducts: {
          include: {
            relatedProduct: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });

    return res.status(201).json(productWithRelations || product);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    return getProducts(req, res);
  } else if (req.method === 'POST') {
    return createProduct(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
};

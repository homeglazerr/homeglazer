import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getOgImageUrl } from '@/lib/mediaUrl';
import { BRAND_CONFIG } from '@/data/colorBrands';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

function toKebabCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-');
}

const BrandIndexPage: React.FC = () => {
  const router = useRouter();
  const { brand } = router.query;
  const brandId = typeof brand === 'string' ? brand : '';
  const brandConfig = BRAND_CONFIG.find((b) => b.id === brandId);

  const pageTitle = brandConfig
    ? `${brandConfig.name} Paint Colours — Visualiser | HomeGlazer`
    : 'Paint Brand Colour Visualiser | HomeGlazer';
  const pageDescription = brandConfig
    ? `Browse ${brandConfig.name} wall colours in HomeGlazer's visualiser. Jump to your first shade and preview it on room scenes before you paint.`
    : "Browse paint colours by brand in HomeGlazer's wall colour visualiser and preview shades before painting.";

  useEffect(() => {
    const redirectToFirstColor = async () => {
      if (!brand || typeof brand !== 'string') {
        router.replace('/colour-visualiser/basic/asian-paints');
        return;
      }

      const brandConfig = BRAND_CONFIG.find(b => b.id === brand);
      if (!brandConfig) {
        router.replace('/colour-visualiser/basic/asian-paints');
        return;
      }

      try {
        const colorData = await import(`@/data/colors/${brandConfig.fileName}`);
        const categories = Object.keys(colorData.default.colorTypes);
        if (categories.length > 0) {
          const firstCategory = categories[0];
          const colors = colorData.default.colorTypes[firstCategory];
          if (colors && colors.length > 0) {
            const firstColor = colors[0];
            const cleanColorCode = firstColor.colorCode.replace(/\s+/g, '-');
            const colorSlug = `${toKebabCase(firstColor.colorName)}-${cleanColorCode}`;
            router.replace(`/colour-visualiser/basic/${brand}/${firstCategory}/${colorSlug}`);
          }
        }
      } catch (error) {
        console.error('Error loading color data:', error);
        router.replace('/colour-visualiser/basic/asian-paints');
      }
    };

    if (router.isReady) {
      redirectToFirstColor();
    }
  }, [brand, router]);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={getOgImageUrl('/uploads/living-room.jpg', SITE_URL)} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={getOgImageUrl('/uploads/living-room.jpg', SITE_URL)} />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Loading your {brandConfig ? `${brandConfig.name} ` : ''}colour palette
          </h1>
          <h2 className="text-base md:text-lg font-medium text-gray-600 mb-6">
            Taking you to the first shade so you can preview it on sample walls.
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED276E] mx-auto mb-4" aria-hidden />
          <p className="text-gray-600">Loading colour visualiser…</p>
        </div>
      </div>
    </>
  );
};

export default BrandIndexPage; 
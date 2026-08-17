import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getOgImageUrl } from '@/lib/mediaUrl';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

const BasicIndexPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      router.replace('/colour-visualiser/basic/asian-paints');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Basic Colour Visualiser — Choose a Brand | HomeGlazer</title>
        <meta
          name="description"
          content="Start HomeGlazer's basic wall colour visualiser: pick Asian Paints or another brand and preview shades on sample rooms before painting."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Basic Colour Visualiser — Choose a Brand | HomeGlazer" />
        <meta
          property="og:description"
          content="Quick colour preview by paint brand—ideal when you want to compare shades fast."
        />
        <meta property="og:image" content={getOgImageUrl('/uploads/living-room.jpg', SITE_URL)} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Basic Colour Visualiser | HomeGlazer" />
        <meta
          name="twitter:description"
          content="Preview paint colours by brand with HomeGlazer's basic visualiser."
        />
        <meta name="twitter:image" content={getOgImageUrl('/uploads/living-room.jpg', SITE_URL)} />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Starting the basic colour visualiser
          </h1>
          <h2 className="text-base md:text-lg font-medium text-gray-600 mb-6">
            We&apos;ll open Asian Paints shades first—you can switch brands on the next screen.
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED276E] mx-auto mb-4" aria-hidden />
          <p className="text-gray-600">Loading colour visualiser…</p>
        </div>
      </div>
    </>
  );
};

export default BasicIndexPage; 
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getOgImageUrl } from '@/lib/mediaUrl';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

const AdvancedVisualiser: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the first step route
    router.replace('/colour-visualiser/advanced/choose-a-room-type');
  }, [router]);

  return (
    <>
      <Head>
        <title>Advanced Colour Visualiser — Start Here | HomeGlazer</title>
        <meta
          name="description"
          content="Upload your room photo, choose room type and paint brand, then preview wall colours step by step in HomeGlazer's advanced visualiser."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Advanced Colour Visualiser — Start Here | HomeGlazer" />
        <meta
          property="og:description"
          content="Upload your room photo, choose room type and paint brand, then preview wall colours step by step in HomeGlazer's advanced visualiser."
        />
        <meta property="og:image" content={getOgImageUrl('/uploads/living-room.jpg', SITE_URL)} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Advanced Colour Visualiser | HomeGlazer" />
        <meta
          name="twitter:description"
          content="Upload your room photo and preview wall paint colours step by step with HomeGlazer's advanced visualiser."
        />
        <meta name="twitter:image" content={getOgImageUrl('/uploads/living-room.jpg', SITE_URL)} />
      </Head>
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Opening the advanced colour visualiser
          </h1>
          <h2 className="text-base md:text-lg font-medium text-gray-600 mb-6">
            Next you&apos;ll choose your room type and upload a photo to preview paint colours.
          </h2>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ED276E] mx-auto mb-4" aria-hidden />
          <p className="text-gray-600">Redirecting…</p>
        </div>
      </div>
    </>
  );
};

export default AdvancedVisualiser; 
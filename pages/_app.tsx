import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { useRouter } from 'next/router';
import CookieConsent from '@/components/common/CookieConsent';
import LocationPopupOrchestrator from '@/components/common/LocationPopupOrchestrator';
import { getOgImageUrl } from '@/lib/mediaUrl';
import { JsonLd, ORGANIZATION_JSON_LD } from '@/components/seo/JsonLd';
import * as gtag from '@/lib/gtag';
import '../src/styles/tailwind.css';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.homeglazer.com';
const DEFAULT_OG_IMAGE = getOgImageUrl('/uploads/hero-banner.png', SITE_URL);

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const rawPath = router.asPath.split('?')[0].split('#')[0];
  // Normalize trailing slash and casing so canonical matches one URL shape for GSC.
  let path = rawPath !== '/' && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  path = path === '/' ? path : path.toLowerCase();
  const canonicalUrl = `${SITE_URL}${path === '/' ? '' : path}`;

  const omitDefaultRobots =
    router.pathname === '/404' ||
    path === '/thank-you';

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url);
    };
    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <>
      <Head>
        {/* Basic Meta */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ED276E" />
        <link rel="icon" href="/favicon.ico" />

        {!omitDefaultRobots && (
          <>
            <meta key="hg-robots" name="robots" content="index, follow" />
            <meta key="hg-googlebot" name="googlebot" content="index, follow" />
            <meta key="hg-bingbot" name="bingbot" content="index, follow" />
          </>
        )}

        {/* Canonical — single tag; key ensures Head dedupes if merged twice */}
        <link key="hg-canonical" rel="canonical" href={canonicalUrl} />

        {/* Default Title & Description */}
        <title>HomeGlazer - Professional Painting Services</title>
        <meta name="description" content="Professional painting services including interior, exterior, texture painting, wall decor, and wood services. Transform your space with HomeGlazer." />

        {/* Open Graph - Facebook, WhatsApp, LinkedIn */}
        <meta key="hg-og-url" property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="HomeGlazer" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:title" content="HomeGlazer - Professional Painting Services" />
        <meta property="og:description" content="Professional painting services including interior, exterior, texture painting, wall decor, and wood services. Transform your space with HomeGlazer." />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="HomeGlazer - Professional Painting Services" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="HomeGlazer - Professional Painting Services" />
        <meta name="twitter:description" content="Professional painting services including interior, exterior, texture painting, wall decor, and wood services." />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
      </Head>

      {/* Google tag (gtag.js) Consent Mode dataLayer */}
      <Script
        id="google_gtagjs-js-consent-mode-data-layer"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  "ad_personalization":"denied",
  "ad_storage":"denied",
  "ad_user_data":"denied",
  "analytics_storage":"granted",
  "functionality_storage":"granted",
  "security_storage":"granted",
  "personalization_storage":"granted",
  "wait_for_update":500
});
window._googlesitekitConsentCategoryMap = {"statistics":["analytics_storage"],"marketing":["ad_storage","ad_user_data","ad_personalization"],"functional":["functionality_storage","security_storage"],"preferences":["personalization_storage"]};
          `,
        }}
      />

      {/* Google tag (gtag.js) */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
        id="google_gtagjs-js"
        strategy="afterInteractive"
      />
      <Script
        id="google_gtagjs-js-after"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("set","linker",{"domains":["homeglazer.com"]});
gtag("js", new Date());
gtag("set", "developer_id.dZTNiMT", true);
gtag("config", "${gtag.GA_TRACKING_ID}", {
  page_path: window.location.pathname,
  googlesitekit_post_type: "page"
});
          `,
        }}
      />

      <JsonLd data={ORGANIZATION_JSON_LD(SITE_URL)} />
      <Component {...pageProps} />
      {!path.startsWith('/painting-services') && (
        <>
          <CookieConsent />
          <LocationPopupOrchestrator />
        </>
      )}
    </>
  );
}
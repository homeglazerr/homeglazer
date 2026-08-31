import React from 'react';
import Head from 'next/head';
import type { FAQItem } from '@/data/faq';

interface JsonLdProps {
  data: object | object[];
}

/**
 * Renders JSON-LD structured data in the document head.
 */
export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  const json = Array.isArray(data) ? data : [data];
  return (
    <Head>
      {json.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </Head>
  );
};

/** Matches contact page — used for LocalBusiness / structured data only */
const HG_POSTAL_ADDRESS = {
  '@type': 'PostalAddress' as const,
  streetAddress: 'H-16/137, Sangam Vihar',
  addressLocality: 'New Delhi',
  addressRegion: 'Delhi',
  postalCode: '110080',
  addressCountry: 'IN',
};

const SERVICE_CATALOG_ENTRIES: ReadonlyArray<{
  name: string;
  description: string;
  path: string;
}> = [
  {
    name: 'Residential painting',
    description:
      'Premium residential painting tailored to your style — interiors, exteriors, and finishes.',
    path: '/services/painting/residential',
  },
  {
    name: 'Commercial painting',
    description:
      'Professional painting for offices, retail, and commercial buildings.',
    path: '/services/painting/commercial',
  },
  {
    name: 'Wood coating',
    description:
      'Wood coating and finishing to preserve and beautify wooden surfaces.',
    path: '/services/wood/wood-coating',
  },
  {
    name: 'Kids room painting',
    description:
      "Themed designs and safe paints for children's spaces.",
    path: '/services/painting/kids-room',
  },
  {
    name: 'Wall decor',
    description:
      'Textures, treatments, and artistic wall finishes.',
    path: '/services/wall-decor',
  },
  {
    name: 'Customised painting',
    description:
      'Personalised painting solutions for unique requirements.',
    path: '/services/customized-painting',
  },
];

export const ORGANIZATION_JSON_LD = (siteUrl: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl.replace(/\/$/, '')}/#organization`,
  name: 'HomeGlazer',
  url: siteUrl.replace(/\/$/, ''),
  logo: `${siteUrl.replace(/\/$/, '')}/uploads/hero-banner.png`,
  description: 'Professional painting services including interior, exterior, texture painting, wall decor, and wood services. Transform your space with HomeGlazer.',
  sameAs: [],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-9717256514',
    email: 'homeglazer@gmail.com',
    url: `${siteUrl.replace(/\/$/, '')}/contact`,
    contactType: 'customer service',
    areaServed: 'IN',
  },
});

export const LOCAL_BUSINESS_JSON_LD = (siteUrl: string) => {
  const base = siteUrl.replace(/\/$/, '');
  const localId = `${base}/#localbusiness`;
  const orgId = `${base}/#organization`;

  return {
    '@context': 'https://schema.org',
    '@type': 'PaintingContractor',
    '@id': localId,
    name: 'HomeGlazer',
    description:
      'Professional painting services including interior, exterior, texture painting, wall decor, and wood services in India.',
    url: base,
    image: `${base}/uploads/hero-banner.png`,
    telephone: '+91-9717256514',
    email: 'homeglazer@gmail.com',
    priceRange: '$$',
    parentOrganization: { '@id': orgId },
    address: HG_POSTAL_ADDRESS,
    areaServed: {
      '@type': 'Country',
      name: 'India',
    },
    serviceType: [
      'Interior Painting',
      'Exterior Painting',
      'Texture Painting',
      'Wall Decor',
      'Wood Polishing',
      'Wood Coating',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'HomeGlazer painting services',
      itemListElement: SERVICE_CATALOG_ENTRIES.map((s, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Service',
          name: s.name,
          description: s.description,
          url: `${base}${s.path}`,
          provider: { '@id': localId },
          areaServed: { '@type': 'Country', name: 'India' },
        },
      })),
    },
  };
};

/** FAQPage JSON-LD — use only for FAQ blocks visible on that URL (e.g. full list on /faq, first N on home). */
export const FAQ_PAGE_JSON_LD = (items: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
});

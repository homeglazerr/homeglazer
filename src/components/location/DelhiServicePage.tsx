import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getMediaUrl, getOgImageUrl } from '@/lib/mediaUrl';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import WhatsAppButton from '@/components/home/WhatsAppButton';
import CallButton from '@/components/home/CallButton';
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { JsonLd } from '@/components/seo/JsonLd';
import { ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  imageUrl?: string;
  bulletPoints?: string[];
}

export interface CostTier {
  type: string;
  priceRange: string;
  description: string;
  bestFor: string;
  features: string[];
}

export interface RelatedBlog {
  slug: string;
  title: string;
  excerpt: string;
  readTime?: string;
  coverImage?: string;
  date?: string;
}

export interface DelhiServicePageProps {
  pageTitle: string;
  metaDescription: string;
  canonicalSlug: string;
  h1Title: string;
  heroSubtitle: string;
  heroImage?: string;
  breadcrumbLabel: string;
  badgeLabel?: string;
  aboutTitle: string;
  aboutContent: string[];
  aboutImage?: string;
  serviceFeaturesTitle?: string;
  serviceFeaturesSubtitle?: string;
  serviceFeatures?: FeatureItem[];
  costTiersTitle?: string;
  costTiers?: CostTier[];
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: { title: string; desc: string; image?: string }[];
  faqs: FaqItem[];
  relatedBlogs?: RelatedBlog[];
}

export default function DelhiServicePage({
  pageTitle,
  metaDescription,
  canonicalSlug,
  h1Title,
  heroSubtitle,
  heroImage = '/uploads/hero-banner.webp',
  breadcrumbLabel,
  badgeLabel = 'HOME GLAZER DELHI NCR',
  aboutTitle,
  aboutContent,
  aboutImage = '/uploads/actual-residential-painting.png',
  serviceFeaturesTitle = 'Our Specialised Painting Services in Delhi',
  serviceFeaturesSubtitle = 'Comprehensive painting solutions designed to transform your living spaces with professional expertise.',
  serviceFeatures,
  costTiersTitle,
  costTiers,
  processTitle = 'Our Painting Execution Process',
  processSubtitle = 'Step-by-step roadmap for smooth, high-quality completion of your project.',
  processSteps,
  faqs,
  relatedBlogs = [],
}: DelhiServicePageProps) {
  const [openFaq, setOpenFaq] = useState<number>(-1);
  const canonicalUrl = `${SITE_URL}/${canonicalSlug}`;
  const ogImage = getOgImageUrl(heroImage, SITE_URL);

  const defaultBlogs: RelatedBlog[] = [
    {
      slug: '5-asian-paint-stucco-marble-texture-paint-best-features',
      title: '5 Asian Paint Stucco Marble Texture Paint Best Features',
      excerpt: 'Discover Asian Paint Stucco Marble Texture Paint - a unique paint made with a mixture of minerals that gives walls a lustrous marble-like shine.',
      readTime: '6 min read',
      coverImage: '/uploads/blogs/5-Asian-Paint-Stucco-Marble-Texture-Paint-Best-Features.png',
      date: 'Jan 10, 2026'
    },
    {
      slug: 'guide-to-wooden-polish-shades-for-veneer',
      title: 'A Comprehensive Guide to Wooden Polish Shades for Veneer',
      excerpt: 'Discover the variety of wood polish shades developed specifically for veneer surfaces from classic Natural Clear to modern Grey Wash.',
      readTime: '6 min read',
      coverImage: '/uploads/blogs/A-Comprehensive-Guide-to-Wooden-Polish-Shades-for-Veneer.jpg',
      date: 'Nov 28, 2025'
    },
    {
      slug: '6-amazing-tips-to-maintain-duco-paint-surface',
      title: '6 Amazing Tips to Maintain DUCO Paint Surface',
      excerpt: 'DUCO paint is a smooth, glossy, cost-effective paint for wood decor. Learn 6 amazing tips to maintain your DUCO paint finish.',
      readTime: '7 min read',
      coverImage: '/uploads/blogs/6-Amazing-Tips-to-Maintain-DUCO-Paint-Design-.jpg',
      date: 'Dec 15, 2025'
    }
  ];

  const activeBlogs = relatedBlogs.length > 0 ? relatedBlogs : defaultBlogs;

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: `HomeGlazer - ${h1Title}`,
    image: ogImage,
    url: canonicalUrl,
    telephone: '+919717256514',
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Delhi',
      addressRegion: 'Delhi NCR',
      addressCountry: 'IN',
    },
    areaServed: ['Delhi', 'New Delhi', 'South Delhi', 'North Delhi', 'West Delhi', 'East Delhi', 'Gurgaon', 'Noida'],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <link key="hg-canonical" rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImage} />
      </Head>

      <JsonLd data={localBusinessSchema} />
      <JsonLd data={faqSchema} />

      <div className="bg-white flex flex-col overflow-hidden">
        <Header />

        {/* ===== BREADCRUMBS ===== */}
        <div className="w-[90%] lg:w-[80%] mx-auto pt-28 pb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/services">Services</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/${canonicalSlug}`}>{breadcrumbLabel}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* ===== HERO SECTION ===== */}
        <section className="relative min-h-[80vh] w-full flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ED276E] to-[#299dd7] opacity-90"></div>
          <div className="absolute inset-0">
            <img
              src={getMediaUrl(heroImage)}
              alt={h1Title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 w-full">
            <div className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
                <div className="text-white">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                    {h1Title}
                  </h1>
                  <p className="text-xl md:text-2xl mb-8 leading-relaxed opacity-95">
                    {heroSubtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href="/enquiry"
                      className="bg-white text-[#ED276E] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-center"
                    >
                      Get Free Quote
                    </Link>
                    <Link
                      href="/colour-visualiser"
                      className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#ED276E] transition duration-300 text-center"
                    >
                      Try Color Visualizer
                    </Link>
                  </div>
                </div>
                <div className="hidden lg:flex justify-center">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                    <div className="text-center text-white">
                      <div className="text-4xl font-bold mb-2">35+</div>
                      <div className="text-lg mb-4">YEARS EXPERIENCE</div>
                      <p className="text-sm opacity-90">Trusted by 1000+ Delhi clients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== INTRODUCTION / ABOUT SECTION ===== */}
        <section className="py-20 bg-white">
          <div className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-block bg-gradient-to-r from-[#ED276E] to-[#299dd7] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  {badgeLabel}
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  {aboutTitle}
                </h2>
                <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                  {aboutContent.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 shadow-xl">
                  <img
                    src={getMediaUrl(aboutImage)}
                    alt={aboutTitle}
                    className="w-full h-auto rounded-xl object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-[#ED276E] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">35+</span>
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">Years of Experience</div>
                      <div className="text-sm text-gray-600">Trusted in Delhi NCR</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== SERVICES / FEATURES OVERVIEW ===== */}
        {serviceFeatures && serviceFeatures.length > 0 && (
          <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto">
              <div className="text-center mb-16">
                <div className="inline-block bg-gradient-to-r from-[#ED276E] to-[#299dd7] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  OUR SERVICES
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  {serviceFeaturesTitle}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {serviceFeaturesSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {serviceFeatures.map((feature, idx) => (
                  <div
                    key={idx}
                    className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 flex flex-col justify-between"
                  >
                    <div>
                      {feature.imageUrl ? (
                        <div className="h-56 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative overflow-hidden">
                          <img
                            src={getMediaUrl(feature.imageUrl)}
                            alt={feature.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                      ) : (
                        <div className="h-24 bg-gradient-to-r from-[#ED276E]/10 to-[#299dd7]/10 p-6 flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-r from-[#ED276E] to-[#299dd7] text-white rounded-xl flex items-center justify-center font-bold text-lg">
                            0{idx + 1}
                          </div>
                        </div>
                      )}
                      <div className="p-8">
                        <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                        <p className="text-gray-600 mb-6 leading-relaxed text-base">{feature.description}</p>
                        {feature.bulletPoints && feature.bulletPoints.length > 0 && (
                          <ul className="space-y-2 text-gray-600">
                            {feature.bulletPoints.map((bp, bpIdx) => (
                              <li key={bpIdx} className="flex items-center text-sm">
                                <div className="w-2 h-2 bg-[#ED276E] rounded-full mr-3"></div>
                                {bp}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== COST TIERS SECTION (IF APPLICABLE) ===== */}
        {costTiers && costTiers.length > 0 && (
          <section className="py-20 bg-white">
            <div className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto">
              <div className="text-center mb-16">
                <div className="inline-block bg-gradient-to-r from-[#ED276E] to-[#299dd7] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  PRICING & PACKAGES
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  {costTiersTitle || 'Estimated Painting Cost in Delhi'}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {costTiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border ${
                      idx === 1 ? 'border-[#ED276E] ring-2 ring-[#ED276E]/20' : 'border-gray-100'
                    } flex flex-col justify-between`}
                  >
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#ED276E] bg-pink-50 px-3 py-1 rounded-full">
                        {tier.type}
                      </span>
                      <div className="text-3xl sm:text-4xl font-bold text-gray-900 my-4">
                        {tier.priceRange}
                      </div>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{tier.description}</p>
                      <div className="text-xs font-semibold text-gray-500 bg-gray-50 p-2.5 rounded-lg mb-6">
                        Best For: {tier.bestFor}
                      </div>
                      <ul className="space-y-3 text-sm text-gray-600 mb-8">
                        {tier.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start">
                            <CheckCircle2 className="h-4 w-4 text-[#299dd7] mr-2 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href="/enquiry"
                      className="w-full bg-[#ED276E] text-white py-3.5 rounded-lg font-semibold hover:bg-[#b81d5a] transition duration-300 text-center text-sm block"
                    >
                      Get Free Quote
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== PROCESS SECTION ===== */}
        {processSteps && processSteps.length > 0 && (
          <section className="py-20 bg-white">
            <div className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto">
              <div className="text-center mb-16">
                <div className="inline-block bg-gradient-to-r from-[#ED276E] to-[#299dd7] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  OUR PROCESS
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  {processTitle}
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  {processSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {processSteps.map((step, idx) => (
                  <div key={idx} className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ED276E] to-[#299dd7] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <span className="text-white font-bold text-xl">{idx + 1}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-sm">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ===== WHY CHOOSE US ===== */}
        <WhyChooseUs />

        {/* ===== RELATED BLOGS SECTION ===== */}
        <section className="py-20 bg-white">
          <div className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block bg-gradient-to-r from-[#ED276E] to-[#299dd7] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                EXPLORE OUR BLOG
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                Related Painting Tips & Articles
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover expert advice, shade selection guides, and maintenance tips from HomeGlazer specialists.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeBlogs.map((post, index) => (
                <Link key={index} href={`/blog/${post.slug}`} className="group block">
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                    {post.coverImage && (
                      <div className="h-52 overflow-hidden relative">
                        <img
                          src={getMediaUrl(post.coverImage)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex flex-col flex-grow justify-between">
                      <div>
                        <div className="flex items-center text-xs font-semibold text-[#ED276E] mb-3">
                          <span>{post.date || 'HomeGlazer Blog'}</span>
                          {post.readTime && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{post.readTime}</span>
                            </>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#299dd7] transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center font-bold text-sm text-[#ED276E] group-hover:text-[#299dd7] transition-colors">
                        Read Full Article <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-block bg-[#ED276E] hover:bg-[#299dd7] text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-md text-sm"
              >
                View All Blog Articles
              </Link>
            </div>
          </div>
        </section>

        {/* ===== FAQS SECTION ===== */}
        {faqs && faqs.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto">
              <div className="text-center mb-16">
                <div className="inline-block bg-gradient-to-r from-[#ED276E] to-[#299dd7] text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                  FREQUENTLY ASKED QUESTIONS
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
                  Questions About Painting in Delhi?
                </h2>
              </div>

              <div className="max-w-4xl mx-auto space-y-4">
                {faqs.map((faq, index) => {
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-md transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : index)}
                        className="w-full px-8 py-6 text-left flex justify-between items-center gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-bold text-gray-900 text-lg sm:text-xl">{faq.question}</span>
                        <ChevronDown
                          className={`h-6 w-6 text-[#ED276E] transition-transform duration-200 flex-shrink-0 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <div className="px-8 pb-6 pt-2 text-gray-600 text-base leading-relaxed border-t border-gray-100">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ===== CTA SECTION ===== */}
        <section className="py-20 bg-gradient-to-r from-[#ED276E] to-[#299dd7] w-full mt-16">
          <div className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto text-center">
            <h2 className="text-white text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Space?
            </h2>
            <p className="text-white text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Let our experienced team bring your vision to life with professional painting services in Delhi NCR. Contact us today for a free consultation and quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                href="/enquiry"
                className="bg-white text-[#ED276E] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition duration-300 text-lg"
              >
                Get Free Quote
              </Link>
              <Link
                href="/colour-visualiser"
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#ED276E] transition duration-300 text-lg"
              >
                Try Color Visualizer
              </Link>
            </div>
          </div>
        </section>

        {/* ===== MOBILE ACTION BUTTONS ===== */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
          <div className="flex gap-3">
            <Link
              href="/enquiry"
              className="flex-1 bg-[#ED276E] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-[#b81d5a] transition flex items-center justify-center text-[15px]"
            >
              Enquire Now
            </Link>
            <Link
              href="/colour-visualiser"
              className="flex-1 bg-[#299dd7] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-[#237bb0] transition flex items-center justify-center text-[15px]"
            >
              Color Visualiser
            </Link>
          </div>
        </div>

        <Footer />
        <CallButton />
        <WhatsAppButton />
      </div>
    </>
  );
}

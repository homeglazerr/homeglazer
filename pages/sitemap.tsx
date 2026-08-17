import React from 'react';
import Head from 'next/head';
import { getOgImageUrl } from '@/lib/mediaUrl';
import type { FAQItem } from '@/data/faq';
import { JsonLd, FAQ_PAGE_JSON_LD } from '@/components/seo/JsonLd';
import Link from 'next/link';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppButton from '@/components/home/WhatsAppButton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { 
  Home, 
  Info, 
  Mail, 
  HelpCircle, 
  Image, 
  Paintbrush, 
  Palette, 
  Calculator, 
  Eye, 
  FileText,
  ChevronRight,
  Building2,
  Sparkles,
  TreePine,
  ShoppingBag
} from 'lucide-react';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

const linkClass = 'text-[#299dd7] font-medium hover:underline';

const h2Article =
  'text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2';

const sitemapPageFaq: FAQItem[] = [
  {
    question: 'Is this page the same as the XML sitemap search engines use?',
    answer:
      'No. This is a human-friendly HTML overview so you can click through to key sections. Crawlers and tools typically use our machine-readable sitemap index (for example sitemap.xml) for discovery at scale. Both have a role: machines need the feed; people often prefer this layout when they are browsing on a phone or sending a link to family.',
  },
  {
    question: 'Where should I start if I am new to HomeGlazer?',
    answer:
      'Most visitors begin with painting services or the colour visualiser, then use the paint budget calculator when they have a rough area. If you already know you want a site visit, enquiry or contact is fastest. This sitemap is the map—you can jump to any of those entry points from the sections above.',
  },
  {
    question: 'What is the difference between “Tools & Calculators” and “Painting Services”?',
    answer:
      'Tools help you estimate or preview before you commit. Services describe how we execute work on site—residential, commercial, wall decor, wood, and customised options. You might spend an evening in calculators, then read a service page to understand prep, timelines, and what we take responsibility for.',
  },
  {
    question: 'Why are product brand links grouped under one browse page?',
    answer:
      'The products section is a filterable catalog reference. Brand tabs on /products narrow the grid; individual product detail URLs exist under each brand. If you need a quote rather than a catalogue browse, pairing product notes with an enquiry saves back-and-forth.',
  },
  {
    question: 'Does the sitemap list every blog post?',
    answer:
      'We link to the blog index so you can search and paginate there. Listing hundreds of articles here would bury the core service links. For deep archives, open Blog Articles from the grid or use site search if available in the header.',
  },
  {
    question: 'Which links cover legal and privacy information?',
    answer:
      'Under Blog & Resources you will find Privacy Policy, Cookie Policy, and Terms & Conditions. They sit alongside FAQ and contact so compliance pages are never more than a click away from help content.',
  },
  {
    question: 'I need wood polishing, not wall paint—where do I go?',
    answer:
      'Use the Wood Services section for carpentry, wood coating, and wood polishing. The wood polishing calculator lives under Tools & Calculators if you want indicative numbers before you message us.',
  },
  {
    question: 'Something looks outdated or a link fails—what should I do?',
    answer:
      'Tell us via the contact page with the URL you tried. We fix broken routes quickly because this index is also our internal sanity check for major IA changes.',
  },
];

interface SitemapLink {
  name: string;
  href: string;
  children?: SitemapLink[];
}

interface SitemapSection {
  title: string;
  icon: React.ReactNode;
  links: SitemapLink[];
}

const sitemapData: SitemapSection[] = [
  {
    title: "General Pages",
    icon: <Home className="w-5 h-5" />,
    links: [
      { name: "Home", href: "/" },
      { name: "About Us", href: "/about" },
      { name: "Testimonials", href: "/testimonials" },
      { name: "Contact", href: "/contact" },
      { name: "Enquiry", href: "/enquiry" },
      { name: "FAQ", href: "/faq" },
      { name: "Gallery", href: "/gallery" },
    ]
  },
  {
    title: "Painting Services",
    icon: <Paintbrush className="w-5 h-5" />,
    links: [
      { 
        name: "Painting Services", 
        href: "/services/painting",
        children: [
          { name: "Residential Painting", href: "/services/painting/residential" },
          { name: "Commercial Painting", href: "/services/painting/commercial" },
          { name: "Kids Room Painting", href: "/services/painting/kids-room" },
        ]
      },
    ]
  },
  {
    title: "Customized Painting",
    icon: <Sparkles className="w-5 h-5" />,
    links: [
      { 
        name: "Customized Painting", 
        href: "/services/customized-painting",
        children: [
          { name: "Interior Painting", href: "/services/customized-painting/interior-painting" },
          { name: "Exterior Painting", href: "/services/customized-painting/exterior-painting" },
          { name: "One Day Painting", href: "/services/customized-painting/one-day-painting" },
          { name: "Per Day Painting", href: "/services/customized-painting/per-day-painting" },
        ]
      },
    ]
  },
  {
    title: "Wall Decor",
    icon: <Palette className="w-5 h-5" />,
    links: [
      { 
        name: "Wall Decor Services", 
        href: "/services/wall-decor",
        children: [
          { name: "Graffiti Painting", href: "/services/wall-decor/graffiti-painting" },
          { name: "Stencil Art", href: "/services/wall-decor/stencil-art" },
          { name: "Texture Painting", href: "/services/wall-decor/texture-painting" },
          { name: "Wallpaper", href: "/services/wall-decor/wallpaper" },
        ]
      },
    ]
  },
  {
    title: "Wood Services",
    icon: <TreePine className="w-5 h-5" />,
    links: [
      { 
        name: "Wood Services", 
        href: "/services/wood-services",
        children: [
          { name: "Carpentry", href: "/services/wood/carpentry" },
          { name: "Wood Coating", href: "/services/wood/wood-coating" },
          { name: "Wood Polishing", href: "/services/wood/wood-polishing" },
        ]
      },
    ]
  },
  {
    title: "Products",
    icon: <ShoppingBag className="w-5 h-5" />,
    links: [
      { 
        name: "Browse All Products", 
        href: "/products",
        children: [
          { name: "Asian Paints", href: "/products" },
          { name: "Berger Paints", href: "/products" },
          { name: "Kansai Nerolac", href: "/products" },
          { name: "JSW Paints", href: "/products" },
          { name: "Birla Opus", href: "/products" },
        ]
      },
    ]
  },
  {
    title: "Tools & Calculators",
    icon: <Calculator className="w-5 h-5" />,
    links: [
      { 
        name: "Paint Budget Calculator", 
        href: "/paint-budget-calculator",
        children: [
          { name: "Painting Calculator", href: "/calculator/painting" },
          { name: "Wood Polishing Calculator", href: "/calculator/wood-polishing" },
        ]
      },
    ]
  },
  {
    title: "Colour Visualisers",
    icon: <Eye className="w-5 h-5" />,
    links: [
      { 
        name: "Colour Visualiser", 
        href: "/colour-visualiser",
        children: [
          { name: "Basic Visualiser", href: "/colour-visualiser/basic" },
          { name: "Advanced Visualiser", href: "/colour-visualiser/advanced" },
        ]
      },
    ]
  },
  {
    title: "Blog & Resources",
    icon: <FileText className="w-5 h-5" />,
    links: [
      { name: "Blog Articles", href: "/blog" },
      { name: "FAQ", href: "/faq" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Cookie Policy", href: "/cookie-policy" },
      { name: "Terms & Conditions", href: "/terms-and-condition" },
    ]
  },
];

const SitemapLinkItem: React.FC<{ link: SitemapLink; isChild?: boolean }> = ({ link, isChild = false }) => {
  return (
    <div className={isChild ? "ml-6" : ""}>
      <Link 
        href={link.href}
        className={`
          group flex items-center gap-2 py-2 
          ${isChild 
            ? "text-gray-600 hover:text-[#ED276E]" 
            : "text-[#299dd7] font-medium hover:text-[#ED276E]"
          }
          transition-colors duration-200
        `}
      >
        <ChevronRight className={`w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 ${isChild ? "text-gray-400" : "text-[#299dd7]"}`} />
        <span>{link.name}</span>
      </Link>
      {link.children && link.children.length > 0 && (
        <div className="border-l-2 border-gray-200 ml-2">
          {link.children.map((child, index) => (
            <SitemapLinkItem key={index} link={child} isChild />
          ))}
        </div>
      )}
    </div>
  );
};

const SitemapSection: React.FC<{ section: SitemapSection }> = ({ section }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="bg-[#299dd7] px-6 py-4">
        <div className="flex items-center gap-3 text-white">
          {section.icon}
          <h2 className="text-lg font-semibold">{section.title}</h2>
        </div>
      </div>
      <div className="p-6">
        {section.links.map((link, index) => (
          <SitemapLinkItem key={index} link={link} />
        ))}
      </div>
    </div>
  );
};

const Sitemap: React.FC = () => {
  return (
    <>
      <Head>
        <title>Sitemap | HomeGlazer - All Pages</title>
        <meta
          name="description"
          content="Human-friendly sitemap for HomeGlazer: painting services, wall decor, wood work, products, colour visualisers, calculators, blog, and policies. Find any main page in one place."
        />
        <meta property="og:title" content="Sitemap | HomeGlazer - All Pages" />
        <meta
          property="og:description"
          content="Browse every major section—services, tools, products, visualisers, blog, and legal—in one click-friendly map."
        />
        <meta property="og:image" content={getOgImageUrl("/uploads/hero-banner.png", SITE_URL)} />
        <meta name="twitter:title" content="Sitemap | HomeGlazer - All Pages" />
        <meta name="twitter:description" content="All key HomeGlazer pages in one place—services, calculators, products, visualisers, and resources." />
        <meta name="twitter:image" content={getOgImageUrl("/uploads/hero-banner.png", SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(sitemapPageFaq)} />
      <div className="bg-gray-50 flex flex-col overflow-hidden items-center min-h-screen">
        <Header />
      
      {/* Breadcrumb */}
      <div className="w-[90%] lg:w-[80%] mx-auto pt-28">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/sitemap">Sitemap</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#ED276E] to-[#299dd7] py-16 mt-8">
        <div className="w-[90%] lg:w-[80%] mx-auto text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Sitemap
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto">
            Navigate through all our pages and discover our complete range of painting services, 
            tools, and resources.
          </p>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="w-full bg-white py-12">
        <div className="w-[90%] lg:w-[80%] mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Quick Links
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/enquiry" 
              className="px-6 py-3 border-2 border-gray-300 text-gray-500 rounded-lg font-medium hover:bg-[#ED276E] hover:border-[#ED276E] hover:text-white transition-colors duration-200"
            >
              Get a Quote
            </Link>
            <Link 
              href="/paint-budget-calculator" 
              className="px-6 py-3 border-2 border-gray-300 text-gray-500 rounded-lg font-medium hover:bg-[#ED276E] hover:border-[#ED276E] hover:text-white transition-colors duration-200"
            >
              Budget Calculator
            </Link>
            <Link 
              href="/colour-visualiser" 
              className="px-6 py-3 border-2 border-gray-300 text-gray-500 rounded-lg font-medium hover:bg-[#ED276E] hover:border-[#ED276E] hover:text-white transition-colors duration-200"
            >
              Colour Visualiser
            </Link>
            <Link 
              href="/products" 
              className="px-6 py-3 border-2 border-gray-300 text-gray-500 rounded-lg font-medium hover:bg-[#ED276E] hover:border-[#ED276E] hover:text-white transition-colors duration-200"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>

      {/* Sitemap Grid */}
      <section className="w-[90%] lg:w-[80%] mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitemapData.map((section, index) => (
            <SitemapSection key={index} section={section} />
          ))}
        </div>
      </section>

      <section className="w-[90%] lg:w-[80%] max-w-3xl mx-auto py-12 md:py-14 border-t border-gray-200 text-left bg-gray-50">
        <article className="prose prose-lg max-w-none text-left text-[rgba(64,80,94,1)] prose-a:no-underline prose-strong:text-gray-900">
          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>How to use this page when you are in a hurry</h2>
          <p className="mb-5">
            Think of the grid above as the lobby directory for the rest of the site. Each card groups related URLs so
            you do not have to guess whether wallpaper sits under painting or wall decor, or where the wood polishing
            calculator moved after a redesign. If you already know what you want, the Quick Links row under the hero is
            even faster—quote, budget, colour, catalog—in that order for how most renovation journeys unfold.
          </p>
          <p className="mb-5">
            If you are coordinating with someone else—spouse, landlord, or facilities manager—this sitemap is also an
            easy link to share. It beats dictating fifteen paths over the phone. For anything that needs measurements or
            photos, you will still end up on{' '}
            <Link href="/enquiry" className={linkClass}>
              enquiry
            </Link>{' '}
            or{' '}
            <Link href="/contact" className={linkClass}>
              contact
            </Link>
            , but you arrive there having already seen the full menu of options.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Typical paths homeowners follow</h2>
          <p className="mb-5">
            <strong>“I only know my flat needs paint.”</strong> Start with{' '}
            <Link href="/painting-services" className={linkClass}>
              painting services
            </Link>{' '}
            or residential painting, then open the{' '}
            <Link href="/paint-budget-calculator" className={linkClass}>
              paint budget calculator
            </Link>{' '}
            once you have a rough carpet area. Add the{' '}
            <Link href="/colour-visualiser" className={linkClass}>
              colour visualiser
            </Link>{' '}
            when the brief is emotional—“calm sage” versus “hotel white”—not just square feet.
          </p>
          <p className="mb-5">
            <strong>“I am comparing brands before I talk to anyone.”</strong> The{' '}
            <Link href="/products" className={linkClass}>
              products
            </Link>{' '}
            area is informational: use it to align names and lines, then cross-check with our team for substrate fit.
            Pair browsing with the{' '}
            <Link href="/faq" className={linkClass}>
              FAQ
            </Link>{' '}
            when you wonder how crews, materials, or timelines actually work in practice.
          </p>
          <p className="mb-5">
            <strong>“Woodwork matters as much as walls.”</strong> Follow Wood Services for polishing and coating, and
            keep the{' '}
            <Link href="/calculator/wood-polishing" className={linkClass}>
              wood polishing calculator
            </Link>{' '}
            handy so trims and doors are not priced as an afterthought. Large wall-and-wood refreshes often run the{' '}
            <Link href="/calculator/painting" className={linkClass}>
              painting calculator
            </Link>{' '}
            in parallel.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Why we still publish a manual sitemap in 2026</h2>
          <p className="mb-5">
            Search engines discover pages through feeds and links, but humans still get lost inside ten-level menus on
            mobile. A single page that answers “what exists here?” reduces bounce and support pings. It also reinforces
            topical structure: services versus tools versus catalog versus editorial content. When we add a major hub, it
            appears in this grid so returning clients notice new capability without reading release notes.
          </p>
          <p className="mb-5">
            Pricing transparency does not live on this URL—the calculators and your eventual written quote handle
            numbers—but orientation does. If you are deciding whether to hire professionals versus DIY for a tricky
            texture or exterior, skim{' '}
            <Link href="/services/wall-decor/texture-painting" className={linkClass}>
              texture painting
            </Link>{' '}
            or customised painting pages before you assume labour is interchangeable with a single bucket change.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Policies, proof, and next steps</h2>
          <p className="mb-5">
            Legal and privacy documents share the Blog & Resources card with the{' '}
            <Link href="/blog" className={linkClass}>
              blog
            </Link>{' '}
            index—handy if you landed from search and need both inspiration and compliance in one bookmark. Testimonials
            and gallery pages are under General Pages for social proof when you are still sceptical. None of that
            replaces a site visit, but it shortens the trust gap between first click and first meeting.
          </p>
          <p className="mb-5">
            When you are ready to move from browsing to scheduling, the section below points you straight at humans. Use
            it if the grid did not surface a niche case—we would rather hear “I need X” than lose you in navigation.
          </p>
        </article>
      </section>

      <section className="w-[90%] lg:w-[80%] max-w-3xl mx-auto pb-14 md:pb-16 text-center bg-gray-50">
        <h2 className="text-2xl font-bold text-[#299dd7] mb-3 scroll-mt-24">Frequently asked questions</h2>
        <p className="text-[rgba(64,80,94,1)] mb-6 mx-auto max-w-2xl text-base md:text-lg font-light">
          HTML sitemap versus XML, where to start, products, blog depth, and wood versus paint paths.
        </p>
        <Accordion type="single" collapsible className="w-full space-y-3 text-left">
          {sitemapPageFaq.map((item, index) => (
            <AccordionItem
              key={`sitemap-faq-${index}`}
              value={`item-${index}`}
              className="border border-gray-200 rounded-lg px-1 bg-white"
            >
              <AccordionTrigger className="px-4 py-4 text-left font-semibold text-gray-900 hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-gray-700 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#ED276E] to-[#299dd7] w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white text-3xl md:text-[40px] font-medium mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-white text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Our team is here to help. Contact us directly and we'll guide you to the right service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/contact" 
              className="bg-white text-[#ED276E] hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-medium transition-colors duration-200"
            >
              Contact Us
            </Link>
            <Link 
              href="/faq" 
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-4 rounded-lg font-medium transition-colors duration-200"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
      
      {/* Mobile Action Buttons - Fixed at Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex gap-3">
          <Link 
            href="/enquiry" 
            className="flex-1 bg-[#ED276E] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-[#b81d5a] transition flex items-center justify-center text-[15px]"
          >
            Enquire Now
          </Link>
          <Link 
            href="/paint-budget-calculator" 
            className="flex-1 bg-[#299dd7] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-[#237bb0] transition flex items-center justify-center text-[15px]"
          >
            Budget Calculator
          </Link>
        </div>
      </div>
      
      <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default Sitemap;

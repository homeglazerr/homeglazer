
import React from "react";
import Head from "next/head";
import type { FAQItem } from '@/data/faq';
import { JsonLd, FAQ_PAGE_JSON_LD } from '@/components/seo/JsonLd';
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import WhatsAppButton from "@/components/home/WhatsAppButton";
import { getMediaUrl, getOgImageUrl } from "@/lib/mediaUrl";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';
const PAINTING_HERO_IMAGE = "/uploads/services/residential-painting.jpg";

const linkClass = 'text-[#299dd7] font-medium hover:underline';

const h2Article =
  'text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2';

const paintingHubFaq: FAQItem[] = [
  {
    question: 'How do residential painting projects differ from commercial ones?',
    answer:
      'Homes prioritise odour control, furniture protection, and quiet hours; offices prioritise brand colour tolerances, night-shift sequencing, and fire signage compliance. Crew sizing, lift bookings, and primer systems shift accordingly—same craft, different risk registers.',
  },
  {
    question: 'Are kids room paints safer or low-odour by default?',
    answer:
      'We recommend washable, low-VOC lines suited to crayons and scrub cycles—not buzzwords alone. Specify sensitivities early; some palettes still need tinted bases that extend curing gaps before toddlers sleep in freshly coated rooms.',
  },
  {
    question: 'Can you match our corporate brand colours on retail walls?',
    answer:
      'Yes, when we receive Pantone or authorised fan references plus lighting context—warm GU10 versus cool tube skew matches. Commercial pages detail sampling protocols before bulk drums arrive.',
  },
  {
    question: 'Do you waterproof before painting bathrooms or exterior cracks?',
    answer:
      'Structural leak remediation belongs to civil specialists first; we integrate compatible primers and topcoats after substrates read dry on meters. Hiding active damp behind emulsion fails everyone within one monsoon.',
  },
  {
    question: 'How long does a typical 3BHK residential repaint take?',
    answer:
      'Sound plaster with standard colour shifts might finish within several crew-days; heavy putty, deep accent hues, or occupied phasing stretch timelines. Share photos and occupancy constraints for honest schedules, not showroom promises.',
  },
  {
    question: 'Should I read residential painting before kids room mood boards?',
    answer:
      'Skim residential for process norms—masking, primer stacks—then jump to kids room for theme, durability, and lighting interplay. Wall decor extras appear under wall decor when murals exceed flat colour.',
  },
  {
    question: 'Where does HomeGlazer provide these painting services?',
    answer:
      'Delhi NCR and nearby sectors—confirm pin code and society rules when booking commercial crews or rope-access exteriors.',
  },
  {
    question: 'How do I budget before I pick residential versus commercial scope?',
    answer:
      'Use the paint budget calculator for envelopes, refine with the painting cost calculator, then send outputs through enquiry so estimators align mobilisation style with your segment.',
  },
];

const PaintingServices: React.FC = () => {
  return (
    <>
      <Head>
        <title>Painting Services | HomeGlazer - Residential & Commercial</title>
        <meta
          name="description"
          content="Painting services hub for Delhi NCR: residential, commercial, and kids room painting. Compare scopes, budgets, prep, and timelines—FAQs plus links to each specialist route."
        />
        <meta property="og:title" content="Painting Services | HomeGlazer - Residential & Commercial" />
        <meta
          property="og:description"
          content="Residential refresh, commercial branding, kids rooms—guides, FAQs, and links to each painting service."
        />
        <meta property="og:image" content={getOgImageUrl(PAINTING_HERO_IMAGE, SITE_URL)} />
        <meta name="twitter:title" content="Painting Services | HomeGlazer" />
        <meta name="twitter:description" content="Painting hub: homes, offices, kids rooms—planning content and FAQs for Indian spaces." />
        <meta name="twitter:image" content={getOgImageUrl(PAINTING_HERO_IMAGE, SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(paintingHubFaq)} />
      <div className="relative min-h-screen flex flex-col">
        <Header />
      <main className="flex-grow pt-28">
        <div className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto">
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
                <BreadcrumbLink href="/services/painting">Painting Services</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <section
          className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto pt-6 pb-16 md:pb-20"
          aria-labelledby="painting-services-hub-heading"
        >
          <h1
            id="painting-services-hub-heading"
            className="text-3xl md:text-4xl font-bold text-center text-[var(--brand-pink)] mb-3 md:mb-4"
          >
            Professional painting for homes, offices &amp; kids&apos; rooms
          </h1>
          <p className="text-center text-[rgba(64,80,94,1)] max-w-3xl mx-auto mb-5 md:mb-6 text-base md:text-lg font-light leading-relaxed">
            Residential refresh, commercial branding or a playful kids&apos; space—explore the package that matches your project.
          </p>
          <h2 className="text-2xl md:text-[28px] font-bold text-center text-[#299dd7] mb-6 md:mb-8">
            Residential, commercial &amp; kids room painting
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/uploads/services/residential-painting.jpg")} 
                alt="Residential" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Residential</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Transform your home with smooth, lasting colour.</p>
                <Link 
                  href="/services/painting/residential"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/uploads/services/commercial-painting.jpg")} 
                alt="Commercial" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Commercial</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Professional finishes that elevate your business space.</p>
                <Link 
                  href="/services/painting/commercial"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/assets/images/kidsroom/kidsroom1/kidsroom1.jpg")} 
                alt="Kids Room" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Kids Room</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Bright, playful colours made safe and fun for kids.</p>
                <Link 
                  href="/services/painting/kids-room"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-14 md:mt-16 pt-10 md:pt-12 border-t border-gray-200 w-full">
            <article className="prose prose-lg max-w-3xl mx-auto text-left text-[rgba(64,80,94,1)] prose-a:no-underline prose-strong:text-gray-900">
              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Choosing the right lane before you open paint chips</h2>
              <p className="mb-5">
                This hub splits painting into three realities that share brushes but not priorities.{' '}
                <Link href="/services/painting/residential" className={linkClass}>
                  Residential painting
                </Link>{' '}
                optimises for families who still cook dinner between drying coats;{' '}
                <Link href="/services/painting/commercial" className={linkClass}>
                  commercial painting
                </Link>{' '}
                optimises for signage contrast, after-hours noise ordinances, and facility managers who photograph lift
                scratches;{' '}
                <Link href="/services/painting/kids-room" className={linkClass}>
                  kids room painting
                </Link>{' '}
                optimises for scrubbability, theme storytelling, and parents who change their minds after seeing daylight
                wash out neon accents.
              </p>
              <p className="mb-5">
                Pick the tile that matches who signs the cheque and who suffers if dust escapes—then read deeper on the
                child page. The paragraphs below explain how budgets, compliance, and decoration layers interact so you do
                not buy residential empathy when you actually need brand manuals.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Use cases we see weekly across Delhi NCR</h2>
              <p className="mb-5">
                <strong>Pre-handover flats.</strong> Buyers soften developer whites, unify balcony soffits with living
                palettes, and occasionally chase accent walls before movers arrive—usually residential workflows with tight
                lift calendars.
              </p>
              <p className="mb-5">
                <strong>Retail refreshes between franchise audits.</strong> Rollouts demand repeatable colour tolerances
                across outlets—commercial crews carry spectro references and punch-list discipline residential teams rarely
                need.
              </p>
              <p className="mb-5">
                <strong>Growing families repurposing bedrooms.</strong> Toddler upgrades shift from pastel calm to homework
                zones with magnetic paints or writable bands—often kids room scope layered atop residential prep standards.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Pricing insight: apples-to-apples across segments</h2>
              <p className="mb-5">
                Commercial bids sometimes look cheaper per square foot until you add night-shift multipliers, induction
                paperwork, or rapid rework when brand QA rejects sheen mismatch. Residential bids might appear higher because
                they honestly book hoover-grade cleanup and slower drying when grandma still occupies the guest room.
              </p>
              <p className="mb-5">
                Kids rooms add litre counts—not always cash—because playful palettes need extra opacity passes. Compare
                estimates by primer system, putty passes, and masking scope, not headline rupees. Run numbers through the{' '}
                <Link href="/paint-budget-calculator" className={linkClass}>
                  paint budget calculator
                </Link>{' '}
                and{' '}
                <Link href="/calculator/painting" className={linkClass}>
                  painting cost calculator
                </Link>{' '}
                before emotional decisions.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Benefits of routing through this hub first</h2>
              <p className="mb-5">
                You brief crews who already understand your segment—fewer mid-job pivots when someone realises the “office”
                is actually a loud culinary classroom needing durable eggshell instead of flat matt. You also avoid
                under-buying decoration when flat paint alone cannot deliver the narrative—our{' '}
                <Link href="/services/wall-decor" className={linkClass}>
                  wall decor
                </Link>{' '}
                specialists pick up where rollers stop.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Connections across HomeGlazer services</h2>
              <p className="mb-5">
                Large-scope orientation lives on{' '}
                <Link href="/painting-services" className={linkClass}>
                  painting services
                </Link>
                ; scheduling gymnastics live under{' '}
                <Link href="/services/customized-painting" className={linkClass}>
                  customized painting
                </Link>{' '}
                when one-day or per-day formats matter. Timber trims that repaint alongside walls may coordinate with{' '}
                <Link href="/services/wood-services" className={linkClass}>
                  wood services
                </Link>
                . Colour psychology experiments begin in the{' '}
                <Link href="/colour-visualiser" className={linkClass}>
                  colour visualiser
                </Link>
                ; SKU facts live on{' '}
                <Link href="/products" className={linkClass}>
                  products
                </Link>
                .
              </p>
              <p className="mb-5">
                Proof points appear in{' '}
                <Link href="/testimonials" className={linkClass}>
                  testimonials
                </Link>
                ; policy nuance appears in the{' '}
                <Link href="/faq" className={linkClass}>
                  FAQ
                </Link>
                . Ready to translate intent into a booked crew? Use{' '}
                <Link href="/enquiry" className={linkClass}>
                  enquiry
                </Link>{' '}
                with photos and segment tags, or{' '}
                <Link href="/contact" className={linkClass}>
                  contact
                </Link>{' '}
                when procurement teams need formal paperwork.
              </p>
            </article>
          </div>

          <div className="mt-10 md:mt-12 pb-4 max-w-3xl mx-auto w-full text-center">
            <h2 className="text-2xl font-bold text-[#299dd7] mb-3 scroll-mt-24">Frequently asked questions</h2>
            <p className="text-[rgba(64,80,94,1)] mb-6 text-base md:text-lg font-light">
              Residential vs commercial, kids rooms, waterproofing, timelines, and budgeting.
            </p>
            <Accordion type="single" collapsible className="w-full space-y-3 text-left">
              {paintingHubFaq.map((item, index) => (
                <AccordionItem
                  key={`painting-hub-faq-${index}`}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg px-1 bg-gray-50"
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
          </div>
        </section>
      </main>
      
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex gap-3">
          <Link href="/enquiry" className="flex-1 bg-[#ED276E] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-[#b81d5a] transition flex items-center justify-center text-[15px]">
            Enquire Now
          </Link>
          <Link href="/paint-budget-calculator" className="flex-1 bg-[#299dd7] text-white py-3 px-4 rounded-lg font-medium text-center hover:bg-[#237bb0] transition flex items-center justify-center text-[15px]">
            Budget Calculator
          </Link>
        </div>
      </div>
      
      <WhatsAppButton />
        <Footer />
      </div>
    </>
  );
};

export default PaintingServices;

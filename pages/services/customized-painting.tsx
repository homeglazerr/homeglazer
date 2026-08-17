
import React from "react";
import Head from "next/head";
import type { FAQItem } from '@/data/faq';
import { JsonLd, FAQ_PAGE_JSON_LD } from '@/components/seo/JsonLd';
import { getMediaUrl, getOgImageUrl } from "@/lib/mediaUrl";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import WhatsAppButton from "@/components/home/WhatsAppButton";
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
const CUSTOMIZED_HERO_IMAGE = "/assets/images/outdoor/outdoor1/outdoor1.jpg";

const linkClass = 'text-[#299dd7] font-medium hover:underline';

const h2Article =
  'text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2';

const customizedPaintingHubFaq: FAQItem[] = [
  {
    question: 'What is the difference between one-day painting and per-day painting?',
    answer:
      'One-day formats compress mobilisation, masking, and rolling into a controlled sprint when surfaces are sound and scope is agreed in advance. Per-day plans spread labour across calendar days—ideal when rooms stay partly occupied, drying windows are tight in monsoon weeks, or civil touch-ups still compete for access. Neither sacrifices specification; they sequence crew hours differently.',
  },
  {
    question: 'Can I combine exterior and interior painting in one booking?',
    answer:
      'Yes, when weather, lift slots, and scaffold calendars align. Mixing trades sometimes saves mobilisation; sometimes it fights for drying shade. Tell us elevation exposure and society solvent-hour rules up front so we schedule façade passes when interior masking will not cross-contaminate wet trims.',
  },
  {
    question: 'Does “customized” automatically mean more expensive than standard packages?',
    answer:
      'Not always—custom means scope follows your calendar and substrate truth, not a brochure checklist. You might pay less by phasing bedrooms across quarters or more because heritage plaster demands extra primer passes. Transparency lives in line items: products, prep hours, and protection—not a vague “premium” label.',
  },
  {
    question: 'How should I prepare my home for faster interior or one-day slots?',
    answer:
      'Clear fragile décor, cluster furniture to room centres with plastic allowance, confirm power for lights and lifts, and resolve leak sources before masking begins. Share photos of cracks and previous enamel zones through enquiry so primer chemistry matches reality before crews arrive.',
  },
  {
    question: 'Is exterior painting safe during Delhi NCR monsoon?',
    answer:
      'Water-based façade systems can proceed under disciplined dew-point watches; solvent-heavy enamels may wait for drier windows. We refuse rushed skins that will chalk within weeks—better slip schedule than replace failure. Mention north versus south faces when asking for dates.',
  },
  {
    question: 'Can I choose specific paint brands or sheen levels?',
    answer:
      'Absolutely—subject to stock and compatibility with existing films. Cross-read grades on our products page, then align tint bases with choices from the colour visualiser so reorder drums match batch tolerance.',
  },
  {
    question: 'How do budgets plug into your calculators?',
    answer:
      'Start with the paint budget calculator for envelope thinking, refine with the painting cost calculator when dimensions firm up, and cite both outputs in enquiry so estimators honour your assumptions.',
  },
  {
    question: 'Where does HomeGlazer offer customized painting?',
    answer:
      'We operate across Delhi NCR and nearby sectors. Pin codes and society entry rules help us assign crews efficiently—mention them early.',
  },
];

const CustomizedPainting: React.FC = () => {
  return (
    <>
      <Head>
        <title>Customized Painting | HomeGlazer - Interior & Exterior</title>
        <meta
          name="description"
          content="Customized painting in Delhi NCR: interior, exterior, one-day, and per-day plans. Compare schedules, budgets, and prep—FAQs, guides, and links to each tailored painting service."
        />
        <meta property="og:title" content="Customized Painting | HomeGlazer - Interior & Exterior" />
        <meta
          property="og:description"
          content="Flexible interior and exterior painting plus one-day and per-day options—planning guides, FAQs, and routes to each service."
        />
        <meta property="og:image" content={getOgImageUrl(CUSTOMIZED_HERO_IMAGE, SITE_URL)} />
        <meta name="twitter:title" content="Customized Painting | HomeGlazer" />
        <meta name="twitter:description" content="Custom painting hub: exterior, interior, one-day, per-day—guides and FAQs for Delhi NCR homes and offices." />
        <meta name="twitter:image" content={getOgImageUrl(CUSTOMIZED_HERO_IMAGE, SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(customizedPaintingHubFaq)} />
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
                <BreadcrumbLink href="/services/customized-painting">Customized Painting</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <section
          className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto pt-6 pb-16 md:pb-20"
          aria-labelledby="custom-painting-heading"
        >
          <h1
            id="custom-painting-heading"
            className="text-3xl md:text-4xl font-bold text-center text-[var(--brand-pink)] mb-3 md:mb-4"
          >
            Custom painting tailored to your space and schedule
          </h1>
          <p className="text-center text-[rgba(64,80,94,1)] max-w-3xl mx-auto mb-5 md:mb-6 text-base md:text-lg font-light leading-relaxed">
            Interior and exterior packages plus one-day and per-day options—pick the format that fits your renovation timeline.
          </p>
          <h2 className="text-2xl md:text-[28px] font-bold text-center text-[#299dd7] mb-6 md:mb-8">
            Interior, exterior &amp; flexible painting plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl(CUSTOMIZED_HERO_IMAGE)} 
                alt="Exterior Painting" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Exterior Painting</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Durable finishes that protect from the outside.</p>
                <Link 
                  href="/services/customized-painting/exterior-painting"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/assets/images/bedroom/bedroom1/bedroom1.jpg")} 
                alt="Interior Painting" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Interior Painting</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Fresh, flawless walls that bring your space to life.</p>
                <Link 
                  href="/services/customized-painting/interior-painting"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/uploads/services/WOW%20One%20Day%20Painting%20Services%20thumb.png")} 
                alt="One-Day Painting" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">One-Day Painting</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Quick transformations without compromising quality.</p>
                <Link 
                  href="/services/customized-painting/one-day-painting"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/uploads/services/WOW%20Per%20Day%20Painting%20Services%20thumb.png")} 
                alt="Per Day Painting" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Per Day Painting</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Flexible painting services that fit your schedule.</p>
                <Link 
                  href="/services/customized-painting/per-day-painting"
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
              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>When “customized” is the only honest way to quote</h2>
              <p className="mb-5">
                Catalogue painting assumes average plaster, average humidity, and average patience. Indian renovations rarely
                deliver all three at once—think service shafts that drip only in July, façades that bake on south faces,
                or toddlers who nap where masking tape still needs to cure. This hub exists so you pick the{' '}
                <em>format</em> first—one-day sprint versus phased per-day rhythm; interior calm versus exterior
                weather-watching—then dive into the child pages for specifications that match your brief.
              </p>
              <p className="mb-5">
                Use the tiles above as navigation:{' '}
                <Link href="/services/customized-painting/exterior-painting" className={linkClass}>
                  exterior painting
                </Link>{' '}
                for envelopes and elastomeric logic;{' '}
                <Link href="/services/customized-painting/interior-painting" className={linkClass}>
                  interior painting
                </Link>{' '}
                for living zones and bedrooms;{' '}
                <Link href="/services/customized-painting/one-day-painting" className={linkClass}>
                  one-day painting
                </Link>{' '}
                when surfaces are prepped and decisions are frozen;{' '}
                <Link href="/services/customized-painting/per-day-painting" className={linkClass}>
                  per-day painting
                </Link>{' '}
                when life refuses to vacate for a single heroic push.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Use cases: who benefits most from flexible scheduling</h2>
              <p className="mb-5">
                <strong>Working couples with one spare weekend.</strong> They need predictable noise windows and furniture
                stacks that still allow sleeping in the guest room—per-day sequencing beats chaos.
              </p>
              <p className="mb-5">
                <strong>Developers handing over towers.</strong> They want façades shot for brochures before monsoon marketing
                cycles—exterior crews compete with glass cleaners and signage installers unless someone owns the master
                calendar.
              </p>
              <p className="mb-5">
                <strong>Rental refreshes between tenants.</strong> Tight handback dates reward one-day interior passes when
                carpet is already out and colours are builder-standard whites ready to roll.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Pricing insight: where budgets breathe or break</h2>
              <p className="mb-5">
                Custom schedules shift labour loading, not magical discounts. One-day premiums buy overtime-ready crews and
                parallel masking teams; per-day spreads mobilisation cost across invoices but may add society lift trips.
                Exterior jobs carry scaffolding or rope-access lines invisible in generic per-square-foot chatter.
              </p>
              <p className="mb-5">
                Anchor planning with the{' '}
                <Link href="/paint-budget-calculator" className={linkClass}>
                  paint budget calculator
                </Link>{' '}
                and tighten numbers using the{' '}
                <Link href="/calculator/painting" className={linkClass}>
                  painting cost calculator
                </Link>
                . Mention both outputs plus calendar constraints in your{' '}
                <Link href="/enquiry" className={linkClass}>
                  enquiry
                </Link>{' '}
                so estimators model reality, not generic brochures.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Benefits beyond paint films</h2>
              <p className="mb-5">
                Documented phasing reduces marital negotiation mid-project: everyone sees which rooms switch on which
                dates. Product traceability improves—batch-sensitive finishes ordered once instead of emergency mismatch
                drums. Cross-read{' '}
                <Link href="/products" className={linkClass}>
                  products
                </Link>{' '}
                for VOC and scrub class facts, then preview palettes in the{' '}
                <Link href="/colour-visualiser" className={linkClass}>
                  colour visualiser
                </Link>{' '}
                before locking sheen that fights your lighting plan.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>How customized painting connects to the wider HomeGlazer stack</h2>
              <p className="mb-5">
                Core process expectations—floor protection, dust paths, primer discipline—mirror our{' '}
                <Link href="/painting-services" className={linkClass}>
                  painting services
                </Link>{' '}
                narrative. Decorative ambition belongs under{' '}
                <Link href="/services/wall-decor" className={linkClass}>
                  wall decor
                </Link>{' '}
                when texture or wallpaper joins your schedule. Wood shutters that repaint alongside walls may need{' '}
                <Link href="/services/wood-services" className={linkClass}>
                  wood services
                </Link>{' '}
                so lacquer odour windows align.
              </p>
              <p className="mb-5">
                For credibility beyond marketing copy, browse{' '}
                <Link href="/testimonials" className={linkClass}>
                  testimonials
                </Link>{' '}
                and policy answers in the{' '}
                <Link href="/faq" className={linkClass}>
                  FAQ
                </Link>
                . Anything requiring certificates, phased POS payments, or landlord sign-off belongs in{' '}
                <Link href="/contact" className={linkClass}>
                  contact
                </Link>{' '}
                with attachments—not assumptions buried in footnotes.
              </p>
            </article>
          </div>

          <div className="mt-10 md:mt-12 pb-4 max-w-3xl mx-auto w-full text-center">
            <h2 className="text-2xl font-bold text-[#299dd7] mb-3 scroll-mt-24">Frequently asked questions</h2>
            <p className="text-[rgba(64,80,94,1)] mb-6 text-base md:text-lg font-light">
              Schedules, exterior weather, budgets, products, and where we work.
            </p>
            <Accordion type="single" collapsible className="w-full space-y-3 text-left">
              {customizedPaintingHubFaq.map((item, index) => (
                <AccordionItem
                  key={`customized-painting-hub-faq-${index}`}
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

export default CustomizedPainting;

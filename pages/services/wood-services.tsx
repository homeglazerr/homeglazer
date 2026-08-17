import React from "react";
import { getMediaUrl, getOgImageUrl } from '@/lib/mediaUrl';
import Head from "next/head";
import type { FAQItem } from '@/data/faq';
import { JsonLd, FAQ_PAGE_JSON_LD } from '@/components/seo/JsonLd';
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import WhatsAppButton from "@/components/home/WhatsAppButton";
import CallButton from "@/components/home/CallButton";
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
const WOOD_SERVICES_HERO_IMAGE = "/uploads/wood-coating.jpg";

const linkClass = 'text-[#299dd7] font-medium hover:underline';

const h2Article =
  'text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2';

const woodServicesHubFaq: FAQItem[] = [
  {
    question: 'When should I choose wood coating instead of polishing?',
    answer:
      'Coating stacks prioritise protection—UV on sunny façades, moisture on bathroom vanities—sometimes atop sealed timber. Polishing stacks prioritise optical depth on interior shutters and heirloom furniture. Substrate exposure, maintenance appetite, and whether you need film build versus lustre determine the lane.',
  },
  {
    question: 'Can polishing happen with furniture still in the flat?',
    answer:
      'Often yes, with plastic containment and phased room clears—but airflow suffers and cure times lengthen. Ideal paths move pieces off-site or cluster them centre-room so sealers atomise evenly without overspray landing on silk drapes.',
  },
  {
    question: 'How loud or dusty is wood polishing compared with painting?',
    answer:
      'Sanding phases generate fines; solvent lacquers carry odour spikes stronger than low-VOC emulsion. We sequence exhaust fans, balcony drying, and society quiet-hour rules—mention sensitivities when booking adjacent painting crews.',
  },
  {
    question: 'Does carpentry include modular adjustments from vendors?',
    answer:
      'Our carpentry scope focuses on crafted woodwork—repairs, trims, bespoke storage—not reprogramming imported hinges unless quoted. Share vendor drawings early so integration stays accountable.',
  },
  {
    question: 'How soon can we touch coated surfaces after completion?',
    answer:
      'Film-dependent—nitrocellulose may feel dry faster than PU stacks that continue cross-linking. We publish walk-on or handle times per system on detailed estimates; rushing kills gloss.',
  },
  {
    question: 'Is there a calculator for wood polishing budgets?',
    answer:
      'Yes—the dedicated wood polishing calculator pairs with this hub when shutter counts and species choices stabilise.',
  },
  {
    question: 'Which woods or veneers do you routinely service?',
    answer:
      'Common Indian hardwoods, engineered cores with veneer faces, and moisture-managed MDF zones each demand different seal schedules—photos and species notes prevent wrong stain pulls.',
  },
  {
    question: 'Where does HomeGlazer provide wood services?',
    answer:
      'Delhi NCR and nearby sectors—confirm pin code for carpentry mobilisation or polish booths needing ventilation.',
  },
];

const WoodServices: React.FC = () => {
  return (
    <>
      <Head>
        <title>Wood Services | HomeGlazer - Polish, Coating & Carpentry</title>
        <meta
          name="description"
          content="Wood services hub for Delhi NCR: coating, polishing, and carpentry. Compare protection vs shine, budgets, dust and odour planning—FAQs and links to each wood route."
        />
        <meta property="og:title" content="Wood Services | HomeGlazer - Polish, Coating & Carpentry" />
        <meta
          property="og:description"
          content="Wood coating, polishing, and carpentry—guides, FAQs, and specialist links for Indian homes and offices."
        />
        <meta property="og:image" content={getOgImageUrl(WOOD_SERVICES_HERO_IMAGE, SITE_URL)} />
        <meta name="twitter:title" content="Wood Services | HomeGlazer" />
        <meta name="twitter:description" content="Wood hub: polish, coating, carpentry—planning content and FAQs." />
        <meta name="twitter:image" content={getOgImageUrl(WOOD_SERVICES_HERO_IMAGE, SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(woodServicesHubFaq)} />
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
                <BreadcrumbLink href="/services/wood-services">Wood Services</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <section
          className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto pt-6 pb-16 md:pb-20"
          aria-labelledby="wood-services-heading"
        >
          <h1
            id="wood-services-heading"
            className="text-3xl md:text-4xl font-bold text-center text-[var(--brand-pink)] mb-3 md:mb-4"
          >
            Wood polishing, coating &amp; carpentry services
          </h1>
          <p className="text-center text-[rgba(64,80,94,1)] max-w-3xl mx-auto mb-5 md:mb-6 text-base md:text-lg font-light leading-relaxed">
            Restore shine, seal timber against wear, or commission bespoke woodwork—all handled by experienced HomeGlazer craftspeople.
          </p>
          <h2 className="text-2xl md:text-[28px] font-bold text-center text-[#299dd7] mb-6 md:mb-8">
            Coating, polishing &amp; custom carpentry options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/uploads/wood-coating.jpg")} 
                alt="Wood Coating" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Wood Coating</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Protect and enhance wood with long-lasting finishes.</p>
                <Link 
                  href="/services/wood/wood-coating"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/uploads/services/wood-polish-thumb.jpg")} 
                alt="Wood Polishing" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Wood Polishing</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Bring out the shine of your wood surfaces.</p>
                <Link 
                  href="/services/wood/wood-polishing"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/uploads/services/carpentary-thumb.jpg")} 
                alt="Carpentry" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Carpentry</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Custom woodwork crafted with precision and care.</p>
                <Link 
                  href="/services/wood/carpentry"
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
              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Why wood deserves its own hub beside painting</h2>
              <p className="mb-5">
                Walls forgive minor roller variance; timber telegraphs every sanding swirl, stain blot, and incompatible
                solvent trapped under film. Splitting{' '}
                <Link href="/services/wood/wood-coating" className={linkClass}>
                  wood coating
                </Link>
                ,{' '}
                <Link href="/services/wood/wood-polishing" className={linkClass}>
                  wood polishing
                </Link>
                , and{' '}
                <Link href="/services/wood/carpentry" className={linkClass}>
                  carpentry
                </Link>{' '}
                keeps specification honest—clients stop asking polyurethane shutters to behave like emulsion-ready plaster.
              </p>
              <p className="mb-5">
                Start from the tiles above when you know which craft dominates budget: protective builds for balconies,
                lustre rebuilds for teak interiors, or new oak trims needing coordinated installs before paint crews mask
                adjacent gypsum.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Use cases that mix multiple wood disciplines</h2>
              <p className="mb-5">
                <strong>Full-home modular resets.</strong> Kitchen carcasses arrive pre-laminated while loose shutters
                demand polish bays—sequence matters so VOC peaks do not collide with toddler bedtime paint schedules.
              </p>
              <p className="mb-5">
                <strong>Heritage door restoration.</strong> Carpentry stabilises joints; polishing resurrects grain chatoyance;
                coatings shield restored jambs from monsoon swings—often staged across dry weeks.
              </p>
              <p className="mb-5">
                <strong>Retail oak shelving.</strong> Commercial durability specs lean coating-heavy for abrasion; residential
                counterparts might prioritise warm matte polish aesthetics instead—tell us foot-traffic class early.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Pricing insight: film build versus artisan hours</h2>
              <p className="mb-5">
                Polishing quotes swing with abrasive progression and stain complexity; coating quotes swing with system
                chemistry (PU versus acrylic) and recoat windows; carpentry oscillates with engineering tolerance and on-site
                joinery versus workshop builds. Bundle synergies exist—single mobilisation, shared masking—but never assume
                polish metres equal paint metres.
              </p>
              <p className="mb-5">
                Quantify shutters using the{' '}
                <Link href="/calculator/wood-polishing" className={linkClass}>
                  wood polishing calculator
                </Link>{' '}
                once counts stabilise; pair with{' '}
                <Link href="/paint-budget-calculator" className={linkClass}>
                  paint budget calculator
                </Link>{' '}
                outputs when walls repaint in the same sprint so finance sees one holistic envelope.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Benefits of sequencing wood before or after wall paint</h2>
              <p className="mb-5">
                Overspray respects gravity—often finish timber before final wall coats when masking budgets allow; sometimes
                reverse when ceilings demand popcorn removal raining onto bare teak. We choreograph transitions so tape pulls
                do not scar fresh lacquer and roller lint never lands on tacky shellac.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>How wood services plug into HomeGlazer’s broader workflow</h2>
              <p className="mb-5">
                Wall narratives stay under{' '}
                <Link href="/painting-services" className={linkClass}>
                  painting services
                </Link>{' '}
                or{' '}
                <Link href="/services/customized-painting" className={linkClass}>
                  customized painting
                </Link>{' '}
                when calendars tighten; decorative overlays appear under{' '}
                <Link href="/services/wall-decor" className={linkClass}>
                  wall decor
                </Link>
                . Material compatibility references live on{' '}
                <Link href="/products" className={linkClass}>
                  products
                </Link>
                ; colour coordination with adjacent walls belongs in the{' '}
                <Link href="/colour-visualiser" className={linkClass}>
                  colour visualiser
                </Link>
                .
              </p>
              <p className="mb-5">
                Proof lives in{' '}
                <Link href="/testimonials" className={linkClass}>
                  testimonials
                </Link>
                ; governance lives in{' '}
                <Link href="/faq" className={linkClass}>
                  FAQ
                </Link>
                . Submit grain photos via{' '}
                <Link href="/enquiry" className={linkClass}>
                  enquiry
                </Link>{' '}
                or escalate procurement conversations through{' '}
                <Link href="/contact" className={linkClass}>
                  contact
                </Link>
                .
              </p>
            </article>
          </div>

          <div className="mt-10 md:mt-12 pb-4 max-w-3xl mx-auto w-full text-center">
            <h2 className="text-2xl font-bold text-[#299dd7] mb-3 scroll-mt-24">Frequently asked questions</h2>
            <p className="text-[rgba(64,80,94,1)] mb-6 text-base md:text-lg font-light">
              Coating vs polish, dust and odour, carpentry scope, cure times, and calculators.
            </p>
            <Accordion type="single" collapsible className="w-full space-y-3 text-left">
              {woodServicesHubFaq.map((item, index) => (
                <AccordionItem
                  key={`wood-services-hub-faq-${index}`}
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
      
      <CallButton />
      <WhatsAppButton />
        <Footer />
      </div>
    </>
  );
};

export default WoodServices;

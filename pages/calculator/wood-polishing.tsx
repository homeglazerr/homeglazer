import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getOgImageUrl } from '@/lib/mediaUrl';
import type { FAQItem } from '@/data/faq';
import { JsonLd, FAQ_PAGE_JSON_LD } from '@/components/seo/JsonLd';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppButton from '@/components/home/WhatsAppButton';
import CallButton from '@/components/home/CallButton';
import MultiStepWoodPolishingCalculator from '@/components/calculator/MultiStepWoodPolishingCalculator';
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

const linkClass = 'text-[#299dd7] font-medium hover:underline';

const h2Article =
  'text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2';

/** FAQs shown on this page — kept in sync with JSON-LD below. */
const woodPolishingCalculatorFaq: FAQItem[] = [
  {
    question: 'Is the amount from this wood polishing calculator my final bill?',
    answer:
      'No. The figure you see is a ballpark estimate based on the details you enter—area or item counts, and the finish system you select. On site, we check wood condition, prep work (stripping old polish, filling, sanding), access, and any repairs. You get a clear written quote after that visit. The calculator is meant to help you budget and compare options before you speak with us.',
  },
  {
    question: 'What does professional wood polishing usually include?',
    answer:
      'A proper job is more than wiping on a topcoat. It typically covers surface preparation, evening out minor imperfections, sealing where needed, building coats of the chosen system, and finishing to an even sheen. Doors, windows, skirting, and furniture each need slightly different handling, which is why we ask whether you are measuring by area or by items.',
  },
  {
    question: 'Why do melamine, PU, and other finishes change the price so much?',
    answer:
      'Each system uses different materials, number of coats, drying time, and skill level. Some finishes are built for heavy wear in kitchens and passages; others suit bedroom furniture or decorative panels. The calculator ties your selection to indicative pricing so you can see how upgrading the finish affects the total before you commit.',
  },
  {
    question: 'Can damaged or very old wood still be polished?',
    answer:
      'Often yes, but it depends. Deep stains, swelling from moisture, or loose joints need carpentry or partial replacement first. We assess that during a site visit. If the wood is structurally sound, sanding and the right polish system can bring back warmth and colour without hiding the grain.',
  },
  {
    question: 'How long does a wood polishing project take?',
    answer:
      'Small packages—say a set of doors or a few pieces of furniture—may finish in a few working days once materials and drying time are factored in. Whole flats or offices with extensive woodwork take longer. Weather, curing between coats, and whether the space is occupied all affect the schedule. We outline a realistic timeline in the quotation.',
  },
  {
    question: 'Do I need to move furniture or empty rooms before you start?',
    answer:
      'We need clear access to the surfaces being polished. For built-in wardrobes, door frames, and fixed panels, you may only need to move items a short distance. For floor polishing or large furniture, more clearance helps us work safely and protects your belongings from dust. We can walk you through what to shift when we confirm the job.',
  },
  {
    question: 'How is wood polishing different from wood coating or painting walls?',
    answer:
      'Wood polishing works with the timber itself—enhancing grain and protecting the substrate. Wood coating can overlap in products but may emphasise different systems; our dedicated wood service pages explain the nuance. Wall painting is a separate trade entirely. If you are renovating end-to-end, many clients pair wood finishing with interior painting and use our painting calculator for the wall portion.',
  },
  {
    question: 'Which cities do you serve for wood polishing?',
    answer:
      'HomeGlazer operates across Delhi NCR and surrounding areas. If you are unsure whether your location is covered, use the enquiry form or call us—we will confirm availability and next steps.',
  },
];

const WoodPolishingCalculator: React.FC = () => {
  return (
    <>
      <Head>
        <title>Wood Polishing Cost Calculator | HomeGlazer - Free Estimate</title>
        <meta
          name="description"
          content="Estimate wood polishing costs for furniture, doors, windows, and panels. Learn what affects pricing, compare finish options, and book a site visit across Delhi NCR. Free calculator from HomeGlazer."
        />
        <meta
          name="keywords"
          content="wood polishing calculator, wood polishing cost, furniture polishing estimate, Delhi NCR"
        />
        <meta property="og:title" content="Wood Polishing Cost Calculator | HomeGlazer" />
        <meta
          property="og:description"
          content="Estimate wood polishing costs, understand finish options, and plan your project with HomeGlazer's free calculator."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOgImageUrl('/uploads/wood-polishing.png', SITE_URL)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wood Polishing Cost Calculator | HomeGlazer" />
        <meta
          name="twitter:description"
          content="Estimate wood polishing costs and explore finish options with our free calculator."
        />
        <meta name="twitter:image" content={getOgImageUrl('/uploads/wood-polishing.png', SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(woodPolishingCalculatorFaq)} />
      <div className="bg-white flex flex-col overflow-hidden items-center">
        <Header />

        <main className="w-full flex flex-col items-center pt-20 md:pt-24">

          <div className="w-full px-4 pt-6 pb-8 md:pb-10 text-center border-b border-gray-100 bg-gradient-to-b from-slate-50/90 to-white">
            <div className="w-[90%] lg:w-[80%] max-w-3xl mx-auto">
              <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold leading-tight md:leading-[150%] text-[var(--brand-pink)] mt-2 pt-2">
                Wood polishing cost calculator
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-[#299dd7] mt-5 md:mt-6 pt-1 leading-snug">
                Compare finish options and plan your budget before you commit
              </h2>
              <p className="text-[rgba(64,80,94,1)] mt-4 md:mt-5 text-base md:text-xl font-light leading-relaxed">
                Whether you are refreshing bedroom wardrobes before a festival, tightening up door frames in a new flat,
                or quoting woodwork for an office fit-out, it helps to know what the work might cost before you commit.
                Use this tool to build a quick estimate from your measurements or item counts, then compare how different
                polish systems shift the total. For the full scope of on-site work, see our{' '}
                <Link href="/services/wood/wood-polishing" className={linkClass}>
                  wood polishing services
                </Link>{' '}
                page—or jump straight to an{' '}
                <Link href="/enquiry" className={linkClass}>
                  enquiry
                </Link>{' '}
                if you already know you want a visit.
              </p>
            </div>
          </div>

          <div className="w-full bg-white my-5">
            <MultiStepWoodPolishingCalculator />
          </div>

          <section className="w-[90%] lg:w-[80%] max-w-3xl mx-auto py-12 md:py-16 border-t border-gray-100 text-left">
            <article className="prose prose-lg max-w-none text-left text-[rgba(64,80,94,1)] prose-a:no-underline prose-strong:text-gray-900">
              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>How to think about wood polishing budgets</h2>
              <p className="mb-5">
                Wood finishing sits in an awkward spot for homeowners: it is easy to underestimate the prep, and easy to
                overpay if you do not know what you are buying. A fair quote reflects three things—the condition of the
                timber, the quality of the system you choose, and the time it takes to apply it properly. Our calculator
                keeps those levers visible so you are not guessing in the dark.
              </p>
              <p className="mb-5">
                If you are also planning wall colours, it often pays to sequence painting and woodwork sensibly. Many
                clients use the{' '}
                <Link href="/paint-budget-calculator" className={linkClass}>
                  paint budget hub
                </Link>{' '}
                alongside this page, or go directly to the{' '}
                <Link href="/calculator/painting" className={linkClass}>
                  painting cost calculator
                </Link>{' '}
                for room-by-room numbers. That way your overall renovation budget tells one coherent story instead of
                three conflicting spreadsheets.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>What this calculator is useful for</h2>
              <p className="mb-5">
                The steps mirror how we usually scope work on the phone or at a site visit. You can enter a broad area
                when you are thinking about panels, skirting runs, or open layouts—or switch to counting doors, windows,
                wall panels, and loose furniture when that is how you picture the job. Either path lands on an indicative
                total you can sanity-check against your own expectations.
              </p>
              <p className="mb-5">
                Typical use cases we see include: polishing main doors and architraves before handover, refreshing
                bedroom and kitchen cabinets that have dulled over five to ten years, bringing office reception desks and
                meeting-room joinery back to a uniform finish, and touching up heritage-style furniture where the owner
                wants to keep the wood character rather than paint over it. None of those are identical jobs, but they
                all benefit from the same early clarity on finish level and rough budget.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>What tends to move the price up or down</h2>
              <p className="mb-5">
                <strong>Surface condition.</strong> Light scuffs and sun fading are normal. Water rings, alligatoring
                old lacquer, or chipped edges mean more sanding, filling, or localised stripping—extra hours that a
                simple &quot;per square foot&quot; rate never captures on its own.
              </p>
              <p className="mb-5">
                <strong>Finish choice.</strong> Entry-level systems and premium PU or specialised coatings do not
                price the same, and they should not—they wear differently and age differently. The calculator lets you
                feel that gap in rupee terms instead of abstract brochure language.
              </p>
              <p className="mb-5">
                <strong>Access and protection.</strong> High stairwells, occupied homes where dust control matters, or
                sites that need evening or weekend shifts can adjust the final quote. We flag those details when we meet
                you rather than hiding them in the fine print.
              </p>
              <p className="mb-5">
                If you want a deeper comparison of how wood projects fit next to the rest of our catalogue, browse{' '}
                <Link href="/services/wood-services" className={linkClass}>
                  all wood services
                </Link>{' '}
                first, then circle back here to test numbers.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Polishing versus replacing—or only painting walls</h2>
              <p className="mb-5">
                When wood is structurally sound, polishing usually costs a fraction of replacement joinery and keeps
                the original grain and fit. Replacement makes sense when carcasses are swollen, hinges have torn out
                repeatedly, or the layout no longer works. We are happy to advise honestly at survey time because the
                wrong recommendation wastes everyone&apos;s time.
              </p>
              <p className="mb-5">
                Interior wall paint and wood finishing solve different problems. Fresh colour on plaster changes the
                mood of a room; polish protects and elevates timber in the same space. If you are doing both, share your
                plans when you{' '}
                <Link href="/contact" className={linkClass}>
                  contact
                </Link>{' '}
                us so we can align drying times, masking, and handover. For general process questions, our{' '}
                <Link href="/faq" className={linkClass}>
                  FAQ
                </Link>{' '}
                section covers how HomeGlazer runs painting projects end to end.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>What happens after you calculate</h2>
              <p className="mb-5">
                Treat the result as a planning range, not a tax invoice. The next useful step is a short conversation or
                site visit where we confirm measurements, wood species where it matters, and your sheen preference. You
                can then compare our written quote with the calculator output—most clients find they are in the same
                ballpark when the scope has not changed.
              </p>
              <p className="mb-5">
                Ready to talk it through? Use{' '}
                <Link href="/enquiry" className={linkClass}>
                  Enquire Now
                </Link>{' '}
                for a structured request, or explore colours for adjacent work with the{' '}
                <Link href="/colour-visualiser" className={linkClass}>
                  colour visualiser
                </Link>
                . Either way, you arrive at decisions with numbers and context—not a single mystery figure at the end.
              </p>
            </article>
          </section>

          <section className="w-[90%] lg:w-[80%] max-w-3xl mx-auto pb-16 md:pb-20 text-center">
            <h2 className="text-2xl font-bold text-[#299dd7] mt-12 md:mt-16 pt-2 mb-3 scroll-mt-24">
              Frequently asked questions
            </h2>
            <p className="text-[rgba(64,80,94,1)] mb-6 mx-auto max-w-2xl text-base md:text-lg font-light">
              Quick answers about estimates, finishes, timelines, and how wood polishing fits with painting. For broader
              painting topics, see the main{' '}
              <Link href="/faq" className={linkClass}>
                FAQ page
              </Link>
              .
            </p>
            <Accordion type="single" collapsible className="w-full space-y-3 text-left">
              {woodPolishingCalculatorFaq.map((item, index) => (
                <AccordionItem
                  key={`wood-calc-faq-${index}`}
                  value={`item-${index}`}
                  className="border border-gray-200 rounded-lg px-1 bg-gray-50/50"
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
        </main>

        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
          <div className="flex gap-3">
            <Link
              href="/enquiry"
              className="flex-1 bg-[#ED276E] text-white py-3 px-3 rounded-lg font-medium text-center hover:bg-[#b81d5a] transition flex items-center justify-center text-[15px] whitespace-nowrap"
            >
              Enquire Now
            </Link>
            <Link
              href="/colour-visualiser"
              className="flex-1 bg-[#299dd7] text-white py-3 px-3 rounded-lg font-medium text-center hover:bg-[#237bb0] transition flex items-center justify-center text-[15px] whitespace-nowrap"
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
};

export default WoodPolishingCalculator;

import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { FAQItem } from '@/data/faq';
import { JsonLd, FAQ_PAGE_JSON_LD } from '@/components/seo/JsonLd';
import { getOgImageUrl } from '@/lib/mediaUrl';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppButton from '@/components/home/WhatsAppButton';
import MultiStepCalculator from '@/components/calculator/MultiStepCalculator';
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
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

const linkClass = 'text-[#299dd7] font-medium hover:underline';

const h2Article =
  'text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2';

const paintingCalculatorFaq: FAQItem[] = [
  {
    question: 'How is this painting calculator different from the paint budget calculator?',
    answer:
      'The paint budget calculator gives fast envelopes when you only know rough area or package intent. This multi-step tool asks for interior versus exterior choices, room counts or dimensions, and finish assumptions—so you tighten numbers before sharing drawings with family or your CA. Many clients run both: wide bracket first, then refined output here.',
  },
  {
    question: 'Is the figure shown here my final HomeGlazer invoice?',
    answer:
      'No. It is an indicative estimate based on the inputs you enter and typical Delhi NCR productivity bands. Cracked plaster, damp-proof membranes, metal railing enamel, lift bookings, or last-minute colour changes can all shift labour and material lines after site inspection or detailed photos.',
  },
  {
    question: 'Does the calculator include GST and society lift charges?',
    answer:
      'Treat on-screen totals as planning ranges unless your signed estimate explicitly labels inclusive GST. Lift deposits, overtime slots, or rope-access exterior pods rarely belong inside generic calculator logic—confirm those society-specific rows when we formalise scope.',
  },
  {
    question: 'Can I rely on it for exterior façade or stairwell painting?',
    answer:
      'You can model exterior intent here to understand relative spend versus interiors, but scaffolding, texture guns on façade cement boards, and elastomeric systems usually need estimator review. Upload façade photos and mention exposure direction when you submit enquiry so height access is quoted accurately.',
  },
  {
    question: 'What if my walls need heavy putty, POP fixes, or waterproofing first?',
    answer:
      'Calculators assume reasonable substrates unless you indicate otherwise. Major levelling, saline zones behind wardrobes, or bathroom seepage correction layer civil scope ahead of paint—budget contingency or separate quotes from specialists before locking decorative litres.',
  },
  {
    question: 'How should I measure rooms so results stay realistic?',
    answer:
      'Use consistent units—either external dimensions minus openings or carpet area multiplied by paintable wall factor—and stick with one method across rooms. Double-counting balconies twice or omitting double-height stair volumes skew litres badly; when unsure, round up wall area and mention uncertainty in enquiry.',
  },
  {
    question: 'Does wood polishing appear here or on another calculator?',
    answer:
      'Interior painting flows dominate this wizard. For shutters, door frames, or parquet schedules priced primarily around polish systems, cross-check the dedicated wood polishing calculator so lacquer passes do not disappear inside generic wall estimates.',
  },
  {
    question: 'What should I send after running numbers so you can confirm?',
    answer:
      'Share screenshots if helpful, plus north-facing photos of problem walls, existing enamel versus emulsion zones, and society windows where masking noise matters. Link to colour visualiser palettes if short-listed—it prevents rework tint charges mid-job.',
  },
];

const PaintingCalculator: React.FC = () => {
  return (
    <>
      <Head>
        <title>Painting Cost Calculator | HomeGlazer - Free Estimate</title>
        <meta
          name="description"
          content="Multi-step painting cost calculator for Indian homes: interior, exterior, and combined scopes in Delhi NCR. Guides on measurements, GST, prep surprises, linking to budget calculator and wood polish tool—plus FAQs."
        />
        <meta name="keywords" content="painting calculator, painting cost estimate, interior painting cost, exterior painting cost, Delhi NCR" />
        <meta property="og:title" content="Painting Cost Calculator | HomeGlazer" />
        <meta
          property="og:description"
          content="Room-by-room painting estimates with context on quotes vs site truth, exterior access, and how to confirm numbers with HomeGlazer."
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOgImageUrl('/uploads/consultation.png', SITE_URL)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Painting Cost Calculator | HomeGlazer" />
        <meta
          name="twitter:description"
          content="Detailed painting calculator plus FAQs on GST, measurement accuracy, exterior façades, and wood polishing."
        />
        <meta name="twitter:image" content={getOgImageUrl('/uploads/consultation.png', SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(paintingCalculatorFaq)} />
      <div className="bg-white flex flex-col overflow-hidden items-center">
        <Header />

      <main className="w-full flex flex-col items-center pt-20 md:pt-24">

      <div className="w-[90%] lg:w-[80%] mx-auto pt-6 pb-2 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--brand-pink)]">
          Painting cost calculator
        </h1>
        <p className="text-[rgba(64,80,94,1)] mt-2 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
          Estimate interior, exterior, or combined painting costs in a few steps—free and instant.
        </p>
      </div>

      <div className="w-full bg-white my-0">
        <MultiStepCalculator />
      </div>

      <section
        className="w-[90%] lg:w-[80%] mx-auto mt-14 md:mt-16 pt-10 md:pt-12 pb-4 border-t border-gray-200"
        aria-labelledby="painting-calculator-guide-heading"
      >
        <h2 id="painting-calculator-guide-heading" className="sr-only">
          Guide to the painting cost calculator
        </h2>
        <article className="prose prose-lg max-w-3xl mx-auto text-left text-[rgba(64,80,94,1)] prose-a:no-underline prose-strong:text-gray-900">
          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Why we split “budget” from “room-by-room” calculators
          </h2>
          <p className="mb-5">
            Early-stage planning rewards speed: you want any plausible envelope before you negotiate with a seller or
            decide whether modular spends squeeze paint reserves. That is the promise of the{' '}
            <Link href="/paint-budget-calculator" className={linkClass}>
              paint budget calculator
            </Link>
            . Once dimensions exist—even pencil sketches from your contractor—you graduate here so litres track ceiling
            heights, opening deductions, and interior versus exterior split accurately enough to defend numbers inside a
            WhatsApp family group.
          </p>
          <p className="mb-5">
            Think of this page as spreadsheet discipline without exporting CSV: mandatory sequencing walks you through the
            choices that quietly swing invoices—sheen tier, primer expectation, whether balconies ride inside the same crew
            mobilisation or wait for civil waterproofing first.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Use cases that benefit most from multi-step precision
          </h2>
          <p className="mb-5">
            <strong>Mixed-use towers.</strong> When bedrooms stay occupied during weekdays but common corridors repaint on
            weekends, calculator outputs help isolate phased mobilisation costs versus single-phase discounts—mention both
            phases in{' '}
            <Link href="/enquiry" className={linkClass}>
              enquiry
            </Link>{' '}
            so scheduling quotes accurately.
          </p>
          <p className="mb-5">
            <strong>Villas with stone cladding pockets.</strong> Exterior metres spike faster than interior carpet implies.
            Run scenarios twice—paint-ready plaster versus exposed grit substrate—to bracket contingency before landscapers
            return.
          </p>
          <p className="mb-5">
            <strong>Retail shells handed over “bare grey.”</strong> Developers quote shell square footage; your usable paint
            faces exclude storefront glazing and duct boxing. Enter paintable faces honestly—or intentionally conservative—to
            avoid ordering fifty litres short before opening weekend.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Benefits beyond the headline rupee figure
          </h2>
          <p className="mb-5">
            Documented assumptions tame disputes: when spouse A remembers selecting premium scrubbability for toddler halls
            but spouse B assumed economy rolls everywhere, revisiting saved calculator inputs settles debates faster than
            memory. Procurement teams align tint bases with{' '}
            <Link href="/colour-visualiser" className={linkClass}>
              colour visualiser
            </Link>{' '}
            experiments before drums arrive—critical when deep accents demand tinted primers or extended curing gaps between
            coats.
          </p>
          <p className="mb-5">
            From our side, structured submissions slash clarification pings; supervisors preview labour density early—say,
            three painters versus six—based on your exterior toggle instead of discovering façades late during mobilisation.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Pricing insights: where estimates detach from site realities
          </h2>
          <p className="mb-5">
            <strong>Prep asymmetry.</strong> Smooth calculators imagine uniform suction; Delhi winters plus construction dust
            behind hollow cores may consume extra binder coats. Flag uneven suction photos—we advise alkali or adhesive
            primers before decorative spends balloon mid-job.
          </p>
          <p className="mb-5">
            <strong>Product catalogue anchors.</strong> Cross-verify SKU intent against{' '}
            <Link href="/products" className={linkClass}>
              products
            </Link>{' '}
            so VOC labels and scrub class survive procurement audits—especially for LEED-aware offices quoting alongside
            your apartment repaint.
          </p>
          <p className="mb-5">
            <strong>Scope creep versus legitimate latent defects.</strong> Cracking near lintels after first monsoon belongs
            to structural investigation before cosmetic reps; hairline roller texture misses belong to repaint QA. Clear
            scopes documented alongside calculator snapshots reduce mutual cynicism when invoices adjust.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Pairing painting numbers with wood polishing schedules
          </h2>
          <p className="mb-5">
            Doors rarely repaint without touching polish once shutters bump ladders daily. After locking wall totals here,
            open{' '}
            <Link href="/calculator/wood-polishing" className={linkClass}>
              wood polishing calculator
            </Link>{' '}
            for shutter counts and sheen continuity—then stitch timelines so polyurethane odour windows align with bedroom
            occupancy plans.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Decorative extras and feature treatments
          </h2>
          <p className="mb-5">
            Standard wall litres exclude artisan textures, stencil repeats, or mural-scale graphics layered atop primed
            substrates. If Pinterest references involve plaster relief or graffiti energy, budget decorative labour
            separately via our{' '}
            <Link href="/services/wall-decor" className={linkClass}>
              wall decor
            </Link>{' '}
            hub before assuming MultiStep outputs capture art-department hours.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Turning calculator outputs into a confirmed proposal
          </h2>
          <p className="mb-5">
            Export mental notes: interior versus exterior split percentages, risky planes requiring boom lifts, societies
            banning solvent evenings. Attach references from{' '}
            <Link href="/testimonials" className={linkClass}>
              testimonials
            </Link>{' '}
            if psychological reassurance matters as much as arithmetic—then consolidate unknowns through{' '}
            <Link href="/contact" className={linkClass}>
              contact
            </Link>{' '}
            when contracts need signatures beyond WhatsApp scope texts.
          </p>
          <p className="mb-5">
            Still unsure whether primer chemistry belongs inside paint heads or civil heads? Scan{' '}
            <Link href="/faq" className={linkClass}>
              FAQ
            </Link>{' '}
            entries on warranties and touch-ups, then loop back here with revised measurements once concealed damp zones
            reveal themselves during masking.
          </p>
          <p className="mb-5">
            For the broader workflow narrative—crew norms, protection standards, sequencing against modular installs—keep{' '}
            <Link href="/painting-services" className={linkClass}>
              painting services
            </Link>{' '}
            open beside this calculator tab while you iterate scenarios.
          </p>
        </article>

        <div className="mt-10 md:mt-12 pb-4 max-w-3xl mx-auto w-full text-center">
          <h2 className="text-2xl font-bold text-[#299dd7] mb-3 scroll-mt-24">
            Frequently asked questions
          </h2>
          <p className="text-[rgba(64,80,94,1)] mb-6 text-base md:text-lg font-light">
            Budget calculator vs this tool, GST, exterior access, measurements, and wood polish.
          </p>
          <Accordion type="single" collapsible className="w-full space-y-3 text-left">
            {paintingCalculatorFaq.map((item, index) => (
              <AccordionItem
                key={`painting-calculator-faq-${index}`}
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

      {/* Mobile Action Buttons */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        <div className="flex gap-3">
          <Link href="/enquiry" className="flex-1 bg-[#ED276E] text-white py-3 px-3 rounded-lg font-medium text-center hover:bg-[#b81d5a] transition flex items-center justify-center text-[15px] whitespace-nowrap">
            Enquire Now
          </Link>
          <Link href="/colour-visualiser" className="flex-1 bg-[#299dd7] text-white py-3 px-3 rounded-lg font-medium text-center hover:bg-[#237bb0] transition flex items-center justify-center text-[15px] whitespace-nowrap">
            Color Visualiser
          </Link>
        </div>
      </div>

      <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export default PaintingCalculator;

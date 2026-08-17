import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import type { FAQItem } from '@/data/faq';
import { JsonLd, FAQ_PAGE_JSON_LD } from '@/components/seo/JsonLd';
import { getOgImageUrl } from '@/lib/mediaUrl';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import CalculatorForm from '@/components/calculator/CalculatorForm';
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
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

const linkClass = 'text-[#299dd7] font-medium hover:underline';

const h2Article =
  'text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2';

const paintBudgetCalculatorFaq: FAQItem[] = [
  {
    question: 'Is the paint budget calculator a binding quote from HomeGlazer?',
    answer:
      'No. It is an orientation tool—useful for comparing scenarios (rooms, finishes, wood polishing add-ons) before you commit time to a site visit. A formal quote depends on wall condition, exact product grades, masking complexity, height access, and local taxes itemised on paper after inspection or detailed photos.',
  },
  {
    question: 'Why might my final invoice differ from the calculator output?',
    answer:
      'Hidden plaster repairs, extra coats over strong colours, damp treatment, metal or waterproofing systems, balcony railing paint, and last-minute scope changes all move numbers. The calculator assumes typical Delhi NCR apartments unless you override inputs; heritage masonry, double-height voids, or factory volumes behave differently.',
  },
  {
    question: 'Does this tool cover interior and exterior painting?',
    answer:
      'The budget calculator is built for planning interior packages and related wood polishing toggles you see in the form. Exterior weathering, scaffolding, and elastomeric systems often need the dedicated painting cost calculator plus photos of façade cracks and exposure. Mention “exterior” explicitly in enquiry so estimators route you correctly.',
  },
  {
    question: 'What single input changes the budget the most?',
    answer:
      'Usually total coated area (square feet or room counts you translate into area) and whether walls need full prep versus maintenance recoats. Second-order jumps come from upgrading from economy emulsion to scrubbable low-VOC lines, or adding texture and feature treatments layered on top of base coats.',
  },
  {
    question: 'How is this different from the painting cost calculator?',
    answer:
      'Think of this page as the fast lane—fewer fields, broader brackets. The painting cost calculator digs into room-by-room dimensions and paint spreads when you already know ceilings heights and opening deductions. Many clients run both: rough envelope here, refinement there before WhatsApping measurements.',
  },
  {
    question: 'Should I still submit an enquiry if the calculator looks affordable?',
    answer:
      'Yes, if you want a locked scope. The calculator cannot see bubbling oil enamel in kitchens, concrete efflorescence behind wardrobes, or lift-booking constraints in your society. An enquiry with photos closes the gap between “ballpark” and “we will actually schedule four painters next Tuesday.”',
  },
  {
    question: 'Are taxes (GST) included in what I see?',
    answer:
      'Treat on-screen figures as pre-tax planning unless the interface explicitly labels inclusive pricing for a promotion. Commercial contracts and some bundled packages quote inclusive numbers differently from residential B2C jobs. Ask your estimator for the GST line item when comparing apples-to-apples across vendors.',
  },
  {
    question: 'Where can I verify product names suggested after I estimate litres?',
    answer:
      'Cross-check finishes and compatibility against our products catalog, then align colour families in the colour visualiser before you order drums. Your supervisor can substitute grades if stock or climate demands—always capture substitutions on the written estimate.',
  },
];

const Calculator: React.FC = () => {
  return (
    <>
      <Head>
        <title>Paint Budget Calculator | HomeGlazer - Free Estimate</title>
        <meta
          name="description"
          content="Free paint budget calculator for Indian homes: plan interior painting and wood polishing costs in Delhi NCR. Guides on quotes vs estimates, prep, GST, when to use the detailed painting calculator, FAQs, and links to enquiry."
        />
        <meta property="og:title" content="Paint Budget Calculator | HomeGlazer - Free Estimate" />
        <meta
          property="og:description"
          content="Estimate painting budgets quickly, then learn what moves price—prep, products, scope—and how to turn numbers into a firm HomeGlazer quote."
        />
        <meta property="og:image" content={getOgImageUrl("/uploads/consultation.png", SITE_URL)} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Paint Budget Calculator | HomeGlazer" />
        <meta
          name="twitter:description"
          content="Plan painting spend with HomeGlazer’s calculator plus FAQs on quotes, GST, interior vs exterior, and linking to detailed tools."
        />
        <meta name="twitter:image" content={getOgImageUrl("/uploads/consultation.png", SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(paintBudgetCalculatorFaq)} />
      <div className="bg-white flex flex-col overflow-hidden items-center">
        <Header />

      <main className="w-full flex flex-col items-center">
      <div className="w-[90%] lg:w-[80%] mx-auto pt-28">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/paint-budget-calculator">Budget Calculator</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <CalculatorForm />

      <section
        className="w-[90%] lg:w-[80%] mx-auto mt-14 md:mt-16 pt-10 md:pt-12 pb-4 border-t border-gray-200"
        aria-labelledby="paint-budget-guide-heading"
      >
        <h2 id="paint-budget-guide-heading" className="sr-only">
          Guide to paint budgeting and using this calculator
        </h2>
        <div className="max-w-3xl mx-auto mb-8 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--brand-pink)] text-center md:text-left">
            Paint budget calculator
          </h1>
          <p className="text-[rgba(64,80,94,1)] mt-2 text-center md:text-left max-w-2xl text-sm md:text-base leading-relaxed">
            Start here for painting or wood polishing estimates—then open the detailed calculators if you need more precision.
          </p>
        </div>
        <article className="prose prose-lg max-w-3xl mx-auto text-left text-[rgba(64,80,94,1)] prose-a:no-underline prose-strong:text-gray-900">
          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            What this calculator is for—and what it is not
          </h2>
          <p className="mb-5">
            Most homeowners arrive with two numbers in mind: what they hope painting will cost, and what their society,
            landlord, or spouse will tolerate before the project stalls. This tool bridges Pinterest boards and that
            conversation by translating rough area, service mix, and finish intent into a bracket you can sanity-check in
            minutes. It is{' '}
            <strong>not</strong> a substitute for opening walls to inspect plaster, testing suction on old distemper, or
            pricing swing-stage access on a seventh-floor façade—those realities appear only after{' '}
            <Link href="/enquiry" className={linkClass}>
              enquiry
            </Link>{' '}
            photos or a walk-through.
          </p>
          <p className="mb-5">
            Treat the output as a shared language between you and our estimators: when you later say “the calculator sat
            near X,” we immediately know which assumptions to validate first—coverage litres, wood polish inclusion, or
            primer chemistry—not whether you can afford paint at all.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Typical use cases where the budget calculator saves a week of guessing
          </h2>
          <p className="mb-5">
            <strong>Pre-purchase sanity checks.</strong> Buyers comparing two resale flats can model both envelopes before
            DD hits—especially when one seller masked stains with fresh matt white that will fight your navy feature wall.
          </p>
          <p className="mb-5">
            <strong>Rental refreshes.</strong> Landlords weighing scrubbable versus economy lines across ten identical
            units use the calculator to see how product tier swings totals before committing to a palette that survives
            tenant turnover.
          </p>
          <p className="mb-5">
            <strong>Partial renovations beside modular kitchens.</strong> When carpentry shifts but masonry stays,
            homeowners isolate “paint-only” cash flow. Toggle wood polishing if shaker shutters are part of the same
            milestone—otherwise visit{' '}
            <Link href="/calculator/wood-polishing" className={linkClass}>
              wood polishing calculator
            </Link>{' '}
            for bench-depth estimates when doors dominate spend.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Benefits of estimating before you pick up the phone
          </h2>
          <p className="mb-5">
            You compress vendor theatre: fewer meetings where someone scribbles magical square-foot rates without product
            codes. You align family expectations early—especially helpful when one partner cares about odour timelines and
            another cares about ladder marks on Italian marble. You also stress-test whether{' '}
            <Link href="/colour-visualiser" className={linkClass}>
              colour visualiser
            </Link>{' '}
            experiments stay inside budget when premium tint bases or deep bases multiply litre counts.
          </p>
          <p className="mb-5">
            Operationally, estimators love calculator-informed leads because dimensions arrive with intent; we spend less
            time decoding “whole house” and more time solving actual defects. That translates into tighter quotes and
            fewer mid-job surprises when everyone agrees what “standard prep” meant on day one.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Pricing insights: where digital brackets and site truth diverge
          </h2>
          <p className="mb-5">
            <strong>Material versus labour.</strong> Online tools anchor on typical spreads and Delhi NCR wage bands.
            Skimming projects tilt labour; imported speciality coatings tilt materials. If your walls aspirate moisture in
            monsoon weeks, extra alkali-blocking primer passes blow past any generic litre table—budget contingency for
            it.
          </p>
          <p className="mb-5">
            <strong>Sheen and palette strategy.</strong> Uniform mid-sheen living zones photograph better but forgive less
            during application—crew hours rise slightly versus forgiving flats. Jumping from white-on-white to jewel tones
            across open plans often implies prime-plus-two colour coats on feature planes; say so in enquiry so we do not
            average everything into a single coat assumption.
          </p>
          <p className="mb-5">
            <strong>Comparison shopping.</strong> When another contractor undercuts dramatically, compare primer SKU,
            putty passes, sanding rounds, and masking scope—not headline rupees per foot. Our{' '}
            <Link href="/painting-services" className={linkClass}>
              painting services
            </Link>{' '}
            page explains how we sequence work; pair it with{' '}
            <Link href="/products" className={linkClass}>
              products
            </Link>{' '}
            codes so you can verify apples-to-apples instead of mystery drums.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Pairing this calculator with the detailed painting cost calculator
          </h2>
          <p className="mb-5">
            Use this page when you still move furniture mentally—“about twelve hundred square feet carpet” beats chasing
            a laser meter on Sunday. Switch to the{' '}
            <Link href="/calculator/painting" className={linkClass}>
              painting cost calculator
            </Link>{' '}
            when dimensions firm up: ceilings taller than ten feet, deduct doors you are not painting, or split zones
            with different systems (kids bath versus guest bedroom). Running both builds confidence—wide bracket here,
            narrowed bracket there—before you cross-reference{' '}
            <Link href="/testimonials" className={linkClass}>
              testimonials
            </Link>{' '}
            for how budgets behaved after similar scopes.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            GST, payment milestones, and contract hygiene
          </h2>
          <p className="mb-5">
            Treat on-screen math as planning density; statutory lines belong on signed paperwork. Ask explicitly whether
            quoted figures include GST, transport surcharges for odd drum sizes, or society lift deposits allocated under
            painting heads. If procurement splits across your CA’s books versus personal account, mention it early—some
            developers bundle service tax differently on commercial towers versus standalone villas.
          </p>
          <p className="mb-5">
            Milestones tied to moisture readings—not arbitrary calendar dates—protect both sides when curing stretches in
            humid weeks. For policy-level reassurance beyond calculator logic, skim{' '}
            <Link href="/faq" className={linkClass}>
              FAQ
            </Link>{' '}
            entries on warranties and touch-ups, then escalate nuanced clauses through{' '}
            <Link href="/contact" className={linkClass}>
              contact
            </Link>{' '}
            if legal teams need vendor certificates.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
            Turning numbers into a booked crew
          </h2>
          <p className="mb-5">
            Capture screenshots or jot bracket midpoints, then attach room photos showing cracks, existing enamel, or
            wallpaper remnants. Note society rules on solvent hours if enamels appear in scope. Within one thread—email or
            WhatsApp—reference both calculator outputs so scheduling knows whether you prioritised speed or showroom-grade
            finesse.
          </p>
          <p className="mb-5">
            If outputs feel high, revisit assumptions before diluting product quality: shrinking accent zones, phasing
            bedrooms across quarters, or staging DIY masking yourself sometimes preserves the durable coatings that make
            five-year reviews glow. If outputs feel low, congratulations—you probably uncovered missing exterior pods or
            polish metres; fix inputs rather than chasing unrealistic street quotes.
          </p>
        </article>

        <div className="mt-10 md:mt-12 pb-4 max-w-3xl mx-auto w-full text-center">
          <h2 className="text-2xl font-bold text-[#299dd7] mb-3 scroll-mt-24">
            Frequently asked questions
          </h2>
          <p className="text-[rgba(64,80,94,1)] mb-6 text-base md:text-lg font-light">
            Quotes versus estimates, GST, exterior scope, and how this tool fits the detailed calculators.
          </p>
          <Accordion type="single" collapsible className="w-full space-y-3 text-left">
            {paintBudgetCalculatorFaq.map((item, index) => (
              <AccordionItem
                key={`paint-budget-calculator-faq-${index}`}
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#ED276E] to-[#299dd7] w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white text-[40px] font-medium mb-6">Need Personalized Assistance?</h2>
          <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
            Our experts are ready to provide detailed estimates tailored to your specific requirements.
          </p>
          <div className="inline-block">
            <a
              href="/contact"
              className="bg-transparent border-2 border-white text-white hover:bg-[#0FA0CE] hover:border-[#0FA0CE] transition-colors duration-300 font-medium rounded-full px-8 py-4 text-lg"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Action Buttons - Fixed at Bottom */}
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

export default Calculator;

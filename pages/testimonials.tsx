import React from "react";
import Head from "next/head";
import type { FAQItem } from "@/data/faq";
import { JsonLd, FAQ_PAGE_JSON_LD } from "@/components/seo/JsonLd";
import { getOgImageUrl } from "@/lib/mediaUrl";
import Link from "next/link";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import WhatsAppButton from "@/components/home/WhatsAppButton";
import { TestimonialsGrid } from "@/components/testimonials/TestimonialsGrid";
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
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://homeglazer.com";

const linkClass = "text-[#299dd7] font-medium hover:underline";

const h2Article =
  "text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2";

const testimonialsPageFaq: FAQItem[] = [
  {
    question: "Are the letters and photos on this page from real HomeGlazer customers?",
    answer:
      "Yes. What you see are genuine thank-you notes, acknowledgements, and project photos clients agreed we could share. We do not purchase fake reviews. If a name is redacted, it is for privacy—especially in premium residences or corporate spaces—not because the project was staged.",
  },
  {
    question: "Do positive testimonials mean my quote will match a neighbour’s job?",
    answer:
      "Not automatically. Every flat, villa, and office has different wall condition, height, access, sheen level, and product line. Testimonials show how we work and how finishes hold up; your numbers still come from a site-specific scope. Use the paint budget calculator and painting cost calculator for ballparks, then share photos in an enquiry so we line-item what is actually on your walls.",
  },
  {
    question: "What should I look for in a painting review besides five stars?",
    answer:
      "Read for punctuality, dust control, edge quality, and how the team handled surprises like damp patches or old oil enamel. Good feedback names phases: prep, priming, topcoats, cleanup. Vague superlatives help less than comments about communication, schedule slip, and how snags were closed before final payment.",
  },
  {
    question: "Can I visit a finished site before I book?",
    answer:
      "Sometimes, when a past client allows it and the property is not tenanted. More often we share additional photos, product notes, and references you can call. Delhi NCR traffic and privacy mean we cannot promise walk-throughs for every lead, but we are straightforward about what is possible once we know your sector and timeline.",
  },
  {
    question: "How do testimonials relate to warranty or touch-up policy?",
    answer:
      "They are social proof, not a legal document. Your protection is the written scope, product specification, and payment milestones you agree before work starts. That said, many testimonials mention aftercare because we return for agreed touch-ups when chemistry, curing, or site conditions require it. Check the general FAQ and your estimate for the exact terms on your job.",
  },
  {
    question: "I am comparing three contractors—how should I use this page?",
    answer:
      "Use it to calibrate culture: do clients describe the same pain points you care about—noise, kids at home, lift timing, pet safety? Then move to objective comparison: material grades in the quote, prep hours, primer system, and who supplies masking film. Pair that with our painting services overview and, if you are still choosing colour, the colour visualiser before you lock a contractor.",
  },
  {
    question: "Do you take on commercial or only residential work referenced here?",
    answer:
      "Both appear over the years, though most published letters skew residential because homeowners love sharing a transformed living room. Offices, retail, and common-area jobs often have stricter photo rights. Tell us if you are B2B; we route you to the right crew lead and can share relevant case language under NDA when needed.",
  },
  {
    question: "Where else can I research HomeGlazer before I contact you?",
    answer:
      "Browse product partners on the products page, read process-wide answers on the FAQ, and see the company story on about. For a live conversation, use contact or WhatsApp with your pin code and a few room photos—faster than guessing from someone else’s floor plan.",
  },
];

export default function TestimonialsPage() {
  return (
    <>
      <Head>
        <title>Customer Testimonials | HomeGlazer</title>
        <meta
          name="description"
          content="Real customer letters and photos from HomeGlazer painting projects in Delhi NCR. Read what homeowners say, how to interpret reviews, what to ask for in a quote, and FAQs—then book with confidence."
        />
        <meta
          name="keywords"
          content="customer testimonials, painting reviews, HomeGlazer feedback, satisfied customers, painting company reviews"
        />
        <meta property="og:title" content="Customer Testimonials | HomeGlazer" />
        <meta
          property="og:description"
          content="Real thank-you letters, project photos, and a guide to choosing painters: budgets, prep, and what strong reviews should mention."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content={getOgImageUrl("/uploads/hero-banner.png", SITE_URL)}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Customer Testimonials | HomeGlazer" />
        <meta
          name="twitter:description"
          content="Delhi NCR painting testimonials plus FAQs on quotes, site visits, and what great reviews should include."
        />
        <meta
          name="twitter:image"
          content={getOgImageUrl("/uploads/hero-banner.png", SITE_URL)}
        />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(testimonialsPageFaq)} />

      <div className="bg-white flex flex-col overflow-hidden items-center">
        <Header />

        <div className="w-[90%] lg:w-[80%] mx-auto pt-28">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/testimonials">Testimonials</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <main className="w-[90%] lg:w-[80%] mx-auto pt-8 pb-16 md:pb-20">
          <div className="text-center">
            <h1 className="text-3xl md:text-[40px] font-bold text-[var(--brand-pink)] mb-3 md:mb-4">
              Customer Testimonials
            </h1>
            <p className="text-base md:text-xl text-[rgba(64,80,94,1)] font-light mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed">
              We are grateful for the trust our customers place in us. Below are
              heartfelt letters and testimonials from clients who have
              experienced our painting services.
            </p>
            <h2
              id="testimonials-gallery-heading"
              className="text-2xl md:text-[32px] font-bold text-[#299dd7] mb-6 md:mb-8"
            >
              Thank-you letters &amp; client photos
            </h2>
            <section aria-labelledby="testimonials-gallery-heading">
              <TestimonialsGrid />
            </section>
          </div>

          <section
            className="mt-14 md:mt-16 pt-10 md:pt-12 border-t border-gray-200 w-full"
            aria-labelledby="testimonials-guide-heading"
          >
            <h2 id="testimonials-guide-heading" className="sr-only">
              Guide to reading testimonials and hiring painters
            </h2>
            <article className="prose prose-lg max-w-3xl mx-auto text-left text-[rgba(64,80,94,1)] prose-a:no-underline prose-strong:text-gray-900">
              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
                Why testimonials still matter when every painter claims “premium finish”
              </h2>
              <p className="mb-5">
                Online listings repeat the same adjectives; scanned letters and dated project photos are harder to fake
                at scale. They show someone stayed long enough after completion to write a note, or cared enough to send
                a picture when the furniture went back. For families in Delhi NCR juggling builders, school schedules,
                and monsoon humidity, that social proof answers a different question than price alone:{" "}
                <em>Will the crew respect my home while the work is messy?</em>
              </p>
              <p className="mb-5">
                Use this gallery as a mood board for finishing standards—edge sharpness, uniform sheen, clean switch
                cut-ins—not as a substitute for your own site survey. When you are ready to move from browsing to
                planning, open the{" "}
                <Link href="/painting-services" className={linkClass}>
                  painting services
                </Link>{" "}
                overview to see how we structure prep, priming, and topcoats, then send dimensions through{" "}
                <Link href="/enquiry" className={linkClass}>
                  enquiry
                </Link>{" "}
                so estimates reflect your actual substrate.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
                Reading between the lines: what strong feedback usually mentions
              </h2>
              <p className="mb-5">
                Short praise feels good; detailed praise is instructive. Look for references to masking, daily cleanup,
                ladder discipline in staircases, and how supervisors communicated delays. Indian apartments often hide
                plaster cracks and efflorescence until old emulsion comes off—reviews that describe calm problem-solving
                when that appears tend to match teams who carry compatible primers and do not rush wet coats.
              </p>
              <p className="mb-5">
                Photos complement words: check colour consistency under warm LED and daylight if both appear. If you are
                still shortlisting hues, the{" "}
                <Link href="/colour-visualiser" className={linkClass}>
                  colour visualiser
                </Link>{" "}
                helps compare families before you commit litres. For speciality scopes—feature walls, textures, or
                wallpaper—jump from general painting to our{" "}
                <Link href="/services/wall-decor" className={linkClass}>
                  wall decor hub
                </Link>{" "}
                so decorative labour is quoted explicitly, not folded silently into a basic per-square-foot rate.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
                Typical projects behind the thank-you notes
              </h2>
              <p className="mb-5">
                <strong>Full-home refresh before move-in.</strong> Buyers want odour control, fast sequencing between
                civil and modular vendors, and crisp whites in passages that make flooring pop. Testimonials here often
                mention parallel rooms so families can sleep in one block while another dries.
              </p>
              <p className="mb-5">
                <strong>Rental handback or pre-sale polish.</strong> Landlords and sellers optimise cost per visible
                defect. Reviews may highlight efficient touch-up packs rather than unnecessary recoats—honest scoping
                shows up in repeat landlords referring new blocks.
              </p>
              <p className="mb-5">
                <strong>Living-room upgrades without full renovation.</strong> Changing ceiling tone, adding a contrast
                wall, or upgrading from matt to low-sheen scrubbable finishes transforms light behaviour without hacking.
                Clients who mention “kids washable paint” are signalling real-world durability expectations you should
                voice in your own brief.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
                Benefits testimonials hint at—beyond a smooth roller finish
              </h2>
              <p className="mb-5">
                Consistent documentation: sites where photos progress from stripped walls to sealed primer to final coat
                reduce disputes later. Predictable scheduling: crews who state morning arrival windows and stick to them
                save security desk friction in gated communities. Material traceability: specifying branded primers and
                topcoats from our{" "}
                <Link href="/products" className={linkClass}>
                  products
                </Link>{" "}
                reference beats anonymous drums that cannot be repaired patch-perfect in two years.
              </p>
              <p className="mb-5">
                Those operational cues rarely fit a star rating alone. Pair what you read here with the broader policy
                answers in our{" "}
                <Link href="/faq" className={linkClass}>
                  FAQ
                </Link>{" "}
                and, if you want lineage on the company, the{" "}
                <Link href="/about" className={linkClass}>
                  about
                </Link>{" "}
                page. Together they answer who will be on site, how changes get logged, and where to escalate if
                something looks off mid-project.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
                Pricing insight: what reviews prove—and what still needs a line item
              </h2>
              <p className="mb-5">
                Testimonials validate trust and craft; they do not magically equalise quotes across contractors. Two
                identical floor plans can diverge when one estimate assumes single-coat touch-up over existing sound film
                while another budgets full sanding of chalking exteriors or enzyme treatment near kitchens. Use reviews
                to filter out teams that ghost snags after payment, then use numbers to compare apples: primer system,
                putty passes, sheen level, and whether balcony metal or bathroom ceilings sit inside scope.
              </p>
              <p className="mb-5">
                Start with the{" "}
                <Link href="/paint-budget-calculator" className={linkClass}>
                  paint budget calculator
                </Link>{" "}
                for interior litres and labour framing, then refine with the{" "}
                <Link href="/calculator/painting" className={linkClass}>
                  painting cost calculator
                </Link>{" "}
                when you know room counts and heights. Mention testimonial-level expectations—“hotel-passage finish,”
                “zero overspray on wardrobes”—so allowances match ambition instead of default apartment-grade specs.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
                DIY touch-ups versus calling the same professional crew back
              </h2>
              <p className="mb-5">
                Small nail-hole fills after hanging art tempt many owners into leftover pots. That works until sheen
                bands telegraph under side light or alkalinity under a bathroom patch flashes differently. Customers who
                leave generous notes often tried the shortcut first; their stories are a useful nudge to batch cosmetic
                repairs so colour is mixed once, rollers match, and curing time is uniform.
              </p>
              <p className="mb-5">
                When scope grows—whole elevation repaint, stairwell scaffolding, or coordination with wood polishing—keep
                one supervisor accountable rather than splitting trades without a hand-off sheet. If you are unsure where
                your job sits,{" "}
                <Link href="/contact" className={linkClass}>
                  contact
                </Link>{" "}
                us with photos; we will tell you honestly if it is a half-day helper task or a staged repaint with
                containment.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>
                After the paint dries: how we treat the relationship that produced these letters
              </h2>
              <p className="mb-5">
                The gallery freezes happy endpoints; service continues in WhatsApp threads about maintenance cleans,
                recommended re-coat intervals in harsh sun faces, and introductions when neighbours ask who painted flat
                402. We treat testimonials as accountability: the standard that persuaded past clients should be the
                baseline for the next referral, not an excuse to coast.
              </p>
              <p className="mb-5">
                Ready to add your project to that story? Share pin code, approximate square feet, and any problem walls in
                your enquiry—we respond faster when photos show cracks, seepage shadows, or previous dark colours needing
                extra opacity passes. If you still need reassurance after reading every letter above, ask us directly
                which past job in your micro-market most resembles yours; we will map the closest fit we are allowed to
                discuss.
              </p>
            </article>

            <div className="mt-10 md:mt-12 pb-4 max-w-3xl mx-auto w-full text-center">
              <h2 className="text-2xl font-bold text-[#299dd7] mb-3 scroll-mt-24">
                Frequently asked questions
              </h2>
              <p className="text-[rgba(64,80,94,1)] mb-6 text-base md:text-lg font-light">
                Authenticity, quotes, site visits, warranties, and how to compare contractors fairly.
              </p>
              <Accordion type="single" collapsible className="w-full space-y-3 text-left">
                {testimonialsPageFaq.map((item, index) => (
                  <AccordionItem
                    key={`testimonials-page-faq-${index}`}
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
}

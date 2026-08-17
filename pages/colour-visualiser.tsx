import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getMediaUrl, getOgImageUrl } from '@/lib/mediaUrl';
import type { FAQItem } from '@/data/faq';
import { JsonLd, FAQ_PAGE_JSON_LD } from '@/components/seo/JsonLd';
import Header from '../src/components/home/Header';
import Footer from '../src/components/home/Footer';
import WhatsAppButton from '../src/components/home/WhatsAppButton';
import CallButton from '../src/components/home/CallButton';
import DevToolsProtection from '../src/components/security/DevToolsProtection';
import CanvasRoomVisualiser from '../src/components/visualizer/CanvasRoomVisualiser';
import CanvasAdvancedRoomVisualiser from '../src/components/visualizer/CanvasAdvancedRoomVisualiser';
import SvgRoomVisualiser from '../src/components/visualizer/SvgRoomVisualiser';
import SvgAdvancedRoomVisualiser from '../src/components/visualizer/SvgAdvancedRoomVisualiser';
import { useIsMobileDevice } from '@/hooks/useIsMobileDevice';
import { embeddedWallMasks } from '../src/data/embeddedWallMasks';
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

const colourVisualiserFaq: FAQItem[] = [
  {
    question: 'Will the colour on my screen match the paint on my wall?',
    answer:
      'Screens vary in brightness, night mode, and calibration, so treat previews as a strong guide—not a laboratory match. What the visualiser does well is compare shades side by side and show how a hue sits in a room context. Always confirm with a physical swatch or trial patch on your wall under daylight and artificial light before you order full quantities.',
  },
  {
    question: 'What is the difference between the single-wall and advanced visualisers?',
    answer:
      'Single-wall mode is fastest when you want one cohesive colour across the main painted surfaces in the sample scene. Advanced mode lets you assign different colours to separate surfaces—walls, accents, and similar—so you can see contrast, trim logic, and multi-colour schemes. Both are free to try; pick the one that matches how you already picture the job.',
  },
  {
    question: 'Which paint brands or catalogues can I explore after this page?',
    answer:
      'The dedicated flows linked from the tools above connect you into brand and shade catalogues we support in our workflow—Asian Paints, Nerolac, Berger, and others depending on the path you choose. If you already have a brand in mind, start from the basic visualiser and narrow down by family and code.',
  },
  {
    question: 'Can I use the visualiser for exterior painting decisions?',
    answer:
      'The samples here focus on interior room photography, which helps most people with living rooms, bedrooms, and similar spaces. Exterior paint sees harsher light and weather; you can still shortlist colours digitally, then validate with exterior-grade samples and a site discussion. For scope and budget, pair this with our painting cost tools or an enquiry.',
  },
  {
    question: 'Does using the visualiser replace a site visit or quotation?',
    answer:
      'No. It narrows your shortlist and saves time before you talk to us. A proper quote still needs measurements, surface condition, products, and access. When you are ready, use the enquiry form or contact page and mention the shades you liked—we will align the visual idea with a written estimate.',
  },
  {
    question: 'How do I get from “I like this shade” to a real project plan?',
    answer:
      'Export the idea in your own notes—colour name, code, and brand if shown—then request a visit. Many clients also run the paint budget calculator alongside so they know whether their shortlist sits inside a comfortable range before locking finishes. Our team can suggest primers, sheen, and system compatibility for the substrate you actually have.',
  },
  {
    question: 'Is the colour visualiser free, and do I need an account?',
    answer:
      'The tool is free to use on this website and does not require an account. We may ask for contact details only if you choose to send an enquiry or request a quote through a form—standard for any follow-up from our side.',
  },
  {
    question: 'Where does HomeGlazer provide painting services?',
    answer:
      'We work with homeowners and businesses across Delhi NCR and nearby areas. If you are unsure about your location, message us through the enquiry or contact page and we will confirm availability.',
  },
];

const ColourVisualiserPage: React.FC = () => {
  const isMobileDevice = useIsMobileDevice();
  const [colorIndex, setColorIndex] = useState(0);
  const wallMasks = embeddedWallMasks.bedroom6 ?? {};

  const warmColors = React.useMemo(
    () => ['#FF6B6B', '#FF8E53', '#FFB74D', '#FFD54F', '#FFAB91', '#F48FB1'],
    []
  );

  const coolColorSets = React.useMemo(
    () => [
      { left: '#4FC3F7', right: '#81C784', window: '#BA68C8' },
      { left: '#FF6B6B', right: '#FFB74D', window: '#4FC3F7' },
      { left: '#81C784', right: '#BA68C8', window: '#FF8E53' },
      { left: '#BA68C8', right: '#4FC3F7', window: '#81C784' },
      { left: '#FFB74D', right: '#FF6B6B', window: '#4DB6AC' },
      { left: '#F06292', right: '#81C784', window: '#4FC3F7' },
    ],
    []
  );

  const roomImage = getMediaUrl('/assets/images/bedroom/bedroom6/bedroom6.jpg');
  const wallKeys = ['left', 'right', 'window'];

  useEffect(() => {
    let colorInterval: NodeJS.Timeout;
    const startInterval = () => {
      colorInterval = setInterval(() => {
        setColorIndex((prev) => (prev + 1) % Math.max(warmColors.length, coolColorSets.length));
      }, 1000);
    };

    const timeoutId = setTimeout(startInterval, 300);

    return () => {
      clearTimeout(timeoutId);
      if (colorInterval) clearInterval(colorInterval);
    };
  }, [warmColors.length, coolColorSets.length]);

  const combinedWallPath = wallKeys
    .map((k) => wallMasks[k])
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <Head>
        <title>Wall Colour Visualiser Hub | HomeGlazer — Preview Interior Paint Shades</title>
        <meta
          name="description"
          content="Start here: pick single-wall preview or jump into the advanced room-photo visualiser. Browse Asian Paints, Berger, Nerolac &amp; more—compare shades on sample rooms, then plan budget and quotes for Delhi NCR."
        />
        <meta property="og:title" content="Wall Colour Visualiser Hub | HomeGlazer — Preview Interior Paint Shades" />
        <meta
          property="og:description"
          content="Compare interior paint colours on sample rooms or switch to advanced upload mode. Free visualiser for homeowners planning painting in Delhi NCR."
        />
        <meta property="og:image" content={getOgImageUrl('/uploads/living-room.jpg', SITE_URL)} />
        <meta name="twitter:title" content="Wall Colour Visualiser Hub | HomeGlazer" />
        <meta
          name="twitter:description"
          content="Preview interior paint shades on sample rooms or use advanced upload—then connect to budgeting and painting."
        />
        <meta name="twitter:image" content={getOgImageUrl('/uploads/living-room.jpg', SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(colourVisualiserFaq)} />
      <DevToolsProtection />
      <div className="bg-white flex flex-col overflow-hidden items-center">
        <Header />

        <main className="w-full flex flex-col items-center">
          <div className="w-[90%] lg:w-[80%] mx-auto pt-20 md:pt-28 flex justify-center">
            <Breadcrumb className="w-full max-w-none flex justify-center">
              <BreadcrumbList className="justify-center">
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/colour-visualiser">Colour Visualiser</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Split visualiser: height follows content (no min-h-screen — avoids huge gap before article) */}
          <div className="relative w-full flex flex-col pt-6">
            <div className="relative flex flex-col lg:flex-row">
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent z-10 transform -translate-x-1/2"></div>
              <div className="hidden lg:block absolute left-1/2 top-0 h-20 w-px bg-gradient-to-b from-gray-300 to-transparent z-10 transform -translate-x-1/2"></div>
              <div className="hidden lg:block absolute left-1/2 bottom-0 h-20 w-px bg-gradient-to-t from-gray-300 to-transparent z-10 transform -translate-x-1/2"></div>

              <div
                className="relative w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 pt-10 lg:pt-12 pb-10 lg:pb-12"
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #e8f4f8 50%, #f1f5f9 100%)',
                }}
              >
                <div className="absolute inset-0 opacity-3">
                  <div
                    className="absolute inset-0 transition-all duration-600 ease-out"
                    style={{
                      background: `radial-gradient(circle at 30% 40%, ${warmColors[colorIndex % warmColors.length]}15 0%, transparent 70%)`,
                    }}
                  />
                </div>

                <div className="relative z-10 text-center max-w-lg mx-auto">
                  <h2 className="max-[1366px]:text-3xl max-[1366px]:whitespace-nowrap min-[1367px]:text-4xl min-[1367px]:lg:text-5xl font-bold mb-6 leading-tight text-[var(--brand-pink)]">
                    Single Wall Visualiser
                  </h2>
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                    Quickly preview popular colour combinations on sample rooms. Simple and fast!
                  </p>

                  <div className="mb-8 relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {isMobileDevice ? (
                      <SvgRoomVisualiser
                        imageSrc={roomImage}
                        wallPath={combinedWallPath}
                        colorHex={warmColors[colorIndex % warmColors.length]}
                        roomLabel="single wall"
                      />
                    ) : (
                      <CanvasRoomVisualiser
                        imageSrc={roomImage}
                        wallPath={combinedWallPath}
                        colorHex={warmColors[colorIndex % warmColors.length]}
                        roomLabel="single wall"
                      />
                    )}
                  </div>

                  <Link
                    href="/colour-visualiser/basic"
                    className="group inline-flex items-center bg-[#ED276E] hover:bg-[#c91d5a] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    Try Single Wall Visualiser
                    <svg className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>

              <div
                className="relative w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 pt-10 lg:pt-12 pb-10 lg:pb-12"
                style={{
                  background: 'linear-gradient(135deg, #f1f5f9 0%, #e8f4f8 50%, #f8fafc 100%)',
                }}
              >
                <div className="absolute inset-0 opacity-3">
                  <div
                    className="absolute inset-0 transition-all duration-600 ease-out"
                    style={{
                      background: `radial-gradient(circle at 70% 40%, ${coolColorSets[colorIndex % coolColorSets.length]?.left || '#4FC3F7'}15 0%, transparent 70%)`,
                    }}
                  />
                </div>

                <div className="relative z-10 text-center max-w-lg mx-auto">
                  <h2 className="max-[1366px]:text-3xl max-[1366px]:whitespace-nowrap min-[1367px]:text-4xl min-[1367px]:lg:text-5xl font-bold mb-6 leading-tight text-[#299dd7]">
                    Advanced Visualiser
                  </h2>
                  <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                    Choose different colours for each wall and roof across multiple room types.
                  </p>

                  <div className="mb-8 relative w-full bg-gray-100 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {isMobileDevice ? (
                      <SvgAdvancedRoomVisualiser
                        imageSrc={roomImage}
                        wallMasks={wallMasks}
                        assignments={coolColorSets[colorIndex % coolColorSets.length] ?? {}}
                        loadingMasks={false}
                        basePhotoAlt="Bedroom sample room with multi-wall paint colour preview"
                      />
                    ) : (
                      <CanvasAdvancedRoomVisualiser
                        imageSrc={roomImage}
                        wallMasks={wallMasks}
                        assignments={coolColorSets[colorIndex % coolColorSets.length] ?? {}}
                        loadingMasks={false}
                      />
                    )}
                  </div>

                  <Link
                    href="/colour-visualiser/advanced"
                    className="group inline-flex items-center bg-[#299dd7] hover:bg-[#2080b8] text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                  >
                    Try Advanced Visualiser
                    <svg className="ml-3 w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <section className="w-[90%] lg:w-[80%] max-w-3xl mx-auto py-12 md:py-16 border-t border-gray-100 text-left">
            <div className="mb-8 md:mb-10 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold leading-tight md:leading-[150%] text-[var(--brand-pink)] mt-0 pt-0">
                Paint colour visualiser for your walls
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-[#299dd7] mt-5 md:mt-6 pt-1 leading-snug">
                Shortlist shades with confidence before you buy paint or book a crew
              </h2>
              <p className="text-[rgba(64,80,94,1)] mt-4 md:mt-5 text-base md:text-xl font-light leading-relaxed">
                Choosing colour from tiny chips under store lighting is how regret sneaks in. On this page you can try
                both a quick single-wall preview and a richer multi-surface layout on sample photography—enough to feel
                how a tone behaves across a whole field rather than a one-inch square. When you have a direction, connect
                it to numbers with the{' '}
                <Link href="/paint-budget-calculator" className={linkClass}>
                  paint budget calculator
                </Link>
                , read how we work on{' '}
                <Link href="/painting-services" className={linkClass}>
                  painting services
                </Link>
                , or send an{' '}
                <Link href="/enquiry" className={linkClass}>
                  enquiry
                </Link>{' '}
                for a human check on products and prep.
              </p>
            </div>
            <article className="prose prose-lg max-w-none text-left text-[rgba(64,80,94,1)] prose-a:no-underline prose-strong:text-gray-900">
              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Why preview colour on a wall before you commit</h2>
              <p className="mb-5">
                Paint rarely reads the same on a brochure, a phone screen, and your actual plaster. Add furniture, floor
                tone, and the direction of light, and two neighbours can paint the “same” beige with completely different
                outcomes. A visualiser will not replace a wet sample on site, but it closes the biggest gap in the
                journey: you see how a colour occupies space instead of sitting flat on paper. That alone cuts down
                impulse choices and expensive rework.
              </p>
              <p className="mb-5">
                Most people land here in one of three moods—excited but overwhelmed, renovating on a deadline, or fixing a
                previous mistake. In all three cases, the goal is the same: narrow ten maybes to two or three strong
                candidates before you involve contractors or lock quantities. From there, our{' '}
                <Link href="/calculator/painting" className={linkClass}>
                  painting cost calculator
                </Link>{' '}
                helps translate area and product choices into a realistic budget band, while{' '}
                <Link href="/services/painting/residential" className={linkClass}>
                  residential painting
                </Link>{' '}
                explains how we sequence prep, masking, and handover when you are ready to execute.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>What the two tools above are best for</h2>
              <p className="mb-5">
                The left preview is built for speed when you want one dominant wall colour in a simple scene—ideal if
                you are early in the process and still learning what “warm white” versus “greige” feels like at scale.
                The right preview adds the puzzle of contrast: accent walls, trims that need to relate, and the way
                adjacent hues interact when they share the same room. Neither path asks you to sign up; they are meant as
                a sandbox.
              </p>
              <p className="mb-5">
                Typical situations we see include young families debating a calm nursery versus a bolder play corner,
                couples splitting opinions on a feature wall, landlords refreshing between tenants, and offices trying to
                align reception branding with quieter workstations. The visualiser does not know your brief—but you do,
                and seeing colour in context makes that brief easier to explain when you{' '}
                <Link href="/contact" className={linkClass}>
                  contact
                </Link>{' '}
                us with photos and measurements.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Screen, swatch, and site visit—how they fit together</h2>
              <p className="mb-5">
                <strong>On screen.</strong> Use digital previews to kill obvious mismatches and build a shortlist you
                actually like, not just one that looked safe under a store spotlight.
              </p>
              <p className="mb-5">
                <strong>With a physical swatch.</strong> Hold chips vertically against the wall, not flat on a counter,
                and glance at them morning and evening. If two shades look identical on paper, the visualiser often
                helped you notice undertone differences earlier.
              </p>
              <p className="mb-5">
                <strong>On site.</strong> Moisture, age of plaster, primer system, and sheen all shift the final
                appearance. That is why professional quotes still include a walkthrough—even when you arrive with perfect
                screenshots. We would rather align expectations up front than debate them after the first coat dries.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Budget and brand reality—without the sales pressure</h2>
              <p className="mb-5">
                Premium lines, economy lines, low-VOC options, and speciality finishes sit at different price points for
                good reason: resin quality, scrub resistance, and warranty terms change with the system. The visualiser
                keeps the conversation in the creative lane; the budget tools and a short call handle the economics. If
                you are weighing woodwork alongside walls, many clients also glance at{' '}
                <Link href="/services/wood/wood-polishing" className={linkClass}>
                  wood polishing
                </Link>{' '}
                timelines so trims and joinery are not an afterthought.
              </p>
              <p className="mb-5">
                When you are happy with a direction, bring your shortlist into an enquiry. Mention the brand or family
                if you already know it; if not, say what feeling you want—cooler, warmer, cleaner, moodier—and we can
                propose compatible systems. For process questions that apply across projects, the{' '}
                <Link href="/faq" className={linkClass}>
                  FAQ
                </Link>{' '}
                page covers crew size, materials, and how communication works on site.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>What to do next on HomeGlazer</h2>
              <p className="mb-5">
                Stay in the tools until you have two or three finalists, then cross-check cost and availability. If you
                already know square footage and rough scope, run the calculators; if not, send photos and we will guide
                measurements. However you prefer to work—structured forms or a direct call—the important part is that
                your colour story, budget story, and site reality line up before the first tin opens.
              </p>
            </article>
          </section>

          <section className="w-[90%] lg:w-[80%] max-w-3xl mx-auto pb-16 md:pb-20 text-center">
            <h2 className="text-2xl font-bold text-[#299dd7] mt-12 md:mt-16 pt-2 mb-3 scroll-mt-24">
              Frequently asked questions
            </h2>
            <p className="text-[rgba(64,80,94,1)] mb-6 mx-auto max-w-2xl text-base md:text-lg font-light">
              Accuracy, basic versus advanced flows, quotes, and service areas. For general painting questions, see the
              main{' '}
              <Link href="/faq" className={linkClass}>
                FAQ page
              </Link>
              .
            </p>
            <Accordion type="single" collapsible className="w-full space-y-3 text-left">
              {colourVisualiserFaq.map((item, index) => (
                <AccordionItem
                  key={`colour-vis-faq-${index}`}
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
              href="/paint-budget-calculator"
              className="flex-1 bg-[#299dd7] text-white py-3 px-3 rounded-lg font-medium text-center hover:bg-[#237bb0] transition flex items-center justify-center text-[15px] whitespace-nowrap"
            >
              Budget Calculator
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

export default ColourVisualiserPage;

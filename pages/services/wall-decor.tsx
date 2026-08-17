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
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';
const WALL_DECOR_HERO_IMAGE = "/uploads/texture-painting.jpg";

const linkClass = 'text-[#299dd7] font-medium hover:underline';

const h2Article =
  'text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2';

const wallDecorHubFaq: FAQItem[] = [
  {
    question: 'Which wall decor option is easiest to change later—texture, stencil, graffiti, or wallpaper?',
    answer:
      'Wallpaper and some stencil schemes can be removed or painted over with proper prep, though adhesive and emboss depth matter. Heavy texture and large-scale mural or graffiti-style work often need more sanding or skimming before a plain repaint. If you know you will redecorate every few years, say so early—we can recommend systems and primers that make the next cycle cheaper.',
  },
  {
    question: 'Does wall decor cost more than standard emulsion painting?',
    answer:
      'Usually yes, because labour time, speciality materials, masking, and rework risk rise with pattern complexity. The gap varies: a subtle texture in one feature wall may be modest, while floor-to-ceiling custom graffiti is a different budget class. Share photos and dimensions through enquiry or contact and we will bracket it honestly before site visit.',
  },
  {
    question: 'How long does a typical feature wall take compared with rolling one colour?',
    answer:
      'A simple roller coat across a room is fastest. Stencils, textures, and wallpaper need layout, drying between passes, and inspection under raking light. Multi-day schedules are normal when humidity is high or when we are matching a sample board exactly. We outline days on paper, not vague “soon.”',
  },
  {
    question: 'Can wall decor go in kitchens, bathrooms, or exterior facades?',
    answer:
      'Some finishes can; others cannot. Moisture, heat behind stoves, and direct weather all filter the shortlist. Each specialist page—texture, stencil, wallpaper, graffiti—notes typical use cases; your survey confirms what your actual wall can hold without peeling.',
  },
  {
    question: 'Do I need to empty the room completely?',
    answer:
      'We need safe access, plastic protection for furniture that stays, and power for lights or lifts in tall voids. You do not always need a bare shell, but fragile items and wall-hung art should move. We will spell out what to shift when we confirm the job.',
  },
  {
    question: 'How does this relate to the colour visualiser or product catalog?',
    answer:
      'The visualiser helps you preview flat colour relationships in a room; wall decor adds relief, pattern, or art layer on top. Products in our catalog often supply base coats or compatible systems. Many clients shortlist colour digitally, then choose texture or wallpaper in person against real light.',
  },
  {
    question: 'Is wall decor suitable for kids rooms and rental flats?',
    answer:
      'Kids rooms often suit washable paints plus stencil accents or controlled graphics—avoid fragile finishes within toddler reach. Rentals depend on landlord rules; removable wallpaper or lighter textures may be safer than aggressive adhesives or deep relief that is hard to restore.',
  },
  {
    question: 'Where does HomeGlazer provide these services?',
    answer:
      'We work across Delhi NCR and nearby areas. Mention your sector or pin when you reach out so we confirm travel and crew availability up front.',
  },
];

const WallDecor: React.FC = () => {
  return (
    <>
      <Head>
        <title>Wall Decor Services | HomeGlazer - Texture & Stencil</title>
        <meta
          name="description"
          content="Wall decor in Delhi NCR: graffiti art, texture painting, stencil design, and wallpaper. Compare options, budgets, and timelines—then book HomeGlazer for feature walls and full rooms."
        />
        <meta property="og:title" content="Wall Decor Services | HomeGlazer - Texture & Stencil" />
        <meta
          property="og:description"
          content="Texture, stencil, graffiti, and wallpaper specialists. Planning guides, FAQs, and links to each wall decor service."
        />
        <meta property="og:image" content={getOgImageUrl(WALL_DECOR_HERO_IMAGE, SITE_URL)} />
        <meta name="twitter:title" content="Wall Decor Services | HomeGlazer" />
        <meta name="twitter:description" content="Wall decor hub: texture, stencil, graffiti, wallpaper—guides, FAQs, and service links for Indian homes and offices." />
        <meta name="twitter:image" content={getOgImageUrl(WALL_DECOR_HERO_IMAGE, SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(wallDecorHubFaq)} />
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
                <BreadcrumbLink href="/services/wall-decor">Wall Decor</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        
        <section
          className="w-[90%] lg:w-[80%] 2xl:w-[1400px] mx-auto pt-6 pb-16 md:pb-20"
          aria-labelledby="wall-decor-services-heading"
        >
          <h1
            id="wall-decor-services-heading"
            className="text-3xl md:text-4xl font-bold text-center text-[var(--brand-pink)] mb-3 md:mb-4"
          >
            Wall decor services for standout interiors
          </h1>
          <p className="text-center text-[rgba(64,80,94,1)] max-w-3xl mx-auto mb-5 md:mb-6 text-base md:text-lg font-light leading-relaxed">
            Texture finishes, stencils, graffiti art and wallpaper—choose a style and we&apos;ll guide you to the right specialist page.
          </p>
          <h2 className="text-2xl md:text-[28px] font-bold text-center text-[#299dd7] mb-6 md:mb-8">
            Graffiti, texture painting, stencil art &amp; wallpaper
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-6">
            {/* First Row */}
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/uploads/services/Graffiti%20Paintingthumb.png")} 
                alt="Graffiti Painting" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Graffiti Painting</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Bold, artistic statements that make your walls stand out.</p>
                <Link 
                  href="/services/wall-decor/graffiti-painting"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/uploads/texture-painting.jpg")} 
                alt="Texture Painting" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Texture Painting</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Add depth and dimension with stylish textured finishes.</p>
                <Link 
                  href="/services/wall-decor/texture-painting"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
              <img 
                src={getMediaUrl("/uploads/services/stencil-thumb.png")} 
                alt="Stencil Art" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Stencil Art</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Clean, creative patterns for a sharp, modern look.</p>
                <Link 
                  href="/services/wall-decor/stencil-art"
                  className="flex items-center justify-center bg-[#ED276E] hover:bg-[#c91d5a] text-white rounded-full py-3 px-6 transition-colors"
                >
                  Learn More
                  <ArrowRight className="ml-2" size={20} />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden shadow">
            <img 
                src={getMediaUrl("/uploads/wallpaper.jpg")} 
                alt="Wallpaper" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-xl font-semibold mb-2 text-[var(--brand-pink)]">Wallpaper</h3>
                <p className="text-[rgba(64,80,94,1)] mb-4 text-sm md:text-base">Elegant designs with a flawless, bubble-free finish.</p>
                <Link 
                  href="/services/wall-decor/wallpaper"
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
              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>When wall decor beats “just another coat of paint”</h2>
              <p className="mb-5">
                Flat colour solves volume and mood; wall decor solves memory. Guests remember the mural in the lobby, the
                subtle lime-plaster texture in the passage, or the wallpaper that tied the sofa and rug together. This hub
                splits that world into four crafts—each with its own prep rules, drying behaviour, and maintenance
                story. Use the tiles above to jump into the detail page that matches your reference images; use the
                paragraphs here to decide whether you are chasing depth, pattern, street-art energy, or a textile-like
                finish.
              </p>
              <p className="mb-5">
                If you are still choosing between a bold hue and a bold surface, run the{' '}
                <Link href="/colour-visualiser" className={linkClass}>
                  colour visualiser
                </Link>{' '}
                first, then come back. Colour without texture can feel flat in large daylight walls; texture without a
                coherent palette can feel busy. The sweet spot is usually one disciplined base colour family plus one
                hero wall where{' '}
                <Link href="/services/wall-decor/texture-painting" className={linkClass}>
                  texture painting
                </Link>
                ,{' '}
                <Link href="/services/wall-decor/stencil-art" className={linkClass}>
                  stencil art
                </Link>
                , or{' '}
                <Link href="/services/wall-decor/graffiti-painting" className={linkClass}>
                  graffiti-style work
                </Link>{' '}
                carries the story.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>How budgets differ from standard residential painting</h2>
              <p className="mb-5">
                Roll-and-brush emulsion is priced around speed and litres. Decorative work prices around setup, masking,
                repeat alignment, touch-up tolerance, and the cost of failure if a pattern drifts off level. That is why
                two flats with the same square footage can quote differently when one adds a{' '}
                <Link href="/services/wall-decor/wallpaper" className={linkClass}>
                  wallpaper
                </Link>{' '}
                feature and the other stays uniform. We are transparent about where money goes: premium paste, metallic
                glazes, artist hours, or lift rental for a double-height—all line items you should see before work
                starts, not after.
              </p>
              <p className="mb-5">
                Ballpark planning? Pair this page with the{' '}
                <Link href="/paint-budget-calculator" className={linkClass}>
                  paint budget calculator
                </Link>{' '}
                or{' '}
                <Link href="/calculator/painting" className={linkClass}>
                  painting cost calculator
                </Link>{' '}
                for baseline wall areas, then mention “feature treatment” in your{' '}
                <Link href="/enquiry" className={linkClass}>
                  enquiry
                </Link>{' '}
                so estimators know to layer decorative labour on top—not replace it silently with plain rates.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Practical comparisons homeowners ask for</h2>
              <p className="mb-5">
                <strong>Texture versus stencil.</strong> Texture rides light and hides minor plaster sins; stencil
                rewards flat, true walls because every repeat telegraphs a wobble. Some projects combine both—matte
                mineral base plus crisp graphic overlay.
              </p>
              <p className="mb-5">
                <strong>Wallpaper versus paint-only feature.</strong> Wallpaper brings pattern scale you would never
                brush by hand, but seams and humidity matter. Paint-only graphics trade infinite custom colour for fewer
                joints—pick based on climate, wall age, and how often you refinish.
              </p>
              <p className="mb-5">
                <strong>Graffiti and mural energy.</strong> Best when brand, teen room, or café culture is the brief—less
                so when the architecture already shouts. Scale, ventilation during aerosol phases, and future repaint all
                belong in the first conversation, not the punch list.
              </p>

              <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Workflow: from Pinterest board to protected floors</h2>
              <p className="mb-5">
                Expect a sample board or digital markup approval before we cover full walls. Expect dust control and
                floor protection proportional to the mess the system creates—sanding a heavy texture is not the same
                cleanup as hanging paste-the-wall vinyl. Our broader{' '}
                <Link href="/painting-services" className={linkClass}>
                  painting services
                </Link>{' '}
                overview explains crew norms; wall decor simply adds art-department checkpoints in the middle.
              </p>
              <p className="mb-5">
                Product-curious clients sometimes cross-read the{' '}
                <Link href="/products" className={linkClass}>
                  paint products
                </Link>{' '}
                reference for base coats or specialty lines. For process and warranty-style questions that apply across
                jobs, keep the{' '}
                <Link href="/faq" className={linkClass}>
                  FAQ
                </Link>{' '}
                open in another tab. Anything niche—sound reflection in a home theatre texture, fire-rating notes in
                commercial lobbies—belongs in a direct{' '}
                <Link href="/contact" className={linkClass}>
                  contact
                </Link>{' '}
                message with photos.
              </p>
            </article>
          </div>

          <div className="mt-10 md:mt-12 pb-4 max-w-3xl mx-auto w-full text-center">
            <h2 className="text-2xl font-bold text-[#299dd7] mb-3 scroll-mt-24">Frequently asked questions</h2>
            <p className="text-[rgba(64,80,94,1)] mb-6 text-base md:text-lg font-light">
              Budget, timelines, rooms, and how wall decor connects to colour tools and core painting.
            </p>
            <Accordion type="single" collapsible className="w-full space-y-3 text-left">
              {wallDecorHubFaq.map((item, index) => (
                <AccordionItem
                  key={`wall-decor-hub-faq-${index}`}
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
      
      {/* Mobile Action Buttons - Fixed at Bottom */}
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

export default WallDecor;

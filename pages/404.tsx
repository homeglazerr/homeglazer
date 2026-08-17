import Head from "next/head";
import Link from "next/link";
import { Home, Mail, Phone } from "lucide-react";
import Header from "@/components/home/Header";
import Footer from "@/components/home/Footer";
import WhatsAppButton from "@/components/home/WhatsAppButton";
import CallButton from "@/components/home/CallButton";
import { getOgImageUrl } from "@/lib/mediaUrl";
import { SECTION_CTA_CLASSES } from "@/components/home/CTAButton";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://homeglazer.com";

const QUICK_LINKS: { href: string; label: string }[] = [
  { href: "/services/painting/residential", label: "Residential painting" },
  { href: "/services/painting/commercial", label: "Commercial painting" },
  { href: "/services/wood/wood-coating", label: "Wood coating" },
  { href: "/services/wall-decor", label: "Wall decor" },
  { href: "/products", label: "Paint products" },
  { href: "/faq", label: "FAQs" },
];

const NotFound = () => {
  return (
    <>
      <Head>
        <title>Page Not Found | HomeGlazer</title>
        <meta
          name="description"
          content="The page you are looking for could not be found. Browse our painting services, get a free quote, or return to the HomeGlazer homepage."
        />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Page Not Found | HomeGlazer" />
        <meta
          property="og:description"
          content="The page you are looking for could not be found. Continue exploring HomeGlazer."
        />
        <meta
          property="og:image"
          content={getOgImageUrl("/uploads/hero-banner.png", SITE_URL)}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Page Not Found | HomeGlazer" />
        <meta
          name="twitter:description"
          content="The page you are looking for could not be found."
        />
      </Head>
      <div className="bg-white flex min-h-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center px-4 pb-20 pt-28 md:pt-32">
          <div className="mx-auto w-full max-w-lg text-center">
            <p
              className="font-bold tabular-nums text-[#ED276E]"
              style={{ fontSize: "clamp(4rem, 12vw, 6rem)", lineHeight: 1 }}
              aria-hidden
            >
              404
            </p>
            <h1 className="mt-4 text-2xl font-semibold text-gray-900 md:text-3xl">
              We couldn&apos;t find that page
            </h1>
            <p className="mt-3 text-base leading-relaxed text-gray-600 md:text-lg">
              The link may be broken or the page may have moved. Use the
              shortcuts below to find painting services, get a quote, or talk to
              our team.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/enquiry"
                className={`${SECTION_CTA_CLASSES} min-h-[48px] px-8`}
              >
                Get a free quote
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border-2 border-[#ED276E] px-8 font-semibold text-[#ED276E] transition hover:bg-pink-50"
              >
                <Home className="h-5 w-5 shrink-0" aria-hidden />
                Back to homepage
              </Link>
            </div>
          </div>

          <section
            className="mt-14 w-full max-w-2xl rounded-xl border border-gray-200 bg-gray-50 px-5 py-6 text-left shadow-sm"
            aria-labelledby="quick-links-heading"
          >
            <h2
              id="quick-links-heading"
              className="text-center text-lg font-semibold text-gray-900"
            >
              Popular pages
            </h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-lg border border-transparent px-3 py-2 text-[#299dd7] underline-offset-2 hover:bg-white hover:text-[#237bb0] hover:underline"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-gray-700">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-medium text-[#ED276E] underline-offset-2 hover:underline"
            >
              <Mail className="h-5 w-5 shrink-0" aria-hidden />
              Contact us
            </Link>
            <a
              href="tel:+919717256514"
              className="inline-flex items-center gap-2 font-medium text-gray-800 underline-offset-2 hover:text-[#ED276E] hover:underline"
            >
              <Phone className="h-5 w-5 shrink-0" aria-hidden />
              +91 97172 56514
            </a>
          </div>
        </main>
        <Footer />
        <WhatsAppButton />
        <CallButton />
      </div>
    </>
  );
};

export default NotFound;

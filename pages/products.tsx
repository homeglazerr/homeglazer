import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getOgImageUrl } from '@/lib/mediaUrl';
import Head from 'next/head';
import type { FAQItem } from '@/data/faq';
import { JsonLd, FAQ_PAGE_JSON_LD } from '@/components/seo/JsonLd';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppButton from '@/components/home/WhatsAppButton';
import CallButton from '@/components/home/CallButton';
import CTAButton from '@/components/home/CTAButton';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import BrandTabs from '@/components/products/BrandTabs';
import Pagination from '@/components/products/Pagination';
import Link from 'next/link';
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
import { fetchAllProducts, fetchBrands, transformProduct, transformBrand } from '@/lib/api';
import { sortBrandsByDisplayOrder } from '@/lib/brand-order';
import {
  FILTER_OPTIONS,
  filterProducts,
  Product,
} from '@/data/products';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

const linkClass = 'text-[#299dd7] font-medium hover:underline';

const h2Article =
  'text-2xl font-bold text-[#299dd7] scroll-mt-24 [&:not(:first-of-type)]:mt-12 [&:not(:first-of-type)]:md:mt-16 [&:not(:first-of-type)]:pt-2';

const productsPageFaq: FAQItem[] = [
  {
    question: 'Does HomeGlazer sell paint directly from this product listing?',
    answer:
      'No. The catalog on this page is for research and education. We do not operate an e-commerce checkout for the SKUs shown. When you hire us for painting, we procure materials through our normal supply chain and specify systems that match your substrate, budget, and warranty expectations. The disclaimer above applies to every product card.',
  },
  {
    question: 'Why list products at all if they are not for sale on the website?',
    answer:
      'Most homeowners compare names online before they speak to a contractor. A transparent index helps you align vocabulary—sheen, interior versus exterior ranges, popular lines—so your first conversation with us is about outcomes, not confusion over labels. Think of it as a structured brochure that stays searchable and filterable.',
  },
  {
    question: 'Are prices or pack sizes on product pages final?',
    answer:
      'Retail packaging and MRP-style figures change with promotions, region, and distributor. Treat on-page data as indicative. Your written quote will reflect the quantities, primer system, and labour we actually scope on site—not a snapshot from a single catalog screen.',
  },
  {
    question: 'How should I use brand tabs and filters together?',
    answer:
      'Start with the brand that your architect or previous painter recommended, or the one you trust from past experience. Then narrow by category, usage, sheen, and pack size bands to reduce noise. If results go empty, clear one filter at a time; overlapping constraints are the usual cause.',
  },
  {
    question: 'Can I request a quote for a specific product I found here?',
    answer:
      'Yes. Note the product name and brand in your enquiry or contact message, plus approximate area. We will confirm compatibility with your walls, woodwork, or exterior, and suggest alternatives if weathering, damp, or sheen rules out an exact match.',
  },
  {
    question: 'How does this catalog relate to the colour visualiser?',
    answer:
      'The visualiser helps you feel hue and contrast on sample rooms; the product directory ties those ideas to real-world lines and finishes. Many clients shortlist colours digitally, then cross-check suitable product families here before locking a specification. Use both tools in whichever order feels natural.',
  },
  {
    question: 'Do you only work with the brands shown in the tabs?',
    answer:
      'The tabs reflect brands we commonly specify and document. If you need another reputable system, mention it when you reach out—we assess feasibility case by case rather than forcing a mismatch.',
  },
  {
    question: 'What is the fastest way to move from browsing to a number?',
    answer:
      'After you have a shortlist, run the paint budget calculator or painting cost calculator with your best guess at area, then send us the output alongside photos. That combination usually produces a tighter first response than a brand name alone.',
  },
];

type SortOption = 'name-asc' | 'name-desc' | 'size-asc' | 'size-desc';
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'size-asc', label: 'Size: Small to Large' },
  { value: 'size-desc', label: 'Size: Large to Small' },
];

function getMinSizeValue(prices: Record<string, number>): number {
  const keys = Object.keys(prices || {}).filter(k => prices[k]);
  if (keys.length === 0) return Infinity;
  const values = keys.map(k => {
    const num = parseFloat(k.replace(/[LKP]$/i, '')) || 0;
    const isKg = /k$/i.test(k);
    return isKg ? num * 1000 : num;
  });
  return Math.min(...values);
}
function getMaxSizeValue(prices: Record<string, number>): number {
  const keys = Object.keys(prices || {}).filter(k => prices[k]);
  if (keys.length === 0) return -Infinity;
  const values = keys.map(k => {
    const num = parseFloat(k.replace(/[LKP]$/i, '')) || 0;
    const isKg = /k$/i.test(k);
    return isKg ? num * 1000 : num;
  });
  return Math.max(...values);
}

const Products: React.FC = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState(FILTER_OPTIONS.brands);
  const [filterOptions, setFilterOptions] = useState(FILTER_OPTIONS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    sheenLevel: undefined as string | undefined,
    category: undefined as string | undefined,
    usage: undefined as string | undefined,
    quantity: undefined as string | undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const productsPerPage = 12;

  // Fetch products and brands on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch products and brands in parallel
        const [productsData, brandsData] = await Promise.all([
          fetchAllProducts(),
          fetchBrands(),
        ]);

        // Transform API data to frontend format
        const transformedProducts = productsData.map(transformProduct);
        const transformedBrands = sortBrandsByDisplayOrder(brandsData.map(transformBrand));

        // Update filter options with fetched brands (quantity uses fixed ranges)
        setFilterOptions({
          ...FILTER_OPTIONS,
          brands: transformedBrands,
        });

        setProducts(transformedProducts);
        setBrands(transformedBrands);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // Initialize selectedBrand from URL query param (?brand=slug) after brands are loaded
  useEffect(() => {
    const brandSlug = router.query.brand;
    if (typeof brandSlug === 'string' && brandSlug && brands.length > 0) {
      const brandExists = brands.some((b) => b.id === brandSlug);
      if (brandExists) {
        setSelectedBrand(brandSlug);
      }
    }
  }, [router.query.brand, brands]);

  // Filter products based on selected brand and filters
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Apply brand filter
    if (selectedBrand) {
      filtered = filtered.filter(product => product.brandId === selectedBrand);
    }
    
    // Apply other filters
    filtered = filterProducts(filtered, filters);
    
    return filtered;
  }, [products, selectedBrand, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];
    if (sortBy === 'name-asc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'size-asc') {
      sorted.sort((a, b) => {
        const va = getMinSizeValue(a.prices);
        const vb = getMinSizeValue(b.prices);
        return va - vb;
      });
    } else if (sortBy === 'size-desc') {
      sorted.sort((a, b) => {
        const va = getMaxSizeValue(a.prices);
        const vb = getMaxSizeValue(b.prices);
        return vb - va;
      });
    }
    return sorted;
  }, [filteredProducts, sortBy]);

  // Paginate products
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, currentPage]);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  // Handle filter changes
  const handleFilterChange = (filterType: 'sheenLevel' | 'category' | 'usage' | 'quantity', value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value === '' ? undefined : (prev[filterType] === value ? undefined : value)
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Handle brand selection
  const handleBrandSelect = (brandId: string | null) => {
    setSelectedBrand(brandId);
    setCurrentPage(1); // Reset to first page when brand changes
  };

  // Handle sort change
  const handleSortChange = (value: SortOption) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  // Handle page change with scroll to top
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('products-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      sheenLevel: undefined,
      category: undefined,
      usage: undefined,
      quantity: undefined,
    });
    setSelectedBrand(null);
    setCurrentPage(1);
  };

  return (
    <>
      <Head>
        <title>Paint Products | HomeGlazer - Premium Paint Brands</title>
        <meta
          name="description"
          content="Browse HomeGlazer's paint product reference by brand, sheen, and use—Asian Paints, Berger, Nerolac, and more. Informational catalog (we don't sell online); pair with our colour visualiser, calculators, and quotes for Delhi NCR."
        />
        <meta property="og:title" content="Paint Products | HomeGlazer - Premium Paint Brands" />
        <meta
          property="og:description"
          content="Explore paint products by brand and filters. Reference catalog for planning; get quotes and site support from HomeGlazer."
        />
        <meta property="og:image" content={getOgImageUrl('/uploads/color-bucket1.png', SITE_URL)} />
        <meta name="twitter:title" content="Paint Products | HomeGlazer - Premium Paint Brands" />
        <meta name="twitter:description" content="Brand-wise paint reference, filters, and guides—plan with HomeGlazer before you buy or book painting." />
        <meta name="twitter:image" content={getOgImageUrl('/uploads/color-bucket1.png', SITE_URL)} />
      </Head>
      <JsonLd data={FAQ_PAGE_JSON_LD(productsPageFaq)} />
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
              <BreadcrumbLink href="/products">Products</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-br from-[#ED276E] to-[#299dd7] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">
            Premium Paint Products
          </h1>
          <p className="text-white text-xl mb-8 max-w-3xl mx-auto">
            Discover our curated collection of high-quality paints from leading brands. 
            Find the perfect paint for your project with our comprehensive range.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Filters (Hidden on tablet and below) */}
            <div className="hidden lg:block lg:col-span-1">
              <ProductFilters
                filters={filters}
                filterOptions={{ ...filterOptions, brands }}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Right Column - Brand Tabs and Products */}
            <div id="products-list" className="col-span-1 lg:col-span-3">
              {/* Brand Tabs */}
              <BrandTabs
                brands={brands}
                selectedBrand={selectedBrand}
                onBrandSelect={handleBrandSelect}
              />

              {/* Results Count and Sort */}
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-gray-600">
                  Showing {paginatedProducts.length} of {sortedProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-[#299dd7] focus:border-[#299dd7]"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#299dd7] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading products...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-red-400 text-6xl mb-4">⚠️</div>
                  <h3 className="text-xl font-semibold mb-2">
                    Error Loading Products
                  </h3>
                  <p className="text-gray-600 mb-6">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-[#299dd7] text-white px-6 py-3 rounded-lg hover:bg-[#237bb0] transition-colors"
                  >
                    Reload Page
                  </button>
                </div>
              ) : paginatedProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6 mb-8">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🎨</div>
                  <h3 className="text-xl font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or selecting a different brand.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-[#299dd7] text-white px-6 py-3 rounded-lg hover:bg-[#237bb0] transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Disclaimer */}
      <section className="py-6 px-4 mb-8 bg-amber-50 border border-amber-200 mx-4 md:mx-auto md:max-w-4xl">
        <div>
          <p className="text-amber-900 text-sm md:text-base text-center font-medium">
            <span className="font-semibold">Disclaimer:</span> The products shown on this page are for informational purposes only. We do not sell or endorse any products listed on this website. All content is intended for general information only.
          </p>
        </div>
      </section>

      <section className="w-[90%] lg:w-[80%] max-w-3xl mx-auto pt-4 pb-4 md:pb-6 border-t border-gray-100 text-left">
        <article className="prose prose-lg max-w-none text-left text-[rgba(64,80,94,1)] prose-a:no-underline prose-strong:text-gray-900">
          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>How to use this product directory without getting lost</h2>
          <p className="mb-5">
            Paint marketing loves superlatives; job sites care about adhesion, wash cycles, and whether the line was
            meant for your actual wall or ceiling. This page is organised so you can move from brand to line to pack
            size without opening ten manufacturer PDFs in different tabs. When you open a product card, you get a
            dedicated detail view you can share with family or your architect—handy when one person shortlists and
            another approves budget.
          </p>
          <p className="mb-5">
            Treat everything here as a planning layer. Retail promotions, regional pack naming, and distributor stock
            fluctuate; your final specification should always follow a site conversation. If you already know square
            footage, run the{' '}
            <Link href="/paint-budget-calculator" className={linkClass}>
              paint budget calculator
            </Link>{' '}
            or{' '}
            <Link href="/calculator/painting" className={linkClass}>
              painting cost calculator
            </Link>{' '}
            in parallel so numbers and names converge instead of drifting apart.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Economy, mid, and premium—what the split usually means in practice</h2>
          <p className="mb-5">
            <strong>Entry systems</strong> suit low-touch bedrooms, rental refreshes, or phases where you accept shorter
            maintenance cycles. They can still look beautiful fresh; they simply trade some scrub resistance and resin
            build for price.
          </p>
          <p className="mb-5">
            <strong>Mid-tier lines</strong> dominate occupied homes: better stain release, more forgiving application, and
            warranties that match how families actually live. Most clients land here once they see the cost spread versus
            repainting early.
          </p>
          <p className="mb-5">
            <strong>Premium or speciality systems</strong> matter when you need low odour during monsoon interior work,
            high moisture bathrooms, feature textures, or exterior UV stress. The catalog helps you recognise the
            product family; we help you confirm whether your substrate earns that upgrade—or whether prep money is better
            spent first.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>Sheen, interior or exterior, and “will it look like the chip?”</h2>
          <p className="mb-5">
            Sheen changes perceived depth: matt hides uneven plaster but marks faster; soft sheen or satin balances
            wipeability with a gentle glow. Filters reflect how we think on site, not how a brochure sorts SKUs. Combine
            them with the{' '}
            <Link href="/colour-visualiser" className={linkClass}>
              colour visualiser
            </Link>{' '}
            when you are still debating hue, then return here to anchor the technical line that supports that hue.
          </p>
          <p className="mb-5">
            Exterior grades face rain, dust, and heat cycling—using an interior bucket outside is a common false economy.
            If you are unsure, note both the product name and a photo of the wall in your{' '}
            <Link href="/enquiry" className={linkClass}>
              enquiry
            </Link>
            ; we would rather correct course early than strip failed film later.
          </p>

          <h2 className={`${h2Article} mt-0 pt-0 mb-5`}>From shortlist to crew on site</h2>
          <p className="mb-5">
            Once filters narrow your options, the fastest path is: shortlist → rough budget tool → message with areas and
            photos → survey → written quote. Our{' '}
            <Link href="/painting-services" className={linkClass}>
              painting services
            </Link>{' '}
            overview explains how residential and commercial flows differ;{' '}
            <Link href="/contact" className={linkClass}>
              contact
            </Link>{' '}
            stays open for unstructured questions. For warranty, crew norms, and brand policy-style questions that apply
            across jobs, skim the{' '}
            <Link href="/faq" className={linkClass}>
              FAQ
            </Link>{' '}
            as well—it complements this catalog rather than repeating it.
          </p>
          <p className="mb-5">
            Wood-heavy scopes sometimes run beside wall paint. If trims, doors, or wardrobes factor in, glance at{' '}
            <Link href="/services/wood/wood-polishing" className={linkClass}>
              wood polishing
            </Link>{' '}
            and the{' '}
            <Link href="/calculator/wood-polishing" className={linkClass}>
              wood polishing calculator
            </Link>{' '}
            so sequencing and odour windows line up with your wall programme.
          </p>
        </article>
      </section>

      <section className="w-[90%] lg:w-[80%] max-w-3xl mx-auto pb-12 md:pb-14 text-center">
        <h2 className="text-2xl font-bold text-[#299dd7] mb-3 scroll-mt-24">Frequently asked questions</h2>
        <p className="text-[rgba(64,80,94,1)] mb-6 mx-auto max-w-2xl text-base md:text-lg font-light">
          Buying, pricing, filters, and how this catalog connects to quotes and colour tools.
        </p>
        <Accordion type="single" collapsible className="w-full space-y-3 text-left">
          {productsPageFaq.map((item, index) => (
            <AccordionItem
              key={`products-faq-${index}`}
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#ED276E] to-[#299dd7] w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white text-[40px] font-medium mb-6">Ready to Transform Your Space?</h2>
          <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation and quote. Let's bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton to="/contact" className="bg-transparent border-2 border-white text-white hover:bg-[#0FA0CE] hover:border-[#0FA0CE] text-xl px-8 py-4">
              Get a Free Quote
            </CTAButton>
            <Link href="/paint-budget-calculator" className="bg-transparent border-2 border-white text-white hover:bg-[#0FA0CE] hover:border-[#0FA0CE] text-xl px-8 py-4 rounded-[39px]">
              Try Our Budget Calculator
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Action Buttons */}
              <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-50">
        {/* Filter Button - Full Width Above */}
        <button
          onClick={() => setShowFilterModal(true)}
          className="w-full bg-gray-600 text-white py-3 px-4 rounded-full font-medium text-center hover:bg-gray-700 transition flex items-center justify-center text-[15px] mb-3"
        >
          Filters
        </button>
        
        {/* Two Fixed Buttons Below */}
        <div className="flex gap-3">
          <Link href="/enquiry" className="flex-1 bg-[#ED276E] text-white py-4 px-4 rounded-lg font-medium text-center hover:bg-[#b81d5a] transition flex items-center justify-center text-[15px]">
            Enquire Now
          </Link>
          <Link href="/paint-budget-calculator" className="flex-1 bg-[#299dd7] text-white py-4 px-4 rounded-lg font-medium text-center hover:bg-[#237bb0] transition flex items-center justify-center text-[15px]">
            Budget Calculator
          </Link>
        </div>
      </div>

      {/* Filter Modal for Mobile/Tablet */}
      {showFilterModal && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full max-h-[85vh] rounded-t-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
              <h2 className="text-xl font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">×</span>
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              <ProductFilters
                filters={filters}
                filterOptions={{ ...filterOptions, brands }}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                showHeader={false}
                sticky={false}
              />
            </div>
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-full bg-[#299dd7] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#237bb0] transition"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
        <CallButton />
        <div className="[&_.whatsapp-button]:bottom-24 md:[&_.whatsapp-button]:bottom-8">
          <WhatsAppButton />
        </div>
      </div>
    </>
  );
};

export default Products; 
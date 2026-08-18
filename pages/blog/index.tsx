import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';
import WhatsAppButton from '@/components/home/WhatsAppButton';
import BlogHero from '@/components/blog/BlogHero';
import FeaturedPost from '@/components/blog/FeaturedPost';
import BlogList from '@/components/blog/BlogList';
import CTAButton from '@/components/home/CTAButton';
import { getOgImageUrl } from '@/lib/mediaUrl';
import {
  BLOG_LIST_PAGE_SIZE,
  getBlogCategories,
  getBlogListPage,
  getFeaturedBlogPost,
  type BlogListItem,
} from '@/lib/blog/list';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://homeglazer.com';

interface BlogProps {
  featuredPost: BlogListItem | null;
  regularPosts: BlogListItem[];
  totalRegularPosts: number;
  categories: string[];
  error?: string;
}

const Blog: React.FC<BlogProps> = ({
  featuredPost,
  regularPosts,
  totalRegularPosts,
  categories,
  error,
}) => {

  return (
    <>
      <Head>
        <title>Blog | HomeGlazer - Painting Tips & Inspiration</title>
        <meta name="description" content="Read our latest articles on painting tips, color trends, home decor ideas, and expert advice for your painting projects. Get inspired with HomeGlazer." />
        <meta name="keywords" content="painting blog, home painting tips, color trends, wall paint ideas, interior design blog" />
        <meta property="og:title" content="Blog | HomeGlazer - Painting Tips & Inspiration" />
        <meta property="og:description" content="Read our latest articles on painting tips, color trends, and expert advice." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={getOgImageUrl("/uploads/design-insight-thumb.png", SITE_URL)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Blog | HomeGlazer - Painting Tips & Inspiration" />
        <meta name="twitter:description" content="Painting tips, color trends, and expert advice." />
        <meta name="twitter:image" content={getOgImageUrl("/uploads/design-insight-thumb.png", SITE_URL)} />
      </Head>
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
              <BreadcrumbLink href="/blog">Blog</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <BlogHero />
      {error && (
        <div className="w-full py-8">
          <div className="container mx-auto px-4 lg:px-8 2xl:w-[1400px]">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium mb-2">
                {error}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-yellow-700 text-sm mt-2">
                  Check console logs for detailed error information. Visit /api/test-db-connection for diagnostics.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      {featuredPost && <FeaturedPost post={featuredPost} />}
      <BlogList
        initialPosts={regularPosts}
        totalCount={totalRegularPosts}
        categories={categories}
        excludeFeaturedId={featuredPost?.id}
      />
      
      {/* CTA Section with pink background and white text/buttons */}
      <section className="py-16 bg-gradient-to-br from-[#ED276E] to-[#299dd7] w-full">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-white text-[40px] font-medium mb-6">Have Questions About Your Project?</h2>
          <p className="text-white text-xl mb-8 max-w-2xl mx-auto">
            Our team is ready to help you with expert advice and tips for your next painting project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton to="/contact" className="bg-transparent border-2 border-white text-white hover:bg-[#0FA0CE] hover:border-[#0FA0CE] text-xl px-8 py-4">
              Contact Us
            </CTAButton>
            <CTAButton to="/services/painting" className="bg-transparent border-2 border-white text-white hover:bg-[#0FA0CE] hover:border-[#0FA0CE] text-xl px-8 py-4">
              Explore Our Services
            </CTAButton>
          </div>
        </div>
      </section>
      
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
      
      <Footer />
        <WhatsAppButton />
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  try {
    if (!process.env.DATABASE_URL) {
      console.error('[Blog] DATABASE_URL environment variable is not set');
      return {
        props: {
          featuredPost: null,
          regularPosts: [],
          totalRegularPosts: 0,
          categories: [],
          error: 'Database configuration error. Please contact support.',
        },
        revalidate: 60,
      };
    }

    const featuredPost = await getFeaturedBlogPost();
    const [listPage, categories] = await Promise.all([
      getBlogListPage({
        page: 1,
        limit: BLOG_LIST_PAGE_SIZE,
        excludeId: featuredPost?.id,
      }),
      getBlogCategories(),
    ]);

    console.log(
      `[Blog] Loaded featured post and ${listPage.posts.length}/${listPage.total} list posts`
    );

    return {
      props: {
        featuredPost,
        regularPosts: listPage.posts,
        totalRegularPosts: listPage.total,
        categories,
      },
      revalidate: 10,
    };
  } catch (error: any) {
    const errorDetails = {
      message: error?.message || 'Unknown error',
      code: error?.code,
      name: error?.name,
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set',
    };

    console.error('[Blog] Error fetching blog posts:', errorDetails);

    let errorMessage = 'Unable to load blog posts. Please try again later.';

    if (error?.code === 'P1001' || error?.message?.includes('Can\'t reach database server') || error?.message?.includes('ENOTFOUND')) {
      errorMessage = 'Database connection failed. Please check MongoDB Atlas network access allows Amplify IPs.';
    } else if (error?.code === 'P1002' || error?.message?.includes('Connection timeout') || error?.message?.includes('ETIMEDOUT')) {
      errorMessage = 'Database connection timeout. Please check MongoDB Atlas network access.';
    } else if (error?.code === 'P1000' || error?.message?.includes('Authentication failed')) {
      errorMessage = 'Database authentication failed. Please check DATABASE_URL credentials.';
    } else if (error?.message?.includes('DATABASE_URL')) {
      errorMessage = 'Database configuration error. Please contact support.';
    } else if (error?.message?.includes('MongoNetworkError') || error?.message?.includes('MongoServerSelectionError')) {
      errorMessage = 'Cannot connect to MongoDB. Please check MongoDB Atlas network access allows Amplify IPs (0.0.0.0/0).';
    }

    return {
      props: {
        featuredPost: null,
        regularPosts: [],
        totalRegularPosts: 0,
        categories: [],
        error: errorMessage,
      },
      revalidate: 60,
    };
  }
};

export default Blog;

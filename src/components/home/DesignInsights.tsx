import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { SECTION_CTA_CLASSES } from './CTAButton';
import { blogPosts as fallbackPosts } from '@/data/blogPosts';
import { getMediaUrl } from '@/lib/mediaUrl';
import { ArrowRight } from 'lucide-react';

interface BlogPostItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date?: string;
  publishedAt?: string;
  createdAt?: string;
  author: string;
  readTime: string;
  coverImage: string;
}

const DesignInsights: React.FC = () => {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const response = await fetch('/api/blogs?published=true&limit=3');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const formatted: BlogPostItem[] = data.map((b: any) => ({
              id: b.id || b._id,
              slug: b.slug,
              title: b.title,
              excerpt: b.excerpt,
              author: b.author || 'HomeGlazer Team',
              readTime: b.readTime ? `${b.readTime} min read` : '5 min read',
              coverImage: b.coverImage || '/uploads/hero-banner.webp',
              date: b.publishedAt || b.createdAt
                ? new Date(b.publishedAt || b.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'Recent',
            }));
            setPosts(formatted.slice(0, 3));
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch latest blogs from MongoDB:', err);
      }

      // Fallback if DB fetch fails or returns empty
      const fallbackFormatted: BlogPostItem[] = fallbackPosts.slice(0, 3).map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        author: p.author,
        readTime: `${p.readTime} min read`,
        coverImage: p.coverImage,
        date: p.date,
      }));
      setPosts(fallbackFormatted);
      setLoading(false);
    };

    fetchLatestBlogs();
  }, []);

  return (
    <section className="w-full mx-auto flex flex-col items-center mt-[50px] py-10 max-md:mt-10">
      <div className="w-[95%] lg:w-[90%] 2xl:w-[1400px] mx-auto text-center">
        <h2 className="text-[40px] font-medium leading-[150%] mb-3">
          Painting Blogs
        </h2>
        <p className="text-[rgba(64,80,94,1)] text-xl font-light mb-12">
          Latest Insights, Expert Tips & Trends for Your Home
        </p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-[380px] rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group block h-full">
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-1">
                  <div className="h-52 overflow-hidden relative bg-gray-100">
                    <img
                      src={getMediaUrl(post.coverImage)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex items-center text-xs font-semibold text-[#ED276E] mb-3">
                        <span>{post.date}</span>
                        <span className="mx-2">•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-[#299dd7] transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500 font-medium">By {post.author}</span>
                      <span className="inline-flex items-center text-xs font-bold text-[#ED276E] group-hover:text-[#299dd7] transition-colors">
                        Read Article <ArrowRight className="ml-1 h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Link href="/blog" className={SECTION_CTA_CLASSES}>
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DesignInsights;

import React, { useCallback, useEffect, useState } from 'react';
import BlogCard, { BlogPost } from './BlogCard';
import { BLOG_LIST_PAGE_SIZE } from '@/lib/blog/list';

interface BlogListProps {
  initialPosts: BlogPost[];
  totalCount: number;
  categories: string[];
  excludeFeaturedId?: string;
  featured?: boolean;
}

interface BlogListApiResponse {
  posts: BlogPost[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

const BlogList: React.FC<BlogListProps> = ({
  initialPosts,
  totalCount,
  categories,
  excludeFeaturedId,
  featured = false,
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(totalCount);
  const [hasMore, setHasMore] = useState(initialPosts.length < totalCount);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const categoryOptions = ['All', ...categories];

  const fetchPage = useCallback(
    async (nextPage: number, category: string, append: boolean) => {
      const params = new URLSearchParams({
        page: String(nextPage),
        limit: String(BLOG_LIST_PAGE_SIZE),
      });

      if (excludeFeaturedId) {
        params.set('excludeId', excludeFeaturedId);
      }

      if (category !== 'All') {
        params.set('category', category);
      }

      const response = await fetch(`/api/blog/list?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to load blog posts');
      }

      const data: BlogListApiResponse = await response.json();

      setPosts((current) => (append ? [...current, ...data.posts] : data.posts));
      setPage(data.page);
      setTotal(data.total);
      setHasMore(data.hasMore);
    },
    [excludeFeaturedId]
  );

  useEffect(() => {
    setPosts(initialPosts);
    setPage(1);
    setTotal(totalCount);
    setHasMore(initialPosts.length < totalCount);
    setLoadError(null);
  }, [initialPosts, totalCount]);

  const handleCategoryChange = async (category: string) => {
    if (category === activeCategory || loading) return;

    setActiveCategory(category);
    setLoading(true);
    setLoadError(null);

    try {
      await fetchPage(1, category, false);
    } catch {
      setLoadError('Unable to load posts for this category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setLoadError(null);

    try {
      await fetchPage(page + 1, activeCategory, true);
    } catch {
      setLoadError('Unable to load more posts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4 lg:px-8 2xl:w-[1400px]">
        {!featured && (
          <div className="mb-10 overflow-x-auto">
            <div className="flex min-w-max space-x-2 pb-3">
              {categoryOptions.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  disabled={loading && category !== activeCategory}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === category
                      ? 'bg-[#ED276E] text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } ${loading ? 'opacity-70' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>

        {loadError && (
          <p className="mt-8 text-center text-red-600">{loadError}</p>
        )}

        {!featured && hasMore && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-[#ED276E] text-white rounded-full px-8 py-3 font-medium hover:bg-[#299dd7] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <h3 className="text-2xl font-medium mb-2">No posts found</h3>
            <p className="text-gray-600">
              {activeCategory === 'All'
                ? 'No blog posts are available yet.'
                : 'No blog posts match your selected category.'}
            </p>
          </div>
        )}

        {!featured && posts.length > 0 && !hasMore && total > BLOG_LIST_PAGE_SIZE && (
          <p className="mt-8 text-center text-gray-500 text-sm">
            Showing all {total} articles
          </p>
        )}
      </div>
    </section>
  );
};

export default BlogList;

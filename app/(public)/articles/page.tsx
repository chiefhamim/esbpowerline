import { Suspense } from 'react';
import Link from 'next/link';
import { ArticleCard } from '@/components/news/ArticleCard';
import { getPublishedArticles, getArticlesByCategory, getTrendingArticles } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';
import { SortSelect } from '@/components/news/SortSelect';

export const metadata = {
  title: 'Latest News | ESB PowerLine',
  description: 'Latest power & energy sector news from Bangladesh. Filter by category, search, and read in-depth analysis.',
  openGraph: {
    title: 'Latest News | ESB PowerLine',
    description: 'Bangladesh power sector updates, renewable energy, policy, projects and tenders.',
  },
};

interface ArticlesPageProps {
  searchParams: Promise<{ category?: string; sort?: string; page?: string }>;
}

export default async function ArticlesPage({ searchParams }: ArticlesPageProps) {
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams.category;
  const sort = resolvedParams.sort || 'latest';
  const currentPage = parseInt(resolvedParams.page || '1', 10);

  let articles = getPublishedArticles();

  if (categoryParam) {
    articles = getArticlesByCategory(categoryParam.replace(/-/g, ' '));
  }

  // Sort
  if (sort === 'views') {
    articles = [...articles].sort((a, b) => b.views - a.views);
  } else {
    // latest by date
    articles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  const perPage = 6;
  const totalPages = Math.ceil(articles.length / perPage);
  const paginatedArticles = articles.slice(0, currentPage * perPage); // "infinite" style - cumulative

  const trending = getTrendingArticles(4);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Latest News</h1>
          <p className="text-muted-foreground mt-2">Power &amp; energy sector coverage for Bangladesh</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 text-sm">
          <Link href="/search" className="btn btn-secondary px-4 py-2">Advanced Search</Link>
          <SortSelect currentSort={sort} />
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link 
          href={sort === 'views' ? '/articles?sort=views' : '/articles'} 
          className={`category-pill ${!categoryParam ? 'active' : ''}`}
        >
          All
        </Link>
        {CATEGORIES.map(cat => {
          const slug = cat.toLowerCase().replace(/\s+/g, '-');
          const isActive = categoryParam === slug;
          const href = sort === 'views' 
            ? `/articles?category=${slug}&sort=views` 
            : `/articles?category=${slug}`;
          return (
            <Link 
              key={cat} 
              href={href}
              className={`category-pill ${isActive ? 'active' : ''}`}
            >
              {cat}
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main listing */}
        <div className="lg:col-span-2">
          {paginatedArticles.length === 0 ? (
            <p className="text-muted-foreground">No articles found for this filter.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6" id="articles-grid">
              {paginatedArticles.map(article => (
                <ArticleCard 
                  key={article.id}
                  id={article.slug}
                  title={article.title}
                  excerpt={article.excerpt}
                  category={article.category}
                  imageUrl={article.imageUrl}
                  author={article.author}
                  date={article.date}
                  readTime={article.readTime}
                  views={article.views}
                />
              ))}
            </div>
          )}

          {/* Load more / Infinite scroll simulation */}
          {currentPage < totalPages && (
            <div className="mt-8 text-center">
              <Link 
                href={`/articles?${new URLSearchParams({ 
                  ...(categoryParam && { category: categoryParam }), 
                  ...(sort !== 'latest' && { sort }), 
                  page: String(currentPage + 1) 
                })}`}
                className="btn btn-primary px-8"
                scroll={false}
              >
                Load more articles
              </Link>
            </div>
          )}

          {currentPage >= totalPages && paginatedArticles.length > 0 && (
            <p className="text-center text-sm text-muted-foreground mt-8">You&apos;ve reached the end.</p>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:pl-6">
          <div className="sticky top-20">
            <h3 className="font-semibold mb-4 text-lg">Trending</h3>
            <div className="space-y-4">
              {trending.map((a, i) => (
                <Link key={i} href={`/articles/${a.slug}`} className="block group">
                  <div className="text-sm font-medium group-hover:text-primary line-clamp-2">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{a.category} · {a.views.toLocaleString()} views</div>
                </Link>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg border border-border bg-muted/50 text-sm">
              <div className="font-medium mb-1">Pro tip</div>
              <p className="text-muted-foreground">Use the category pills above or visit individual category pages for focused reading.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

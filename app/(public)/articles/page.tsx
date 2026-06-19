import Link from 'next/link';
import { ArticleCard } from '@/components/news/ArticleCard';
import { getPublicCategories, getPublishedArticlesForPublic, getTrendingPublishedArticles } from '@/lib/category-content';
import { localizeCategoryFields, localizeCategoryName } from '@/lib/i18n/categories';
import { createTranslator } from '@/lib/i18n/messages';
import { getServerSiteLocale } from '@/lib/locale-server';
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
  const locale = await getServerSiteLocale();
  const t = createTranslator(locale);
  const resolvedParams = await searchParams;
  const categoryParam = resolvedParams.category;
  const sort = resolvedParams.sort || 'latest';
  const currentPage = parseInt(resolvedParams.page || '1', 10);

  const [categories, allArticles, trending] = await Promise.all([
    getPublicCategories(),
    getPublishedArticlesForPublic(120),
    getTrendingPublishedArticles(4),
  ]);

  let articles = allArticles;

  if (categoryParam) {
    const match = categories.find((c) => c.slug === categoryParam);
    if (match) {
      articles = articles.filter((a) => a.category === match.name);
    }
  }

  if (sort === 'views') {
    articles = [...articles].sort((a, b) => b.views - a.views);
  } else {
    articles = [...articles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  const perPage = 6;
  const totalPages = Math.ceil(articles.length / perPage);
  const paginatedArticles = articles.slice(0, currentPage * perPage);

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold tracking-tight">{t('articles.title')}</h1>
          <p className="text-muted-foreground mt-2">{t('articles.subtitle')}</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3 text-sm">
          <Link href="/search" className="btn btn-secondary px-4 py-2">
            {t('articles.advancedSearch')}
          </Link>
          <SortSelect currentSort={sort} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href={sort === 'views' ? '/articles?sort=views' : '/articles'}
          className={`category-pill ${!categoryParam ? 'active' : ''}`}
        >
          {t('articles.allCategories')}
        </Link>
        {categories.map((cat) => {
          const isActive = categoryParam === cat.slug;
          const href = sort === 'views'
            ? `/articles?category=${cat.slug}&sort=views`
            : `/articles?category=${cat.slug}`;
          const localized = localizeCategoryFields(locale, cat);
          return (
            <Link
              key={cat.id}
              href={href}
              className={`category-pill ${isActive ? 'active' : ''}`}
            >
              {localized.name}
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {paginatedArticles.length === 0 ? (
            <p className="text-muted-foreground">{t('coverage.noArticles')}</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6" id="articles-grid">
              {paginatedArticles.map((article) => (
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

          {currentPage < totalPages && (
            <div className="mt-8 text-center">
              <Link
                href={`/articles?${new URLSearchParams({
                  ...(categoryParam && { category: categoryParam }),
                  ...(sort !== 'latest' && { sort }),
                  page: String(currentPage + 1),
                })}`}
                className="btn btn-primary px-8"
                scroll={false}
              >
                {t('articles.loadMore')}
              </Link>
            </div>
          )}
        </div>

        <div className="lg:pl-6">
          <div className="sticky top-20">
            <h3 className="font-semibold mb-4 text-lg">{t('articles.trending')}</h3>
            <div className="space-y-4">
              {trending.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('coverage.noArticles')}</p>
              ) : (
                trending.map((a) => (
                  <Link key={a.slug} href={`/articles/${a.slug}`} className="block group">
                    <div className="text-sm font-medium group-hover:text-primary line-clamp-2">{a.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {localizeCategoryName(locale, a.category)} · {a.views.toLocaleString()} views
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
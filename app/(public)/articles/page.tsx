import Link from 'next/link';
import { Search } from 'lucide-react';
import { ArticleCard } from '@/components/news/ArticleCard';
import { HomeTrendingSection } from '@/components/home/HomeTrendingSection';
import { getPublicCategories, getPublishedArticlesForPublic, getTrendingPublishedArticles } from '@/lib/category-content';
import { localizeCategoryFields } from '@/lib/i18n/categories';
import { createTranslator } from '@/lib/i18n/messages';
import { getServerSiteLocale } from '@/lib/locale-server';
import { SortSelect } from '@/components/news/SortSelect';

export const revalidate = 60;

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
    getPublishedArticlesForPublic(120, locale),
    getTrendingPublishedArticles(5, locale),
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

  const perPage = 9;
  const totalPages = Math.ceil(articles.length / perPage);
  const paginatedArticles = articles.slice(0, currentPage * perPage);

  return (
    <div className="container container--shell articles-page py-8 md:py-10">
      <header className="articles-page__header flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <div className="articles-page__kicker section-kicker text-rose-600/80 dark:text-rose-400/90 mb-1.5">
            {t('articles.kicker')}
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">{t('articles.title')}</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base">{t('articles.subtitle')}</p>
        </div>
        <div className="articles-page__toolbar shrink-0">
          <Link href="/search" className="articles-page__toolbar-btn">
            <Search className="articles-page__toolbar-icon" strokeWidth={2} aria-hidden />
            <span>{t('articles.advancedSearch')}</span>
          </Link>
          <SortSelect currentSort={sort} />
        </div>
      </header>

      <div className="articles-page__filters mb-6 md:mb-8">
        <Link
          href={sort === 'views' ? '/articles?sort=views' : '/articles'}
          className={`category-pill ${!categoryParam ? 'active' : ''}`}
        >
          {t('common.all')}
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

      <div className="articles-editorial__grid">
        <div className="articles-editorial__main min-w-0">
          {paginatedArticles.length === 0 ? (
            <p className="text-muted-foreground py-12 text-center">{t('coverage.noArticles')}</p>
          ) : (
            <div className="articles-grid" id="articles-grid">
              {paginatedArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.slug}
                  title={article.title}
                  shortTitle={article.shortTitle}
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

        <aside className="articles-editorial__rail" aria-label={t('articles.trending')}>
          <HomeTrendingSection trending={trending} layout="rail" />
        </aside>
      </div>
    </div>
  );
}
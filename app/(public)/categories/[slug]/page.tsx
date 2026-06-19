import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArticleCard } from '@/components/news/ArticleCard';
import { getCategoryBySlug, getPublishedArticlesByCategory } from '@/lib/category-content';
import { localizeCategoryFields } from '@/lib/i18n/categories';
import { createTranslator } from '@/lib/i18n/messages';
import { getServerSiteLocale } from '@/lib/locale-server';
import { categoryIconWrapStyle, categoryTextStyle } from '@/lib/category-icons';
import { CategoryIconDisplay } from '@/components/category/CategoryIconDisplay';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const locale = await getServerSiteLocale();
  const category = await getCategoryBySlug(slug);
  const localized = category
    ? localizeCategoryFields(locale, category)
    : { name: slug, description: null };
  return {
    title: `${localized.name} | ESB PowerLine`,
    description:
      localized.description ??
      `Latest news and analysis in ${localized.name} for Bangladesh's power and energy sector.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const locale = await getServerSiteLocale();
  const t = createTranslator(locale);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const localized = localizeCategoryFields(locale, category);
  const articles = await getPublishedArticlesByCategory(category.name);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/categories" className="inline-flex items-center text-sm text-primary">
          {t('categories.allCategories')}
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <div
            className="p-2 rounded bg-muted text-primary"
            style={categoryIconWrapStyle(category.color) ?? (category.color ? { color: category.color } : undefined)}
          >
            <CategoryIconDisplay
              icon={category.icon}
              iconImageUrl={category.iconImageUrl}
              name={localized.name}
              size={20}
              className="h-5 w-5"
              style={categoryTextStyle(category.color)}
            />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight">{localized.name}</h1>
        </div>
        <p className="text-muted-foreground mt-1.5">
          {localized.description ?? t('categories.latestAnalysis')}
        </p>
      </div>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">{t('categories.noPublished')}</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
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
    </div>
  );
}
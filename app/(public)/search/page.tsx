import { SearchResults } from '@/components/news/SearchResults';
import { getPublishedArticlesForPublic } from '@/lib/category-content';
import { createTranslator } from '@/lib/i18n/messages';
import { getServerSiteLocale } from '@/lib/locale-server';

export const metadata = {
  title: 'Search | ESB PowerLine',
  description: 'Search published power sector news and analysis.',
};

export default async function SearchPage() {
  const locale = await getServerSiteLocale();
  const t = createTranslator(locale);
  const articles = await getPublishedArticlesForPublic(120);

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-display font-bold tracking-tight">{t('search.title')}</h1>
      <p className="text-muted-foreground mb-6">{t('search.subtitle')}</p>
      <SearchResults articles={articles} />
    </div>
  );
}
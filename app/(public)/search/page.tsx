import { SearchResults } from '@/components/news/SearchResults';
import { getPublishedArticlesForPublic } from '@/lib/category-content';

export const metadata = {
  title: 'Search | ESB PowerLine',
  description: 'Search published power sector news and analysis.',
};

export default async function SearchPage() {
  const articles = await getPublishedArticlesForPublic(120);

  return (
    <div className="container py-10">
      <h1 className="text-4xl font-display font-bold tracking-tight">Search</h1>
      <p className="text-muted-foreground mb-6">Search titles, excerpts, and categories from live published content.</p>
      <SearchResults articles={articles} />
    </div>
  );
}
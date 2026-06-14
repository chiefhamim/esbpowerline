import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Zap, Sun, Flame, Atom, Cable, Scale, Home, Gauge, Globe, TrendingUp } from 'lucide-react';
import { ArticleCard } from '@/components/news/ArticleCard';
import { getArticlesByCategory } from '@/lib/data';
import { CATEGORIES } from '@/lib/constants';

const ICONS: Record<string, React.ComponentType<any>> = {
  'Power Generation': Zap, 'Renewable Energy': Sun, 'LNG & Gas': Flame,
  'Nuclear Energy': Atom, 'Grid & Transmission': Cable, 'Energy Policy': Scale,
  'Rural Electrification': Home, 'Energy Efficiency': Gauge, 'International': Globe, 'Market & Finance': TrendingUp,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const categoryName = CATEGORIES.find(c => c.toLowerCase().replace(/\s+/g, '-') === slug) || slug;
  return {
    title: `${categoryName} | ESB PowerLine`,
    description: `Latest news and analysis in ${categoryName} for Bangladesh's power and energy sector.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const categoryName = CATEGORIES.find(c => c.toLowerCase().replace(/\s+/g, '-') === slug);
  if (!categoryName) notFound();

  const articles = getArticlesByCategory(categoryName);
  const Icon = ICONS[categoryName] || Zap;

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/categories" className="inline-flex items-center text-sm text-primary">← All categories</Link>
        <div className="flex items-center gap-3 mt-3">
          <div className="p-2 rounded bg-muted text-primary"><Icon className="h-5 w-5" /></div>
          <h1 className="text-4xl font-display font-bold tracking-tight">{categoryName}</h1>
        </div>
        <p className="text-muted-foreground mt-1.5">Latest analysis, projects and policy updates for this sector.</p>
      </div>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">No articles in this category yet. Check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
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

      <div className="mt-12">
        <Link href="/articles" className="text-primary">Browse all news →</Link>
      </div>
    </div>
  );
}

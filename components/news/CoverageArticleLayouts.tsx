import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { ArrowRight } from 'lucide-react';
import type { PublicArticleCard } from '@/lib/category-types';
import type { CoverageLayoutId } from '@/lib/coverage-types';
import { ArticleCard } from './ArticleCard';

type ArticleProps = {
  article: PublicArticleCard;
  layout: CoverageLayoutId;
};

function MetaRow({ article }: { article: PublicArticleCard }) {
  const timeAgo = formatDistanceToNow(new Date(article.date), { addSuffix: true });
  return (
    <div className="mt-3 flex items-center justify-between gap-2 text-[11px] text-muted-foreground">
      <span className="font-medium truncate">{article.author}</span>
      <span className="shrink-0">
        {timeAgo}
        {article.readTime ? ` · ${article.readTime} min` : ''}
      </span>
    </div>
  );
}

function CategoryPill({ category }: { category: string }) {
  return (
    <span className="category-pill text-[10px] font-medium tracking-wide">{category}</span>
  );
}

function HeroLayout({ article }: { article: PublicArticleCard }) {
  return (
    <Link href={`/articles/${article.slug}`} className="coverage-card coverage-card--hero group block h-full">
      <div className="relative overflow-hidden rounded-t-2xl">
        <img src={article.imageUrl ?? ''} alt={article.title} className="coverage-card__hero-image" />
        <span className="absolute top-4 left-4">
          <CategoryPill category={article.category} />
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="font-display text-xl font-semibold leading-tight tracking-tight line-clamp-3 group-hover:text-primary transition-colors sm:text-2xl">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-4">{article.excerpt}</p>
        )}
        <MetaRow article={article} />
      </div>
    </Link>
  );
}

function HorizontalLayout({ article }: { article: PublicArticleCard }) {
  return (
    <Link href={`/articles/${article.slug}`} className="coverage-card coverage-card--horizontal group flex h-full gap-4 p-4">
      <img src={article.imageUrl ?? ''} alt={article.title} className="coverage-card__thumb rounded-xl object-cover" />
      <div className="min-w-0 flex flex-1 flex-col justify-center">
        <CategoryPill category={article.category} />
        <h3 className="mt-2 font-semibold leading-snug line-clamp-3 group-hover:text-primary transition-colors">{article.title}</h3>
        {article.excerpt && <p className="mt-2 text-[13px] text-muted-foreground line-clamp-2">{article.excerpt}</p>}
        <MetaRow article={article} />
      </div>
    </Link>
  );
}

function CompactLayout({ article }: { article: PublicArticleCard }) {
  return (
    <Link href={`/articles/${article.slug}`} className="coverage-card coverage-card--compact group block h-full p-4">
      <img src={article.imageUrl ?? ''} alt={article.title} className="coverage-card__compact-image rounded-xl object-cover" />
      <h3 className="mt-3 text-sm font-semibold leading-snug line-clamp-3 group-hover:text-primary transition-colors">{article.title}</h3>
      <MetaRow article={article} />
    </Link>
  );
}

function OverlayLayout({ article }: { article: PublicArticleCard }) {
  return (
    <Link href={`/articles/${article.slug}`} className="coverage-card coverage-card--overlay group relative block h-full min-h-[220px] overflow-hidden rounded-2xl">
      <img src={article.imageUrl ?? ''} alt={article.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      <div className="relative flex h-full flex-col justify-end p-4">
        <CategoryPill category={article.category} />
        <h3 className="mt-2 font-semibold leading-snug line-clamp-3 group-hover:text-primary transition-colors">{article.title}</h3>
        <MetaRow article={article} />
      </div>
    </Link>
  );
}

function HeadlineLayout({ article }: { article: PublicArticleCard }) {
  return (
    <Link href={`/articles/${article.slug}`} className="coverage-card coverage-card--headline group flex h-full gap-3 p-4">
      <div className="min-w-0 flex-1">
        <CategoryPill category={article.category} />
        <h3 className="mt-2 text-sm font-semibold leading-snug line-clamp-4 group-hover:text-primary transition-colors">{article.title}</h3>
        <MetaRow article={article} />
      </div>
      <img src={article.imageUrl ?? ''} alt={article.title} className="coverage-card__headline-thumb rounded-lg object-cover" />
    </Link>
  );
}

function SplitLayout({ article }: { article: PublicArticleCard }) {
  return (
    <Link href={`/articles/${article.slug}`} className="coverage-card coverage-card--split group grid h-full gap-0 overflow-hidden sm:grid-cols-2">
      <img src={article.imageUrl ?? ''} alt={article.title} className="h-full min-h-[180px] w-full object-cover" />
      <div className="flex flex-col justify-center p-5">
        <CategoryPill category={article.category} />
        <h3 className="mt-2 font-display text-lg font-semibold leading-tight line-clamp-3 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
        {article.excerpt && <p className="mt-2 text-[13px] text-muted-foreground line-clamp-3">{article.excerpt}</p>}
        <MetaRow article={article} />
      </div>
    </Link>
  );
}

function EditorialLayout({ article }: { article: PublicArticleCard }) {
  return (
    <Link href={`/articles/${article.slug}`} className="coverage-card coverage-card--editorial group flex h-full gap-3 border-l-4 border-primary p-4 pl-5">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary/80">{article.category}</p>
        <h3 className="mt-2 font-semibold leading-snug line-clamp-4 group-hover:text-primary transition-colors">{article.title}</h3>
        {article.excerpt && <p className="mt-2 text-[13px] italic leading-relaxed text-muted-foreground line-clamp-3">{article.excerpt}</p>}
        <MetaRow article={article} />
      </div>
    </Link>
  );
}

function BannerLayout({ article }: { article: PublicArticleCard }) {
  return (
    <Link href={`/articles/${article.slug}`} className="coverage-card coverage-card--banner group relative block h-full min-h-[160px] overflow-hidden rounded-2xl">
      <img src={article.imageUrl ?? ''} alt={article.title} className="absolute inset-0 h-full w-full object-cover opacity-35 transition-opacity group-hover:opacity-45" />
      <div className="relative flex h-full flex-col justify-center bg-background/75 p-4 backdrop-blur-[2px]">
        <CategoryPill category={article.category} />
        <h3 className="mt-2 text-sm font-semibold leading-snug line-clamp-3 group-hover:text-primary transition-colors">{article.title}</h3>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
          Read story <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}

export function CoverageArticle({ article, layout }: ArticleProps) {
  switch (layout) {
    case 'hero':
      return <HeroLayout article={article} />;
    case 'horizontal':
      return <HorizontalLayout article={article} />;
    case 'compact':
      return <CompactLayout article={article} />;
    case 'overlay':
      return <OverlayLayout article={article} />;
    case 'headline':
      return <HeadlineLayout article={article} />;
    case 'split':
      return <SplitLayout article={article} />;
    case 'editorial':
      return <EditorialLayout article={article} />;
    case 'banner':
      return <BannerLayout article={article} />;
    case 'standard':
    default:
      return (
        <ArticleCard
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
      );
  }
}
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatExactDate, formatArticleDate, formatArticleHoverDate } from '@/lib/utils';
import { ModernTooltip } from '@/components/shared/ModernTooltip';
import { ArticlePlacementBadge } from '@/components/shared/ArticlePlacementBadge';
import { CategoryLabel } from '@/components/i18n/CategoryLabel';
import { NoImage } from '@/components/shared/NoImage';
import { hasArticleImage } from '@/lib/article-image';
import { useLocale } from '@/components/shared/LocaleProvider';
import { heroImageStyle } from '@/lib/hero-image';

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt?: string | null;
  category: string;
  imageUrl?: string | null;
  author?: string;
  date?: string | Date;
  views?: number;
  readTime?: number;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isPinned?: boolean;
  heroMeta?: any;
}

export function ArticleCard({
  id,
  title,
  excerpt,
  category,
  imageUrl,
  author,
  date,
  views,
  readTime,
  isFeatured,
  isBreaking,
  isPinned,
  heroMeta,
}: ArticleCardProps) {
  const { locale, t } = useLocale();
  const timeAgo = date ? formatExactDate(date) : '';

  return (
    <Link href={`/articles/${id}`} className="article-card group block">
      <div className="article-card__image-wrapper relative">
        {hasArticleImage(imageUrl) ? (
          <Image
            src={imageUrl}
            alt={title}
            width={500}
            height={192}
            className="article-card__image"
            style={heroImageStyle(heroMeta)}
          />
        ) : (
          <NoImage className="article-card__image h-48 w-full" compact />
        )}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1">
          <CategoryLabel name={category} className="category-pill" />
          {isPinned ? <ArticlePlacementBadge type="pin" compact /> : null}
          {!isPinned && isFeatured ? <ArticlePlacementBadge type="featured" compact /> : null}
          {isBreaking ? <ArticlePlacementBadge type="breaking" compact /> : null}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-semibold tracking-[-0.015em] leading-tight line-clamp-3 group-hover:text-primary transition-colors">{title}</h3>
        {excerpt && <p className="mt-2.5 text-[13px] text-muted-foreground line-clamp-4 leading-snug">{excerpt.replace(/\[&hellip;\]/g, '...').replace(/&hellip;/g, '...')}</p>}
        <div className="mt-4 flex items-center gap-1.5 text-ui-xs text-muted-foreground">
          {date ? (
            <span>
              {formatArticleDate(date).replace('Published on ', '')}
            </span>
          ) : null}
          {date && readTime ? <span className="opacity-45">·</span> : null}
          {readTime ? <span>{readTime} {t('common.min')}</span> : null}
        </div>
      </div>
    </Link>
  );
}

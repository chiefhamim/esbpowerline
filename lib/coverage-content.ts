import 'server-only';

import { cache } from 'react';
import prisma from '@/lib/prisma';
import type { CoverageSlot, ResolvedCoverageSlot } from '@/lib/coverage-types';
import type { PublicArticleCard } from '@/lib/category-types';
import { MAX_PINNED_COVERAGE } from '@/lib/placement-rules';
import { normalizeArticleImageUrl } from '@/lib/article-image';

function mapArticle(a: {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  category: string;
  readTime: number;
  views: number;
  imageUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  isFeatured?: boolean;
  isBreaking?: boolean;
  isPinned?: boolean;
  author?: { name: string } | null;
  seo?: any;
}): PublicArticleCard {
  return {
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    category: a.category,
    author: a.author?.name ?? 'ESB PowerLine',
    date: (a.publishedAt ?? a.createdAt).toISOString(),
    readTime: a.readTime,
    views: a.views,
    imageUrl: normalizeArticleImageUrl(a.imageUrl) ?? '',
    heroMeta: a.seo?.heroImage,
    isFeatured: a.isFeatured,
    isBreaking: a.isBreaking,
    isPinned: a.isPinned,
  };
}

export const getPinnedCoverageArticles = cache(async (): Promise<PublicArticleCard[]> => {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED', isPinned: true },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: MAX_PINNED_COVERAGE,
  });
  return articles.map(mapArticle);
});

export const resolveCoverageSlots = cache(async (slots: CoverageSlot[]): Promise<ResolvedCoverageSlot[]> => {
  const slugs = [...new Set(slots.map((slot) => slot.articleSlug).filter(Boolean))];
  const articles = slugs.length
    ? await prisma.article.findMany({
        where: { status: 'PUBLISHED', slug: { in: slugs } },
        include: { author: { select: { name: true } } },
      })
    : [];

  const bySlug = new Map(articles.map((article) => [article.slug, mapArticle(article)]));

  const fallbackPool = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 12,
  });
  const fallbackArticles = fallbackPool.map(mapArticle);
  let fallbackIndex = 0;
  const usedArticleIds = new Set<string>();

  const takeFallback = (): PublicArticleCard | null => {
    while (fallbackIndex < fallbackArticles.length) {
      const candidate = fallbackArticles[fallbackIndex++];
      if (!usedArticleIds.has(candidate.id)) return candidate;
    }
    return null;
  };

  return slots.map((slot) => {
    let article = slot.articleSlug ? bySlug.get(slot.articleSlug) ?? null : null;
    if (article && usedArticleIds.has(article.id)) {
      article = null;
    }
    if (!article) {
      article = takeFallback();
    }
    if (article) usedArticleIds.add(article.id);
    return { ...slot, article };
  });
});

export async function getPublishedArticlePickerList() {
  const articles = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    select: { slug: true, title: true, category: true, publishedAt: true },
    orderBy: { publishedAt: 'desc' },
    take: 100,
  });
  return articles;
}
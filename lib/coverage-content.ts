import { cache } from 'react';
import prisma from '@/lib/prisma';
import { DEFAULT_COVERAGE_SLOTS } from '@/lib/coverage-defaults';
import type { CoverageSlot, ResolvedCoverageSlot } from '@/lib/coverage-types';
import type { PublicArticleCard } from '@/lib/category-types';

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
  author?: { name: string } | null;
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
    imageUrl: a.imageUrl ?? '/images/download (10).jfif',
  };
}

export function normalizeCoverageSlots(raw: unknown): CoverageSlot[] {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_COVERAGE_SLOTS;

  return raw
    .map((item, index) => {
      const row = item as Partial<CoverageSlot>;
      const fallback = DEFAULT_COVERAGE_SLOTS[index] ?? DEFAULT_COVERAGE_SLOTS[0];
      return {
        id: row.id ?? `slot-${index + 1}`,
        layout: (row.layout as CoverageSlot['layout']) ?? fallback.layout,
        articleSlug: row.articleSlug ?? fallback.articleSlug,
      };
    })
    .slice(0, 9);
}

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

  return slots.map((slot) => {
    let article = bySlug.get(slot.articleSlug) ?? null;
    if (!article && fallbackIndex < fallbackArticles.length) {
      article = fallbackArticles[fallbackIndex++];
    }
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
import { cache } from 'react';
import prisma from '@/lib/prisma';
import { HOMEPAGE_DEFAULTS, type CarouselItem } from '@/lib/homepage-defaults';
import { normalizeCoverageSlots } from '@/lib/coverage-defaults';
import type { CoverageSlot } from '@/lib/coverage-types';
import { MAX_CAROUSEL_ITEMS } from '@/lib/placement-rules';
import { normalizeArticleImageUrl } from '@/lib/article-image';

const PUBLIC_SETTING_KEYS = [
  'homepage', 'ticker', 'snapshot', 'interviews', 'site', 'seo', 'hero', 'coverage',
] as const;

const GRID_SETTING_KEYS = ['gridMix', 'gridLines', 'gridProjects'] as const;

export type { CarouselItem };
export { HOMEPAGE_DEFAULTS };

export const getPublicSettingsMap = cache(async () => {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: [...PUBLIC_SETTING_KEYS] } },
  });
  const map: Record<string, unknown> = {};
  for (const s of settings) map[s.key] = s.value;
  return map;
});

export const getGridSettingsMap = cache(async () => {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: [...GRID_SETTING_KEYS] } },
  });
  const map: Record<string, unknown> = {};
  for (const s of settings) map[s.key] = s.value;
  return map;
});

function mapCarouselArticle(a: {
  slug: string;
  title: string;
  excerpt: string | null;
  imageUrl: string | null;
  readTime: number;
  category: string;
  isBreaking: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  author?: { name: string } | null;
}): CarouselItem {
  return {
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    imageUrl: normalizeArticleImageUrl(a.imageUrl) ?? '',
    author: a.author?.name ?? 'ESB PowerLine',
    readTime: a.readTime ?? 5,
    category: a.category,
    isBreaking: a.isBreaking,
    isFeatured: a.isFeatured,
    isPinned: false,
  };
}

async function fetchManagedCarouselItems(): Promise<CarouselItem[]> {
  const include = { author: { select: { name: true } } } as const;

  const prioritized = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      isPinned: false,
      OR: [{ isFeatured: true }, { isBreaking: true }],
    },
    include,
    orderBy: [{ isBreaking: 'desc' }, { isFeatured: 'desc' }, { publishedAt: 'desc' }],
    take: MAX_CAROUSEL_ITEMS,
  });

  if (prioritized.length >= MAX_CAROUSEL_ITEMS) {
    return prioritized.map(mapCarouselArticle);
  }

  const usedIds = new Set(prioritized.map((a) => a.id));
  const backfill = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      isPinned: false,
      id: { notIn: [...usedIds] },
    },
    include,
    orderBy: { publishedAt: 'desc' },
    take: MAX_CAROUSEL_ITEMS - prioritized.length,
  });

  return [...prioritized, ...backfill].slice(0, MAX_CAROUSEL_ITEMS).map(mapCarouselArticle);
}

export const getCarouselItems = cache(async (_settings: Record<string, unknown>): Promise<CarouselItem[]> => {
  return fetchManagedCarouselItems();
});

/** Coverage slots come from admin settings; pinned stories render in a separate top row. */
export const applyEditorialPlacementToCoverageSlots = cache(
  async (slots: CoverageSlot[]): Promise<CoverageSlot[]> => slots,
);

export function getMarketPulse(settings: Record<string, unknown>) {
  const hp = settings.homepage as { marketPulse?: string } | undefined;
  return hp?.marketPulse?.trim() || HOMEPAGE_DEFAULTS.marketPulse;
}

export function getSnapshotLabel(settings: Record<string, unknown>) {
  const hp = settings.homepage as { snapshotLabel?: string } | undefined;
  return hp?.snapshotLabel?.trim() || HOMEPAGE_DEFAULTS.snapshotLabel;
}

export function getProfessionalsCta(settings: Record<string, unknown>) {
  const hp = settings.homepage as Partial<typeof HOMEPAGE_DEFAULTS.professionalsCta> | undefined;
  return { ...HOMEPAGE_DEFAULTS.professionalsCta, ...hp };
}

export function getCoverageSlotsFromSettings(settings: Record<string, unknown>): CoverageSlot[] {
  return normalizeCoverageSlots(settings.coverage);
}
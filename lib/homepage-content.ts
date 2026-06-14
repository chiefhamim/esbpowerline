import { cache } from 'react';
import prisma from '@/lib/prisma';
import { demoArticles } from '@/lib/data';
import { HOMEPAGE_DEFAULTS, type CarouselItem } from '@/lib/homepage-defaults';

const PUBLIC_SETTING_KEYS = [
  'homepage', 'ticker', 'snapshot', 'interviews', 'site', 'seo', 'hero',
] as const;

const GRID_SETTING_KEYS = ['gridMix', 'gridLines', 'gridProjects'] as const;

export type { CarouselItem };
export { HOMEPAGE_DEFAULTS };

const DEMO_CAROUSEL: CarouselItem[] = demoArticles.slice(0, 5).map((a) => ({
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt,
  imageUrl: a.imageUrl,
  author: a.author,
  readTime: a.readTime,
  category: a.category,
  isBreaking: a.isBreaking,
}));

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

export async function getCarouselItems(settings: Record<string, unknown>): Promise<CarouselItem[]> {
  const homepage = (settings.homepage as { carouselMode?: string } | undefined) ?? {};
  if (homepage.carouselMode !== 'managed') {
    return DEMO_CAROUSEL;
  }

  const pinned = await prisma.article.findMany({
    where: { status: 'PUBLISHED', isPinned: true },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 1,
  });

  const featured = await prisma.article.findMany({
    where: {
      status: 'PUBLISHED',
      isFeatured: true,
      ...(pinned.length ? { id: { not: pinned[0].id } } : {}),
    },
    include: { author: { select: { name: true } } },
    orderBy: { publishedAt: 'desc' },
    take: 5,
  });

  const combined = [...pinned, ...featured];
  if (combined.length === 0) return DEMO_CAROUSEL;

  return combined.slice(0, 5).map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt ?? '',
    imageUrl: a.imageUrl ?? '/images/download (10).jfif',
    author: a.author?.name ?? 'ESB PowerLine',
    readTime: a.readTime ?? 5,
    category: a.category,
    isBreaking: a.isBreaking,
  }));
}

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
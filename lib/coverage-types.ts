import type { PublicArticleCard } from '@/lib/category-types';

/** Nine distinct All Coverage layout variants (6 original + 3 new) */
export const COVERAGE_LAYOUT_IDS = [
  'hero',
  'standard',
  'horizontal',
  'compact',
  'overlay',
  'headline',
  'split',
  'editorial',
  'banner',
] as const;

export type CoverageLayoutId = (typeof COVERAGE_LAYOUT_IDS)[number];

export type CoverageSlot = {
  id: string;
  layout: CoverageLayoutId;
  articleSlug: string;
};

export type ResolvedCoverageSlot = CoverageSlot & {
  article: PublicArticleCard | null;
};

/** Fixed layout per mosaic position (styles are not swappable) */
export const COVERAGE_SLOT_LAYOUTS: CoverageLayoutId[] = [
  'hero',
  'headline',
  'compact',
  'horizontal',
  'overlay',
  'standard',
  'split',
  'editorial',
  'banner',
];

/** Grid span classes per slot index in the 4-column mosaic */
export const COVERAGE_SLOT_SPANS = [
  'coverage-slot coverage-slot--hero lg:col-span-2 lg:row-span-2',
  'coverage-slot coverage-slot--headline',
  'coverage-slot coverage-slot--compact',
  'coverage-slot coverage-slot--horizontal lg:col-span-2',
  'coverage-slot coverage-slot--overlay',
  'coverage-slot coverage-slot--standard',
  'coverage-slot coverage-slot--split lg:col-span-2',
  'coverage-slot coverage-slot--editorial',
  'coverage-slot coverage-slot--banner',
] as const;

export const COVERAGE_LAYOUT_LABELS: Record<CoverageLayoutId, string> = {
  hero: 'Hero feature',
  standard: 'Standard card',
  horizontal: 'Horizontal split',
  compact: 'Compact card',
  overlay: 'Image overlay',
  headline: 'Headline + thumb',
  split: 'Balanced split',
  editorial: 'Editorial accent',
  banner: 'Banner strip',
};
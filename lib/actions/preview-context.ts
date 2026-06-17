'use server';

import {
  getPublicSettingsMap,
  getCarouselItems,
  applyEditorialPlacementToCoverageSlots,
  getCoverageSlotsFromSettings,
} from '@/lib/homepage-content';
import { getPinnedCoverageArticles, resolveCoverageSlots } from '@/lib/coverage-content';
import {
  getPublicCategories,
  getPublishedArticlesForPublic,
} from '@/lib/category-content';

export async function getArticlePreviewContext() {
  const settings = await getPublicSettingsMap();

  const [carouselItems, categories, sectorArticles, coverageSlots, pinnedArticles] = await Promise.all([
    getCarouselItems(settings),
    getPublicCategories(),
    getPublishedArticlesForPublic(12),
    (async () => {
      const slots = getCoverageSlotsFromSettings(settings);
      const withPlacement = await applyEditorialPlacementToCoverageSlots(slots);
      return resolveCoverageSlots(withPlacement);
    })(),
    getPinnedCoverageArticles(),
  ]);

  return {
    carouselItems,
    categories,
    sectorArticles,
    coverageSlots,
    pinnedArticles,
  };
}
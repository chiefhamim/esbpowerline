/** Editorial placement — carousel vs All Coverage pinned row */

export const MAX_CAROUSEL_ITEMS = 5;
export const MAX_PINNED_COVERAGE = 3;

export type PlacementFlags = {
  isFeatured: boolean;
  isBreaking: boolean;
  isPinned: boolean;
  isTrending: boolean;
};

/** Pinned stories live in All Coverage; featured drives the carousel. Never both. */
export function reconcilePlacementFlags(flags: PlacementFlags): PlacementFlags {
  let { isFeatured, isBreaking, isPinned, isTrending } = flags;
  if (isPinned) isFeatured = false;
  if (isFeatured) isPinned = false;
  return { isFeatured, isBreaking, isPinned, isTrending };
}
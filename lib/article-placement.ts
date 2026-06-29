/** Editorial & public-site placement flags — shared labels and color tokens */

export type PlacementFlagId = 'featured' | 'breaking' | 'pin' | 'trending';

export type PlacementAccent = 'amber' | 'red' | 'violet' | 'sky';

export const PLACEMENT_FLAGS = {
  featured: {
    id: 'featured',
    label: 'Featured story',
    shortLabel: 'Featured',
    hint: 'Featured news section (max 8 stories, not hero)',
    accent: 'amber',
    /** Gold — international “editor’s pick / top story” convention */
    color: '38 92% 50%',
    filledIcon: false,
  },
  breaking: {
    id: 'breaking',
    label: 'Breaking',
    shortLabel: 'Breaking',
    hint: 'Urgent badge + hero carousel',
    accent: 'red',
    /** Red — universal breaking-news alert (CNN, BBC, Reuters) */
    color: '0 72% 51%',
    filledIcon: true,
  },
  pin: {
    id: 'pin',
    label: 'Pin All Coverage',
    shortLabel: 'Pinned',
    hint: 'Top row of All Coverage (max 3, not carousel)',
    accent: 'violet',
    /** Violet — distinct “pinned to top” editorial signal */
    color: '262 72% 62%',
    filledIcon: false,
  },
  trending: {
    id: 'trending',
    label: 'Trending',
    shortLabel: 'Trending',
    hint: 'Homepage right rail (5 stories)',
    accent: 'sky',
    /** Sky — trending/viral content */
    color: '199 89% 48%',
    filledIcon: false,
  },
} as const satisfies Record<
  PlacementFlagId,
  {
    id: PlacementFlagId;
    label: string;
    shortLabel: string;
    hint: string;
    accent: PlacementAccent;
    color: string;
    filledIcon: boolean;
  }
>;
import type { CoverageSlot } from '@/lib/coverage-types';
import { COVERAGE_SLOT_LAYOUTS } from '@/lib/coverage-types';

/** Default All Coverage mosaic — slugs match seeded ESB PowerLine official stories */
export const DEFAULT_COVERAGE_SLOTS: CoverageSlot[] = [
  { id: 'slot-1', layout: 'hero', articleSlug: 'bangladeshs-power-costs-rise-manifold-on-fossil-fuel-dependency-report' },
  { id: 'slot-2', layout: 'headline', articleSlug: 'bangladesh-to-buy-five-more-lng-cargoes' },
  { id: 'slot-3', layout: 'compact', articleSlug: 'record-electricity-price-hike-industrial-and-household-expenses-on-the-rise' },
  { id: 'slot-4', layout: 'horizontal', articleSlug: 'electricity-prices-hiked-at-consumer-and-wholesale-levels-new-rates-announced' },
  { id: 'slot-5', layout: 'overlay', articleSlug: 'government-focusing-on-renewable-energy-to-achieve-self-reliance-in-power-chief-whip' },
  { id: 'slot-6', layout: 'standard', articleSlug: 'private-investments-worth-tk-35000-crore-stalled-due-to-gas-connection-crisis' },
  { id: 'slot-7', layout: 'split', articleSlug: 'new-initiative-for-offshore-oil-and-gas-exploration-petrobangla-to-invite-international-tenders-on-sunday' },
  { id: 'slot-8', layout: 'editorial', articleSlug: 'world-bank-allocates-usd-350-million-for-bangladesh-lng-imports' },
  { id: 'slot-9', layout: 'banner', articleSlug: 'small-garment-exporters-adopt-solar-power-amid-european-buyer-pressure' },
];

export function normalizeCoverageSlots(raw: unknown): CoverageSlot[] {
  if (!Array.isArray(raw) || raw.length === 0) return DEFAULT_COVERAGE_SLOTS;

  return raw
    .map((item, index) => {
      const row = item as Partial<CoverageSlot>;
      const fallback = DEFAULT_COVERAGE_SLOTS[index] ?? DEFAULT_COVERAGE_SLOTS[0];
      return {
        id: row.id ?? `slot-${index + 1}`,
        layout: COVERAGE_SLOT_LAYOUTS[index] ?? fallback.layout,
        articleSlug: row.articleSlug ?? fallback.articleSlug,
      };
    })
    .slice(0, 9);
}
import { describe, it, expect } from 'vitest';
import { CATEGORIES } from '@/lib/constants';
import {
  productionCategoryRows,
  productionSiteSettings,
} from '@/lib/seed/production-data';

describe('production bootstrap data', () => {
  it('exports one category row per legacy sector', () => {
    const rows = productionCategoryRows();
    expect(rows).toHaveLength(CATEGORIES.length);
    expect(rows.map((r) => r.name).sort()).toEqual([...CATEGORIES].sort());
    for (const row of rows) {
      expect(row.slug.length).toBeGreaterThan(0);
      expect(row.description?.length).toBeGreaterThan(0);
    }
  });

  it('site settings use managed carousel and empty coverage slugs', () => {
    const settings = productionSiteSettings();
    const homepage = settings.find((s) => s.key === 'homepage');
    const coverage = settings.find((s) => s.key === 'coverage');

    expect(homepage?.value).toMatchObject({ carouselMode: 'managed' });
    const slots = coverage?.value;
    expect(Array.isArray(slots)).toBe(true);
    if (Array.isArray(slots)) {
      for (const slot of slots) {
        expect(slot).toMatchObject({ articleSlug: '' });
      }
    }
  });
});
import { describe, expect, it } from 'vitest';
import { CATEGORIES } from '@/lib/constants';
import {
  CATEGORY_TRANSLATIONS_BN,
  localizeCategoryFields,
  localizeCategoryName,
} from '@/lib/i18n/categories';

describe('category localization', () => {
  it('provides Bengali names for all 10 canonical categories', () => {
    for (const name of CATEGORIES) {
      expect(CATEGORY_TRANSLATIONS_BN[name].name.length).toBeGreaterThan(0);
      expect(CATEGORY_TRANSLATIONS_BN[name].description.length).toBeGreaterThan(0);
    }
  });

  it('returns English unchanged for en locale', () => {
    expect(localizeCategoryName('en', 'Grid & Transmission')).toBe('Grid & Transmission');
  });

  it('returns Bengali for bn locale', () => {
    expect(localizeCategoryName('bn', 'Grid & Transmission')).toBe('ট্রান্সমিশন ও জাতীয় গ্রিড');
  });

  it('localizes category fields for display', () => {
    const result = localizeCategoryFields('bn', {
      name: 'Power Generation',
      description: 'State plants',
    });
    expect(result.name).toBe('বিদ্যুৎ উৎপাদন');
    expect(result.description).toContain('সরকারি');
  });
});
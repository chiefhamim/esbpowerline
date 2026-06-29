import { describe, expect, it } from 'vitest';
import {
  HEADLINE_BUDGET,
  budgetTone,
  needsShortTitle,
  resolveDisplayTitle,
} from '@/lib/editorial-limits';

describe('editorial-limits', () => {
  it('defines 4-line hero headline budget', () => {
    expect(HEADLINE_BUDGET.ideal).toBe(88);
    expect(HEADLINE_BUDGET.max).toBe(104);
  });

  it('flags headlines over max for short-title fallback', () => {
    expect(needsShortTitle('x'.repeat(104))).toBe(false);
    expect(needsShortTitle('x'.repeat(105))).toBe(true);
  });

  it('resolves display title with shortTitle when over max', () => {
    const long = 'A'.repeat(110);
    expect(resolveDisplayTitle(long, 'Short')).toBe('Short');
    expect(resolveDisplayTitle(long, null)).toBe(long);
    expect(resolveDisplayTitle('OK headline', 'Short')).toBe('OK headline');
  });

  it('budgetTone warns above ideal and over above max', () => {
    expect(budgetTone(80, HEADLINE_BUDGET)).toBe('ok');
    expect(budgetTone(90, HEADLINE_BUDGET)).toBe('warn');
    expect(budgetTone(105, HEADLINE_BUDGET)).toBe('over');
  });
});
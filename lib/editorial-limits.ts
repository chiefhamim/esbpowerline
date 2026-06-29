/** Character budgets aligned with homepage hero, carousel, and card layouts */

export type CharBudget = {
  ideal: number;
  max: number;
  label: string;
};

/**
 * Hero headline slot (desktop): left column ~340–400px at shell width,
 * font clamp(2rem, 3.5vw, 2.75rem), line-height 1.08, 4 lines.
 * ~21–22 avg chars/line → ideal 88 (22×4), hard max 104 (26×4).
 */
export const HEADLINE_BUDGET: CharBudget = {
  ideal: 88,
  max: 104,
  label: 'Hero carousel (4-line slot)',
};

export const EXCERPT_BUDGET: CharBudget = {
  ideal: 160,
  max: 200,
  label: 'Carousel deck & homepage cards',
};

export const SLUG_BUDGET: CharBudget = {
  ideal: 48,
  max: 80,
  label: 'URL slug',
};

export function charsRemaining(length: number, budget: CharBudget) {
  return budget.max - length;
}

export function budgetTone(length: number, budget: CharBudget): 'ok' | 'warn' | 'over' {
  if (length > budget.max) return 'over';
  if (length > budget.ideal) return 'warn';
  return 'ok';
}

/** Cards/trending use shortTitle when the full headline exceeds the hero slot. */
export function resolveDisplayTitle(title: string, shortTitle?: string | null): string {
  if (title.length > HEADLINE_BUDGET.max && shortTitle?.trim()) {
    return shortTitle.trim();
  }
  return title;
}

export function needsShortTitle(title: string): boolean {
  return title.length > HEADLINE_BUDGET.max;
}
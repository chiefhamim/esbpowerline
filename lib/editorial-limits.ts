/** Character budgets aligned with homepage hero, carousel, and card layouts */

export type CharBudget = {
  ideal: number;
  max: number;
  label: string;
};

export const HEADLINE_BUDGET: CharBudget = {
  ideal: 72,
  max: 100,
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
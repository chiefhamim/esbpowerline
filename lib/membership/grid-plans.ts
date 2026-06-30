import type { GridAccessTier } from '@/lib/data/grid/grid-tier-access';

export type GridPlanId = 'none' | 'plan_499' | 'plan_999';

export type GridPlanDefinition = {
  id: GridPlanId;
  tier: GridAccessTier;
  name: string;
  price: number;
  currency: 'BDT';
  period: 'month';
  headline: string;
  description: string;
  features: string[];
  highlight?: boolean;
};

/** Paid grid archive plans — payment activation coming soon. */
export const GRID_PLANS: Record<'plan_499' | 'plan_999', GridPlanDefinition> = {
  plan_499: {
    id: 'plan_499',
    tier: 'plan_499',
    name: 'Grid Archive — 5 Years',
    price: 499,
    currency: 'BDT',
    period: 'month',
    headline: 'Five years of grid history',
    description: 'Unlock five years of daily PGCB grid reports, generation mix, and demand data.',
    features: [
      '5 years of daily grid reports',
      'Generation & demand breakdowns',
      'Regional load & outage history',
      'CSV export for allowed dates',
    ],
  },
  plan_999: {
    id: 'plan_999',
    tier: 'plan_999',
    name: 'Grid Archive — Full Access',
    price: 999,
    currency: 'BDT',
    period: 'month',
    headline: 'Complete backlog access',
    description: 'Full access to the entire PGCB grid data archive — every published daily report.',
    features: [
      'Complete grid data archive',
      'Everything in the 5-year plan',
      'Deep historical analysis (2013+)',
      'Priority data refresh access',
    ],
    highlight: true,
  },
};

export const GRID_PLAN_LIST = [GRID_PLANS.plan_499, GRID_PLANS.plan_999] as const;

export function formatPlanPrice(plan: GridPlanDefinition): string {
  return `৳${plan.price.toLocaleString('en-BD')}`;
}
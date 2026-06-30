'use client';

import { useState, useTransition } from 'react';
import { Check, Clock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GRID_PLAN_LIST, formatPlanPrice, type GridPlanDefinition } from '@/lib/membership/grid-plans';
import { GRID_TIER_LIMITS } from '@/lib/data/grid/grid-tier-access';
import { requestGridPlanAction } from '@/lib/actions/grid-subscription';

type GridSubscriptionPlansProps = {
  currentPlan?: 'none' | 'plan_499' | 'plan_999';
  pendingPlan?: 'none' | 'plan_499' | 'plan_999';
};

function PlanCard({
  plan,
  currentPlan,
  pendingPlan,
  onSelect,
  selecting,
}: {
  plan: GridPlanDefinition;
  currentPlan: GridPlanDefinition['id'];
  pendingPlan: GridPlanDefinition['id'];
  onSelect: (planId: GridPlanDefinition['id']) => void;
  selecting: boolean;
}) {
  const isCurrent = currentPlan === plan.id;
  const isPending = pendingPlan === plan.id;
  const tierLimits = GRID_TIER_LIMITS[plan.tier];

  return (
    <article
      className={cn(
        'member-card relative flex flex-col rounded-2xl border p-6 transition-shadow',
        plan.highlight
          ? 'border-primary/40 bg-primary/5 shadow-md'
          : 'border-border/60 bg-card/80',
      )}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-4 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
          <Sparkles className="h-3 w-3" />
          Best value
        </span>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{plan.headline}</p>
      </div>

      <div className="mb-4">
        <p className="text-3xl font-bold tracking-tight text-foreground">
          {formatPlanPrice(plan)}
          <span className="text-sm font-medium text-muted-foreground"> / month</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{tierLimits.description}</p>
      </div>

      <ul className="mb-6 flex-1 space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <span className="btn btn-secondary pointer-events-none w-full justify-center text-sm opacity-80">
          Current plan
        </span>
      ) : isPending ? (
        <span className="btn btn-secondary pointer-events-none w-full justify-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Payment pending
        </span>
      ) : (
        <button
          type="button"
          disabled={selecting}
          onClick={() => onSelect(plan.id)}
          className={cn(
            'btn w-full justify-center text-sm',
            plan.highlight ? 'btn-primary' : 'btn-secondary',
          )}
        >
          {selecting ? 'Saving…' : `Choose ${formatPlanPrice(plan)} plan`}
        </button>
      )}
    </article>
  );
}

export function GridSubscriptionPlans({
  currentPlan = 'none',
  pendingPlan = 'none',
}: GridSubscriptionPlansProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSelect = (planId: GridPlanDefinition['id']) => {
    setMessage(null);
    setError(null);
    startTransition(async () => {
      const result = await requestGridPlanAction(planId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMessage(
        'Your plan selection has been saved. Payment via bKash, cards, and mobile banking is coming soon — we will notify you when checkout is live.',
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
        <p className="font-semibold">Payment coming soon</p>
        <p className="mt-1 text-amber-800/90 dark:text-amber-200/90">
          We are finalising secure checkout for Bangladesh — bKash, debit/credit cards, and mobile banking. Select a plan now to register your interest; billing will open shortly.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-900 dark:text-emerald-100">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-destructive/25 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {GRID_PLAN_LIST.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={currentPlan}
            pendingPlan={pendingPlan}
            onSelect={handleSelect}
            selecting={isPending}
          />
        ))}
      </div>

      <section className="rounded-xl border border-border/50 bg-muted/15 p-4 text-sm text-muted-foreground">
        <h4 className="font-semibold text-foreground">Free member access</h4>
        <p className="mt-1">
          Every registered member gets <span className="font-medium text-foreground">{GRID_TIER_LIMITS.member.shortLabel}</span> of grid data at no cost — perfect for tracking recent trends. Paid plans extend your historical window.
        </p>
      </section>
    </div>
  );
}
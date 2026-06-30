import { requireMemberSession } from '@/lib/member-auth';
import prisma from '@/lib/prisma';
import { GridSubscriptionPlans } from '@/components/members/GridSubscriptionPlans';
import { GRID_TIER_LIMITS } from '@/lib/data/grid/grid-tier-access';
import type { GridPlanId } from '@/lib/membership/grid-plans';

export const metadata = {
  title: 'Grid data subscription | ESB PowerLine',
  description: 'Extend your Power Grid Explorer access with monthly archive plans.',
};

function dbPlanToClient(plan: string, status: string): { current: GridPlanId; pending: GridPlanId } {
  if (status === 'ACTIVE') {
    if (plan === 'PLAN_499') return { current: 'plan_499', pending: 'none' };
    if (plan === 'PLAN_999') return { current: 'plan_999', pending: 'none' };
  }
  if (status === 'PENDING') {
    if (plan === 'PLAN_499') return { current: 'none', pending: 'plan_499' };
    if (plan === 'PLAN_999') return { current: 'none', pending: 'plan_999' };
  }
  return { current: 'none', pending: 'none' };
}

export default async function MemberSubscriptionPage() {
  const session = await requireMemberSession();

  let currentPlan: GridPlanId = 'none';
  let pendingPlan: GridPlanId = 'none';

  try {
    const sub = await prisma.memberGridSubscription.findUnique({
      where: { userId: session.user.id },
      select: { plan: true, status: true },
    });
    if (sub) {
      const mapped = dbPlanToClient(sub.plan, sub.status);
      currentPlan = mapped.current;
      pendingPlan = mapped.pending;
    }
  } catch {
    // Table may not be migrated yet — page still renders.
  }

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
          Power Grid Explorer
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Grid data subscription</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Your free member account includes {GRID_TIER_LIMITS.member.shortLabel} of daily PGCB grid reports.
          Subscribe to unlock deeper historical analysis — payment integration is coming soon.
        </p>
      </section>

      <GridSubscriptionPlans currentPlan={currentPlan} pendingPlan={pendingPlan} />
    </div>
  );
}
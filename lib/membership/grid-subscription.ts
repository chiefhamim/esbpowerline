import 'server-only';

import prisma from '@/lib/prisma';
import type { GridPlanId } from '@/lib/membership/grid-plans';
import { syncSupabaseGridPlan } from '@/lib/supabase/sync-auth-user';

type DbPlan = 'NONE' | 'PLAN_499' | 'PLAN_999';
type DbStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

function dbPlanToGridPlanId(plan: DbPlan, status: DbStatus): GridPlanId {
  if (status !== 'ACTIVE') return 'none';
  if (plan === 'PLAN_499') return 'plan_499';
  if (plan === 'PLAN_999') return 'plan_999';
  return 'none';
}

export function gridPlanIdToDbPlan(plan: GridPlanId): DbPlan {
  if (plan === 'plan_499') return 'PLAN_499';
  if (plan === 'plan_999') return 'PLAN_999';
  return 'NONE';
}

/** Resolve active grid plan for a member from Prisma (server-side). */
export async function resolveMemberGridPlan(userId: string): Promise<GridPlanId> {
  try {
    const sub = await prisma.memberGridSubscription.findUnique({
      where: { userId },
      select: { plan: true, status: true, expiresAt: true },
    });
    if (!sub) return 'none';

    if (sub.expiresAt && sub.expiresAt < new Date()) return 'none';
    return dbPlanToGridPlanId(sub.plan, sub.status);
  } catch {
    return 'none';
  }
}

/** Record interest in a plan — payment activation coming soon. */
export async function requestGridPlanUpgrade(input: {
  userId: string;
  email: string;
  plan: GridPlanId;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  if (input.plan !== 'plan_499' && input.plan !== 'plan_999') {
    return { ok: false, error: 'Select a valid subscription plan.' };
  }

  const dbPlan = gridPlanIdToDbPlan(input.plan);

  await prisma.memberGridSubscription.upsert({
    where: { userId: input.userId },
    create: {
      userId: input.userId,
      plan: dbPlan,
      status: 'PENDING',
    },
    update: {
      plan: dbPlan,
      status: 'PENDING',
    },
  });

  return { ok: true };
}

/** Activate a plan after payment (webhook / admin) — syncs to Supabase app_metadata. */
export async function activateMemberGridPlan(input: {
  userId: string;
  email: string;
  plan: GridPlanId;
  expiresAt?: Date | null;
}): Promise<void> {
  if (input.plan !== 'plan_499' && input.plan !== 'plan_999') return;

  const dbPlan = gridPlanIdToDbPlan(input.plan);
  const now = new Date();

  await prisma.memberGridSubscription.upsert({
    where: { userId: input.userId },
    create: {
      userId: input.userId,
      plan: dbPlan,
      status: 'ACTIVE',
      startsAt: now,
      expiresAt: input.expiresAt ?? null,
    },
    update: {
      plan: dbPlan,
      status: 'ACTIVE',
      startsAt: now,
      expiresAt: input.expiresAt ?? null,
    },
  });

  await syncSupabaseGridPlan(input.email, input.plan).catch(() => undefined);
}
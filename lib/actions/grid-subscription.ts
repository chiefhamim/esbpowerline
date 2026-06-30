'use server';

import { requireMemberSession } from '@/lib/member-auth';
import { requestGridPlanUpgrade } from '@/lib/membership/grid-subscription';
import type { GridPlanId } from '@/lib/membership/grid-plans';
import { revalidatePath } from 'next/cache';

export async function requestGridPlanAction(
  plan: GridPlanId,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await requireMemberSession();

  const result = await requestGridPlanUpgrade({
    userId: session.user.id,
    email: session.user.email,
    plan,
  });

  if (result.ok) {
    revalidatePath('/members/subscription');
  }

  return result;
}
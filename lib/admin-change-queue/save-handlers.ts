import { updateSettingsBatch } from '@/lib/actions/settings';
import { deepMerge } from '@/lib/admin-change-queue/deep-merge';
import type { AdminPendingChange } from '@/lib/admin-change-queue/types';

export async function saveAdminChangeGroup(
  group: AdminPendingChange['group'],
  changes: AdminPendingChange[],
) {
  if (!changes.length) return;

  if (group === 'settings') {
    let merged: Record<string, unknown> = {};
    for (const change of changes) {
      if (!change.collect) continue;
      merged = deepMerge(merged, change.collect());
    }
    if (Object.keys(merged).length > 0) {
      await updateSettingsBatch(merged);
    }
    return;
  }
}
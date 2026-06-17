'use client';

import { AdminActivityItem } from '@/components/admin/AdminUI';
import { AdminFormattedTime } from '@/components/admin/AdminFormattedTime';
import { StatusBadge } from '@/components/dashboard/StatusBadge';
import { adminActivityBadgeLabel } from '@/lib/admin-audit';

type ActivityLog = {
  id: string;
  type: string;
  message: string;
  timestamp: Date | string;
};

export function AdminRecentActivity({
  logs,
  emptyLabel = 'No administrative activity logged.',
}: {
  logs: ActivityLog[];
  emptyLabel?: string;
}) {
  if (logs.length === 0) {
    return <p className="text-[13px] text-muted-foreground py-2">{emptyLabel}</p>;
  }

  return (
    <div className="admin-activity-feed">
      {logs.map((log) => (
        <AdminActivityItem
          key={log.id}
          badge={<StatusBadge status={adminActivityBadgeLabel(log.type)} />}
          date={<AdminFormattedTime value={log.timestamp} />}
          message={log.message}
        />
      ))}
    </div>
  );
}
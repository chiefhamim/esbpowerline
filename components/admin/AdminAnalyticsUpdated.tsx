'use client';

import { AdminFormattedTime } from '@/components/admin/AdminFormattedTime';

export function AdminAnalyticsUpdated({ generatedAt }: { generatedAt: string | Date }) {
  return (
    <span className="admin-analytics-updated">
      Updated <AdminFormattedTime value={generatedAt} />
    </span>
  );
}
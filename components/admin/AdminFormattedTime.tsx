'use client';

import { cn } from '@/lib/utils';
import { formatAdminDateTime } from '@/lib/admin-time-format';
import { useAdminPreferences } from '@/components/admin/AdminPreferencesProvider';

export function AdminFormattedTime({
  value,
  className,
}: {
  value: string | Date;
  className?: string;
}) {
  const { timeFormat } = useAdminPreferences();
  return (
    <span className={cn('admin-formatted-time', className)}>
      {formatAdminDateTime(value, timeFormat)}
    </span>
  );
}
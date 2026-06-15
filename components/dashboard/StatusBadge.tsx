import { Badge } from '@/components/ui/badge';

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'> = {
  ACTIVE: 'success',
  PUBLISHED: 'success',
  DRAFT: 'secondary',
  SCHEDULED: 'warning',
  ARCHIVED: 'outline',
  TRASH: 'destructive',
  SUSPENDED: 'destructive',
  PENDING: 'warning',
  APPROVED: 'success',
  SPAM: 'destructive',
};

export function StatusBadge({ status }: { status: string }) {
  const variant = STATUS_VARIANTS[status] ?? 'outline';
  return <Badge variant={variant}>{status.toLowerCase()}</Badge>;
}
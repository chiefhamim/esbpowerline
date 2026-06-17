import { Badge } from '@/components/ui/badge';
import { ROLES, type Role } from '@/lib/constants';

export function RoleBadge({ role }: { role: Role }) {
  const info = ROLES[role];
  return (
    <Badge variant="outline" style={{ borderColor: info?.color, color: info?.color }}>
      {info?.name ?? role}
    </Badge>
  );
}
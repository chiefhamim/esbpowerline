import { Badge } from '@/components/ui/badge';
import { ROLES, USER_ROLE_LABELS, type Role } from '@/lib/constants';

export function RoleBadge({ role }: { role: Role }) {
  const info = ROLES[role];
  return (
    <Badge variant="outline" style={{ borderColor: info?.color, color: info?.color }}>
      {USER_ROLE_LABELS[role] ?? info?.name ?? role}
    </Badge>
  );
}
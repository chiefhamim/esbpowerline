import 'server-only';

import { seedPasswordForEmail } from '@/lib/seed-credentials';
import { MASTER_ADMIN_EMAIL } from '@/lib/staff-accounts';

/** @deprecated Use seedPasswordForEmail — server-only bootstrap password resolver. */
export function getDemoPassword(): string | null {
  return seedPasswordForEmail(MASTER_ADMIN_EMAIL);
}
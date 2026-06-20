import { devStaffLoginPasswordHint } from '@/lib/seed-credentials';

/** Dev-only bootstrap password — never import from client components. */
export function getDevBootstrapPassword(): string | null {
  return devStaffLoginPasswordHint();
}
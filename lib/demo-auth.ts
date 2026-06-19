import 'server-only';

import { getDevBootstrapPassword } from '@/lib/dev-login-hints';

/** @deprecated Use getDevBootstrapPassword — server-only bootstrap password resolver. */
export function getDemoPassword(): string {
  return getDevBootstrapPassword() ?? 'esbpowerline007';
}
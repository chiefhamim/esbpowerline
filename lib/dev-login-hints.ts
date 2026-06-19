import 'server-only';

/** Dev-only bootstrap password — never import from client components. */
export function getDevBootstrapPassword(): string | null {
  if (process.env.NODE_ENV === 'production') return null;
  return (
    process.env.MASTER_ADMIN_PASSWORD?.trim() ||
    process.env.SEED_DEMO_PASSWORD?.trim() ||
    'esbpowerline007'
  );
}
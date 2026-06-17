import { config } from 'dotenv';

config({ path: '.env.local' });
config();

async function main() {
  const { checkSupabaseHealth } = await import('../lib/supabase/health');
  const health = await checkSupabaseHealth();
  console.log(JSON.stringify(health, null, 2));
  if (!health.ok) process.exit(1);
}

main();
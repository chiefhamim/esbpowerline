/**
 * Pull Vercel production env → .env.production.local (gitignored).
 * Never prints secret values.
 */
import { spawnSync } from 'child_process';
import { existsSync } from 'fs';

const outFile = '.env.production.local';
const vercelBin = 'node';

console.log(`Pulling Vercel production env → ${outFile} (values not shown)...`);

const result = spawnSync(
  vercelBin,
  ['node_modules/vercel/dist/index.js', 'env', 'pull', outFile, '--environment=production', '--yes'],
  { stdio: 'inherit', shell: process.platform === 'win32' },
);

if (result.status !== 0) {
  console.error('\nFailed. Authenticate first: npx vercel login && npx vercel link');
  process.exit(result.status ?? 1);
}

if (!existsSync(outFile)) {
  console.error(`\nExpected ${outFile} was not created.`);
  process.exit(1);
}

console.log(`\n✓ ${outFile} updated. Run: npm run bootstrap:prod`);
/**
 * Build .env.local from Supabase CLI/API (requires: supabase login or SUPABASE_ACCESS_TOKEN).
 * Never prints secret values to stdout.
 */
import { spawnSync } from "child_process";
import { readFileSync, writeFileSync, existsSync } from "fs";

const PROJECT_REF = "sxgokpmrbgdndstygapc";
const OUT_FILE = ".env.local";
const supabaseBin = process.platform === "win32" ? "npx.cmd" : "npx";

function runJson(args) {
  const result = spawnSync(supabaseBin, ["supabase", ...args, "--output-format", "json"], {
    encoding: "utf8",
    shell: process.platform === "win32",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || result.stdout?.trim() || "supabase command failed");
  }
  const raw = result.stdout?.trim();
  if (!raw) return null;
  return JSON.parse(raw);
}

function pickKey(keys, ...names) {
  for (const name of names) {
    const hit = keys.find((k) => k.name === name || k.id === name);
    if (hit?.api_key && !hit.api_key.includes("···")) return hit.api_key;
  }
  return "";
}

const keysPayload = runJson(["projects", "api-keys", "--project-ref", PROJECT_REF]);
const keys = keysPayload?.keys ?? keysPayload ?? [];

const url = `https://${PROJECT_REF}.supabase.co`;
const publishable = pickKey(keys, "default") || pickKey(keys, "publishable") || "";
const anon =
  pickKey(keys, "anon") ||
  keys.find((k) => k.type === "legacy" && k.name === "anon")?.api_key ||
  "";
const serviceRole =
  pickKey(keys, "service_role") ||
  keys.find((k) => k.type === "legacy" && k.name === "service_role")?.api_key ||
  "";

if (!anon && !publishable) {
  console.error("❌ Could not resolve Supabase API keys. Run: npx supabase login");
  process.exit(1);
}

const authSecret = (() => {
  if (!existsSync(".env")) return "";
  const m = readFileSync(".env", "utf8").match(/^AUTH_SECRET=(.+)$/m);
  return m?.[1]?.replace(/^["']|["']$/g, "") ?? "";
})();

const poolerHost = "aws-1-ap-northeast-1.pooler.supabase.com";
const dbUser = `postgres.${PROJECT_REF}`;

const lines = [
  "# Auto-synced from Supabase CLI — do not commit",
  `NEXT_PUBLIC_SUPABASE_URL=${url}`,
  `SUPABASE_URL=${url}`,
  publishable ? `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=${publishable}` : null,
  publishable ? `SUPABASE_PUBLISHABLE_KEY=${publishable}` : null,
  anon ? `NEXT_PUBLIC_SUPABASE_ANON_KEY=${anon}` : null,
  anon ? `SUPABASE_ANON_KEY=${anon}` : null,
  serviceRole ? `SUPABASE_SERVICE_ROLE_KEY=${serviceRole}` : null,
  authSecret ? `AUTH_SECRET=${authSecret}` : null,
  "",
  "# Postgres (set POSTGRES_PASSWORD from Dashboard → Database, then re-run this script)",
  `# DATABASE_URL=postgresql://${dbUser}:[PASSWORD]@${poolerHost}:6543/postgres?pgbouncer=true`,
  `# DIRECT_URL=postgresql://${dbUser}:[PASSWORD]@${poolerHost}:5432/postgres`,
  `# PRISMA_SCHEMA_PROVIDER=postgresql`,
  "",
  "# Vercel CLI metadata (harmless locally)",
  'NX_DAEMON="false"',
  'TURBO_CACHE="remote:rw"',
  'TURBO_DOWNLOAD_LOCAL_ENABLED="true"',
  'TURBO_REMOTE_ONLY="true"',
  'TURBO_RUN_SUMMARY="true"',
].filter((line) => line !== null);

writeFileSync(OUT_FILE, `${lines.join("\n")}\n`, "utf8");
console.log(`✓ Wrote ${OUT_FILE} (Supabase Auth ready; DB URLs need POSTGRES_PASSWORD if using remote Postgres locally).`);
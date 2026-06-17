import 'server-only';
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import fs from 'fs';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const dbUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
  const filePath = dbUrl.replace(/^file:/, '');
  let resolved = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);

  // Production/Vercel: SQLite must live on writable /tmp. Refresh when the bundled DB is newer
  // (e.g. after prisma db push / migrate during build) so stale /tmp copies do not miss columns.
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpPath = path.join('/tmp', path.basename(resolved));
    try {
      if (fs.existsSync(resolved)) {
        const shouldCopy =
          !fs.existsSync(tmpPath)
          || fs.statSync(resolved).mtimeMs > fs.statSync(tmpPath).mtimeMs;
        if (shouldCopy) {
          fs.copyFileSync(resolved, tmpPath);
        }
      }
      resolved = tmpPath;
    } catch (e) {
      console.error('Failed to copy database to /tmp:', e);
    }
  }

  const adapter = new PrismaBetterSqlite3({ url: `file:${resolved}` });
  try {
    const sqlite = (adapter as unknown as { database?: { pragma: (cmd: string) => void } }).database;
    sqlite?.pragma?.('journal_mode = WAL');
    sqlite?.pragma?.('synchronous = NORMAL');
  } catch {
    // Optional — adapter internals may differ by version
  }
  return new PrismaClient({ adapter });
}

/** Dev hot-reload can keep an old client after schema changes — recreate if models are missing */
function isPrismaClientCurrent(client: PrismaClient): boolean {
  return 'savedItem' in client && 'memberDownload' in client;
}

function getPrismaClient(): PrismaClient {
  const cached = globalForPrisma.prisma;
  if (cached && isPrismaClientCurrent(cached)) {
    return cached;
  }
  const client = createPrismaClient();
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = client;
  }
  return client;
}

export const prisma = getPrismaClient();

export default prisma;
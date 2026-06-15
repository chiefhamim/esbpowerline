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

  // If in Vercel or production, copy the SQLite database to writable /tmp
  if (process.env.VERCEL || process.env.NODE_ENV === 'production') {
    const tmpPath = path.join('/tmp', path.basename(resolved));
    try {
      if (fs.existsSync(resolved) && !fs.existsSync(tmpPath)) {
        fs.copyFileSync(resolved, tmpPath);
      }
      resolved = tmpPath;
    } catch (e) {
      console.error('Failed to copy database to /tmp:', e);
    }
  }

  const adapter = new PrismaBetterSqlite3({ url: `file:${resolved}` });
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
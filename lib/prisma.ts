import 'server-only';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });
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
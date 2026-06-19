import { defineConfig, env } from 'prisma/config';

const migrationsDir =
  process.env.PRISMA_MIGRATIONS_DIR?.trim() ||
  (process.env.PRISMA_SCHEMA_PROVIDER === 'postgresql'
    ? 'prisma/migrations_postgresql'
    : 'prisma/migrations');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: migrationsDir,
  },
  datasource: {
    url: env('DATABASE_URL'),
    ...(process.env.DIRECT_URL ? { directUrl: process.env.DIRECT_URL } : {}),
  },
});
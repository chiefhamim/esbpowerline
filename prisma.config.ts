import { defineConfig, env } from 'prisma/config';

const migrationsDir =
  process.env.PRISMA_MIGRATIONS_DIR?.trim() ||
  (process.env.PRISMA_SCHEMA_PROVIDER === 'postgresql'
    ? 'prisma/migrations_postgresql'
    : 'prisma/migrations');

const dbUrl =
  process.env.DATABASE_URL ||
  (process.env.PRISMA_SCHEMA_PROVIDER === 'postgresql'
    ? 'postgresql://postgres:postgres@localhost:5432/postgres'
    : 'file:./dev.db');

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: migrationsDir,
  },
  datasource: {
    url: dbUrl,
  },
});
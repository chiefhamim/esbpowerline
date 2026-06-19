import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Runtime / pooler URL (Vercel app queries)
    url: env('DATABASE_URL'),
    // Direct URL for `prisma migrate deploy` during Vercel build — set in Vercel env vars
    directUrl: process.env.DIRECT_URL ?? env('DATABASE_URL'),
  },
});
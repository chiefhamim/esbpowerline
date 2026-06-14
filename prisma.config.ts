import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  // Provide the url here for Prisma 7+ commands (db push, migrate, etc.)
  // The client in lib/prisma.ts will use process.env.DATABASE_URL at runtime
  datasource: {
    url: 'file:./dev.db',
  },
})

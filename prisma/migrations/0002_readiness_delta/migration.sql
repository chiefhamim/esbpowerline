-- Safe deltas for databases that existed before production-readiness deploy.
-- No-op when 0001_init was applied on a fresh database.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "supabaseUserId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "User_supabaseUserId_key" ON "User"("supabaseUserId");

ALTER TABLE "Article" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;

UPDATE "Article" AS a
SET "categoryId" = c."id"
FROM "Category" AS c
WHERE a."category" = c."name"
  AND a."categoryId" IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Article_categoryId_fkey'
  ) THEN
    ALTER TABLE "Article"
      ADD CONSTRAINT "Article_categoryId_fkey"
      FOREIGN KEY ("categoryId") REFERENCES "Category"("id")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

ALTER TYPE "ArticleStatus" ADD VALUE IF NOT EXISTS 'IN_REVIEW';
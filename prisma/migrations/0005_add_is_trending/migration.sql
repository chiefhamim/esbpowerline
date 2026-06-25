-- AlterTable
ALTER TABLE "Article" ADD COLUMN "isTrending" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "ArticleView" ALTER COLUMN "dedupBucket" SET DEFAULT '';

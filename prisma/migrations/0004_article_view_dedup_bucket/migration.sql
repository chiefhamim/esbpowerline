-- Add atomic dedup bucket for concurrent view recording
ALTER TABLE "ArticleView" ADD COLUMN "dedupBucket" TEXT NOT NULL DEFAULT '0';

CREATE UNIQUE INDEX "ArticleView_articleId_visitorKey_dedupBucket_key"
  ON "ArticleView"("articleId", "visitorKey", "dedupBucket");
-- Add categoryId FK to Article and backfill from category name

PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Article" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "publishedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "category" TEXT NOT NULL,
    "categoryId" TEXT,
    "imageUrl" TEXT,
    "readTime" INTEGER NOT NULL DEFAULT 1,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isBreaking" BOOLEAN NOT NULL DEFAULT false,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "tags" JSONB,
    "seo" JSONB,
    "collaboratorIds" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "editorTrash" BOOLEAN NOT NULL DEFAULT false,
    "trashedAt" DATETIME,
    CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_Article" (
    "id", "title", "slug", "excerpt", "content", "authorId", "publishedAt", "status",
    "category", "categoryId", "imageUrl", "readTime", "views", "likes",
    "isFeatured", "isBreaking", "isPinned", "tags", "seo", "collaboratorIds",
    "createdAt", "updatedAt", "version", "editorTrash", "trashedAt"
)
SELECT
    a."id", a."title", a."slug", a."excerpt", a."content", a."authorId", a."publishedAt", a."status",
    a."category",
    (SELECT c."id" FROM "Category" c WHERE c."name" = a."category" LIMIT 1),
    a."imageUrl", a."readTime", a."views", a."likes",
    a."isFeatured", a."isBreaking", a."isPinned", a."tags", a."seo", a."collaboratorIds",
    a."createdAt", a."updatedAt", a."version", a."editorTrash", a."trashedAt"
FROM "Article" a;

DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
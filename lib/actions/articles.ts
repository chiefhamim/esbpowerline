'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can, type Role } from '@/lib/constants';
import { slugify } from '@/lib/utils';
import { articleSchema, type ArticleInput } from '@/lib/validations/article';
import { PUBLIC_REVALIDATE_PATHS } from '@/lib/public-paths';

type ArticleUser = { id: string; role: Role };

function enforceArticlePermissions(
  user: ArticleUser,
  parsed: ArticleInput,
  existing?: { status: string; isFeatured: boolean; isBreaking: boolean; isPinned: boolean },
): ArticleInput {
  if (
    !can(user.role, 'article.publish')
    && (parsed.status === 'PUBLISHED' || parsed.status === 'SCHEDULED')
  ) {
    throw new Error('You do not have permission to publish or schedule articles');
  }

  const result = { ...parsed };
  if (!can(user.role, 'article.feature')) {
    result.isFeatured = existing?.isFeatured ?? false;
    result.isPinned = existing?.isPinned ?? false;
  }
  if (!can(user.role, 'article.breaking')) {
    result.isBreaking = existing?.isBreaking ?? false;
  }
  return result;
}

function revalidatePublicContent(slugs: string[] = []) {
  for (const path of PUBLIC_REVALIDATE_PATHS) revalidatePath(path);
  for (const slug of slugs) revalidatePath(`/articles/${slug}`);
}

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function getAuthorArticleStats(authorId: string) {
  const [total, published, drafts, viewsAgg, recent] = await Promise.all([
    prisma.article.count({ where: { authorId, status: { not: 'TRASH' } } }),
    prisma.article.count({ where: { authorId, status: 'PUBLISHED' } }),
    prisma.article.count({ where: { authorId, status: 'DRAFT' } }),
    prisma.article.aggregate({
      where: { authorId, status: { not: 'TRASH' } },
      _sum: { views: true },
    }),
    getArticles({ authorId, limit: 8 }),
  ]);

  return {
    total,
    published,
    drafts,
    totalViews: viewsAgg._sum.views ?? 0,
    recent,
  };
}

export async function getCalendarArticles(opts?: { authorId?: string; allAuthors?: boolean }) {
  const authorFilter = opts?.allAuthors || !opts?.authorId ? {} : { authorId: opts.authorId };
  const [scheduled, published] = await Promise.all([
    prisma.article.findMany({
      where: { status: 'SCHEDULED', ...authorFilter },
      orderBy: { publishedAt: 'asc' },
      include: { author: { select: { name: true } } },
    }),
    prisma.article.findMany({
      where: { status: 'PUBLISHED', ...authorFilter },
      orderBy: { publishedAt: 'desc' },
      take: 10,
      include: { author: { select: { name: true } } },
    }),
  ]);
  return { scheduled, published };
}

export async function getArticles(opts?: { authorId?: string; status?: string; limit?: number; includeTrash?: boolean }) {
  return prisma.article.findMany({
    where: {
      ...(opts?.authorId ? { authorId: opts.authorId } : {}),
      ...(opts?.status
        ? { status: opts.status as 'DRAFT' | 'PUBLISHED' | 'SCHEDULED' | 'ARCHIVED' | 'TRASH' }
        : opts?.includeTrash
          ? {}
          : { status: { not: 'TRASH' } }),
    },
    include: { author: { select: { id: true, name: true, email: true } } },
    orderBy: { updatedAt: 'desc' },
    take: opts?.limit,
  });
}

export async function getAdminArticles() {
  const user = await requireAuth();
  if (!can(user.role, 'article.edit_any')) throw new Error('Forbidden');
  return getArticles({ includeTrash: true });
}

export type BulkArticleAction =
  | 'trash'
  | 'restore'
  | 'publish'
  | 'draft'
  | 'archive'
  | 'delete_permanent'
  | 'feature'
  | 'unfeature'
  | 'breaking_on'
  | 'breaking_off'
  | 'pin_on'
  | 'pin_off';

const PASSWORD_REQUIRED_ACTIONS = new Set<BulkArticleAction>(['trash', 'delete_permanent', 'archive']);

export async function bulkArticleAction(
  ids: string[],
  action: BulkArticleAction,
  options?: { password?: string; authorNote?: string }
) {
  const user = await requireAuth();
  if (!ids.length) throw new Error('No articles selected');

  const articles = await prisma.article.findMany({
    where: { id: { in: ids } },
    select: { id: true, title: true, slug: true, status: true, publishedAt: true, authorId: true },
  });
  if (articles.length === 0) throw new Error('No articles found');

  const needsEditAny = action !== 'delete_permanent';
  const needsDeleteAny = action === 'delete_permanent' || action === 'trash';

  if (needsEditAny && !can(user.role, 'article.edit_any')) throw new Error('Forbidden');
  if (needsDeleteAny && !can(user.role, 'article.delete_any')) throw new Error('Forbidden');

  if (PASSWORD_REQUIRED_ACTIONS.has(action)) {
    const { verifyAdminPassword } = await import('@/lib/actions/auth-verify');
    await verifyAdminPassword(options?.password ?? '');
  }

  let affected = 0;

  switch (action) {
    case 'trash':
      ({ count: affected } = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { status: 'TRASH' },
      }));
      break;
    case 'restore':
      ({ count: affected } = await prisma.article.updateMany({
        where: { id: { in: ids }, status: 'TRASH' },
        data: { status: 'DRAFT' },
      }));
      break;
    case 'publish':
      await prisma.$transaction(
        articles.map((a) =>
          prisma.article.update({
            where: { id: a.id },
            data: {
              status: 'PUBLISHED',
              publishedAt: a.publishedAt ?? new Date(),
            },
          })
        )
      );
      affected = articles.length;
      break;
    case 'draft':
      ({ count: affected } = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { status: 'DRAFT' },
      }));
      break;
    case 'archive':
      ({ count: affected } = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { status: 'ARCHIVED' },
      }));
      break;
    case 'delete_permanent': {
      const trashIds = articles.filter((a) => a.status === 'TRASH').map((a) => a.id);
      if (trashIds.length === 0) throw new Error('Only trashed articles can be permanently deleted');
      ({ count: affected } = await prisma.article.deleteMany({
        where: { id: { in: trashIds }, status: 'TRASH' },
      }));
      break;
    }
    case 'feature':
      ({ count: affected } = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { isFeatured: true },
      }));
      break;
    case 'unfeature':
      ({ count: affected } = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { isFeatured: false },
      }));
      break;
    case 'breaking_on':
      ({ count: affected } = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { isBreaking: true },
      }));
      break;
    case 'breaking_off':
      ({ count: affected } = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { isBreaking: false },
      }));
      break;
    case 'pin_on': {
      const pinId = ids[0];
      await prisma.article.updateMany({ where: { isPinned: true }, data: { isPinned: false } });
      await prisma.article.update({ where: { id: pinId }, data: { isPinned: true } });
      affected = 1;
      break;
    }
    case 'pin_off':
      ({ count: affected } = await prisma.article.updateMany({
        where: { id: { in: ids } },
        data: { isPinned: false },
      }));
      break;
  }

  if (action === 'trash' || action === 'archive' || action === 'delete_permanent') {
    const noticeType = action === 'delete_permanent' ? 'CONTENT_REMOVED' : 'ADMIN_NOTE';
    const defaultMessage =
      action === 'trash'
        ? 'Your article was moved to trash by an administrator.'
        : action === 'archive'
          ? 'Your article was archived by an administrator.'
          : 'Your article was permanently deleted by an administrator.';
    const message = options?.authorNote?.trim() || defaultMessage;

    await prisma.$transaction(
      articles.map((article) =>
        prisma.editorialNotice.create({
          data: {
            type: noticeType,
            message,
            recipientId: article.authorId,
            senderId: user.id,
            articleId: action === 'delete_permanent' ? null : article.id,
            metadata: {
              articleTitle: article.title,
              action,
            },
          },
        })
      )
    );
  }

  await prisma.auditLog.create({
    data: {
      type: `article.bulk_${action}`,
      message: `Bulk ${action} on ${affected} article(s)`,
      userId: user.id,
    },
  });

  revalidatePath('/cms/articles');
  revalidatePath('/cms');
  revalidatePath('/admin/articles');
  revalidatePublicContent(articles.map((a) => a.slug));

  return { affected, action };
}

export async function getArticle(id: string) {
  return prisma.article.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, email: true } } },
  });
}

export async function createArticle(data: ArticleInput) {
  const user = await requireAuth();
  if (!can(user.role, 'article.create')) throw new Error('Forbidden');

  const parsed = enforceArticlePermissions(user, articleSchema.parse(data));
  const slug = parsed.slug || slugify(parsed.title);

  if (parsed.isPinned) {
    await prisma.article.updateMany({ where: { isPinned: true }, data: { isPinned: false } });
  }

  const existing = await prisma.article.findUnique({ where: { slug } });
  if (existing) throw new Error('Slug already exists');

  const article = await prisma.article.create({
    data: {
      title: parsed.title,
      slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      category: parsed.category,
      status: parsed.status,
      imageUrl: parsed.imageUrl,
      tags: parsed.tags ?? [],
      isFeatured: parsed.isFeatured ?? false,
      isBreaking: parsed.isBreaking ?? false,
      isPinned: parsed.isPinned ?? false,
      authorId: user.id,
      publishedAt: parsed.status === 'PUBLISHED' ? new Date() : parsed.publishedAt ? new Date(parsed.publishedAt) : null,
      seo: parsed.seo ?? {},
      readTime: Math.max(1, Math.ceil(parsed.content.length / 1000)),
    },
  });

  await prisma.auditLog.create({
    data: { type: 'article.create', message: `Created article: ${article.title}`, userId: user.id },
  });

  revalidatePath('/cms');
  revalidatePath('/cms/articles');
  revalidatePath('/admin/articles');
  if (parsed.status === 'PUBLISHED') revalidatePublicContent([article.slug]);
  return article;
}

export async function updateArticle(id: string, data: ArticleInput) {
  const user = await requireAuth();
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) throw new Error('Not found');

  const canEdit = existing.authorId === user.id
    ? can(user.role, 'article.edit_own')
    : can(user.role, 'article.edit_any');
  if (!canEdit) throw new Error('Forbidden');

  const parsed = enforceArticlePermissions(user, articleSchema.parse(data), existing);

  if (parsed.isPinned) {
    await prisma.article.updateMany({
      where: { isPinned: true, id: { not: id } },
      data: { isPinned: false },
    });
  }

  const article = await prisma.article.update({
    where: { id },
    data: {
      title: parsed.title,
      slug: parsed.slug || existing.slug,
      excerpt: parsed.excerpt,
      content: parsed.content,
      category: parsed.category,
      status: parsed.status,
      imageUrl: parsed.imageUrl,
      tags: parsed.tags ?? [],
      isFeatured: parsed.isFeatured ?? false,
      isBreaking: parsed.isBreaking ?? false,
      isPinned: parsed.isPinned ?? false,
      publishedAt: parsed.status === 'PUBLISHED' && !existing.publishedAt
        ? new Date()
        : parsed.publishedAt ? new Date(parsed.publishedAt) : existing.publishedAt,
      seo: parsed.seo ?? {},
      version: { increment: 1 },
      readTime: Math.max(1, Math.ceil(parsed.content.length / 1000)),
    },
  });

  if (parsed.content !== existing.content) {
    await prisma.revision.create({
      data: { articleId: id, content: parsed.content, userId: user.id, note: 'Auto-save' },
    });
  }

  revalidatePath('/cms');
  revalidatePath('/cms/articles');
  revalidatePath('/admin/articles');
  const slugs = [existing.slug];
  if (parsed.slug && parsed.slug !== existing.slug) slugs.push(parsed.slug);
  const wasPublished = existing.status === 'PUBLISHED';
  const isPublished = parsed.status === 'PUBLISHED';
  if (wasPublished || isPublished) revalidatePublicContent(slugs);
  return article;
}

export async function deleteArticle(id: string) {
  const user = await requireAuth();
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) throw new Error('Not found');

  const canDelete = existing.authorId === user.id
    ? can(user.role, 'article.delete_own')
    : can(user.role, 'article.delete_any');
  if (!canDelete) throw new Error('Forbidden');

  await prisma.article.update({ where: { id }, data: { status: 'TRASH' } });
  revalidatePath('/cms');
  revalidatePath('/cms/articles');
  revalidatePath('/admin/articles');
  if (existing.status === 'PUBLISHED') revalidatePublicContent([existing.slug]);
}

export async function getAllTags() {
  const articles = await prisma.article.findMany({
    where: { status: { not: 'TRASH' } },
    select: { tags: true },
  });
  const tagSet = new Set<string>();
  for (const a of articles) {
    for (const t of (a.tags as string[]) ?? []) tagSet.add(t);
  }
  return Array.from(tagSet).sort();
}
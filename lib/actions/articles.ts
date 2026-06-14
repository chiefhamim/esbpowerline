'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { slugify } from '@/lib/utils';
import { articleSchema, type ArticleInput } from '@/lib/validations/article';

async function requireAuth() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  return session.user;
}

export async function getArticles(opts?: { authorId?: string; status?: string; limit?: number }) {
  return prisma.article.findMany({
    where: {
      ...(opts?.authorId ? { authorId: opts.authorId } : {}),
      ...(opts?.status ? { status: opts.status as any } : { status: { not: 'TRASH' } }),
    },
    include: { author: { select: { id: true, name: true, email: true } } },
    orderBy: { updatedAt: 'desc' },
    take: opts?.limit,
  });
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

  const parsed = articleSchema.parse(data);
  const slug = parsed.slug || slugify(parsed.title);

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
      authorId: user.id,
      publishedAt: parsed.status === 'PUBLISHED' ? new Date() : parsed.publishedAt ? new Date(parsed.publishedAt) : null,
      seo: parsed.seo ?? {},
      readTime: Math.max(1, Math.ceil(parsed.content.length / 1000)),
    },
  });

  await prisma.auditLog.create({
    data: { type: 'article.create', message: `Created article: ${article.title}`, userId: user.id },
  });

  revalidatePath('/cms/articles');
  revalidatePath('/admin/articles');
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

  const parsed = articleSchema.parse(data);

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
      publishedAt: parsed.status === 'PUBLISHED' && !existing.publishedAt
        ? new Date()
        : parsed.publishedAt ? new Date(parsed.publishedAt) : existing.publishedAt,
      seo: parsed.seo ?? {},
      version: { increment: 1 },
      readTime: Math.max(1, Math.ceil(parsed.content.length / 1000)),
    },
  });

  await prisma.revision.create({
    data: { articleId: id, content: parsed.content, userId: user.id, note: 'Auto-save' },
  });

  revalidatePath('/cms/articles');
  revalidatePath('/admin/articles');
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
  revalidatePath('/cms/articles');
  revalidatePath('/admin/articles');
}

export async function getAllTags() {
  const articles = await prisma.article.findMany({ select: { tags: true } });
  const tagSet = new Set<string>();
  for (const a of articles) {
    const tags = (a.tags as string[]) ?? [];
    tags.forEach((t) => tagSet.add(t));
  }
  return Array.from(tagSet).sort();
}
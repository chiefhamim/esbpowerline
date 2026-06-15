'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { userSchema, type UserInput } from '@/lib/validations/user';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'user.view')) throw new Error('Forbidden');
  return session.user;
}

export type UserListFilter = 'all' | 'members' | 'staff';

export type UserMemberActivity = {
  savedItems: { id: string; itemType: string; label: string; createdAt: Date }[];
  comments: { id: string; content: string; status: string; articleSlug: string | null; createdAt: Date }[];
  downloads: { id: string; label: string; createdAt: Date }[];
};

const STAFF_ROLES = ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'AUTHOR', 'CONTRIBUTOR'] as const;

export async function getUsers(filter: UserListFilter = 'all') {
  await requireAdmin();
  const where =
    filter === 'members'
      ? { role: 'SUBSCRIBER' as const }
      : filter === 'staff'
        ? { role: { in: [...STAFF_ROLES] } }
        : {};

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, name: true, email: true, role: true, status: true,
      articlesCount: true, totalViews: true, lastLoginAt: true, createdAt: true,
      _count: {
        select: {
          savedItems: true,
          comments: true,
          memberDownloads: true,
        },
      },
    },
  });

  return users.map(({ _count, ...user }) => ({
    ...user,
    savedCount: _count.savedItems,
    commentCount: _count.comments,
    downloadCount: _count.memberDownloads,
  }));
}

export async function getUserMemberActivity(userId: string): Promise<UserMemberActivity | null> {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user || user.role !== 'SUBSCRIBER') return null;

  const [savedItems, comments, downloads] = await Promise.all([
    prisma.savedItem.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.comment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
    }),
    prisma.memberDownload.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      select: { id: true, label: true, createdAt: true },
    }),
  ]);

  const articleIds = savedItems.filter((s) => s.itemType === 'ARTICLE').map((s) => s.targetId);
  const magazineIds = savedItems.filter((s) => s.itemType === 'MAGAZINE').map((s) => s.targetId);
  const commentArticleIds = [...new Set(comments.map((c) => c.articleId))];

  const [articles, magazines, commentArticles] = await Promise.all([
    articleIds.length
      ? prisma.article.findMany({ where: { id: { in: articleIds } }, select: { id: true, title: true } })
      : [],
    magazineIds.length
      ? prisma.magazineIssue.findMany({ where: { id: { in: magazineIds } }, select: { id: true, title: true } })
      : [],
    commentArticleIds.length
      ? prisma.article.findMany({ where: { id: { in: commentArticleIds } }, select: { id: true, slug: true } })
      : [],
  ]);

  const articleTitles = Object.fromEntries(articles.map((a) => [a.id, a.title]));
  const magazineTitles = Object.fromEntries(magazines.map((m) => [m.id, m.title]));
  const articleSlugs = Object.fromEntries(commentArticles.map((a) => [a.id, a.slug]));

  return {
    savedItems: savedItems.map((item) => ({
      id: item.id,
      itemType: item.itemType,
      label:
        item.itemType === 'ARTICLE'
          ? articleTitles[item.targetId] ?? 'Article'
          : magazineTitles[item.targetId] ?? 'Magazine issue',
      createdAt: item.createdAt,
    })),
    comments: comments.map((c) => ({
      id: c.id,
      content: c.content,
      status: c.status,
      articleSlug: articleSlugs[c.articleId] ?? null,
      createdAt: c.createdAt,
    })),
    downloads,
  };
}

export async function getUser(id: string) {
  await requireAdmin();
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true, name: true, email: true, role: true, status: true,
      bio: true, avatar: true, articlesCount: true, totalViews: true,
      lastLoginAt: true, createdAt: true,
    },
  });
}

export async function createUser(data: UserInput) {
  const admin = await requireAdmin();
  if (!can(admin.role, 'user.create')) throw new Error('Forbidden');

  const parsed = userSchema.parse(data);
  const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
  if (existing) throw new Error('Email already exists');

  const passwordHash = await bcrypt.hash(parsed.password || 'changeme123', 10);
  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      passwordHash,
      role: parsed.role,
      status: parsed.status,
      bio: parsed.bio,
    },
  });

  await prisma.auditLog.create({
    data: { type: 'user.create', message: `Created user: ${user.email}`, userId: admin.id },
  });

  revalidatePath('/admin/users');
  return user;
}

export async function updateUser(id: string, data: Partial<UserInput>) {
  const admin = await requireAdmin();
  if (!can(admin.role, 'user.edit')) throw new Error('Forbidden');

  const parsed = userSchema.partial().parse(data);
  const updateData: Record<string, unknown> = { ...parsed };
  delete updateData.password;

  if (parsed.password) {
    updateData.passwordHash = await bcrypt.hash(parsed.password, 10);
  }

  if (parsed.role && !can(admin.role, 'user.change_role')) {
    throw new Error('Cannot change role');
  }

  const user = await prisma.user.update({ where: { id }, data: updateData as any });
  revalidatePath('/admin/users');
  return user;
}

export async function deleteUser(id: string) {
  const admin = await requireAdmin();
  if (!can(admin.role, 'user.delete')) throw new Error('Forbidden');
  if (admin.id === id) throw new Error('Cannot delete yourself');

  await prisma.user.update({ where: { id }, data: { status: 'SUSPENDED' } });
  revalidatePath('/admin/users');
}
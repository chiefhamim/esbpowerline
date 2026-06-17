'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can, type Role } from '@/lib/constants';

async function requireAuthUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user;
}

async function requireAdminReviewer() {
  const user = await requireAuthUser();
  if (!can(user.role as Role, 'admin.access') || !can(user.role as Role, 'article.review')) {
    throw new Error('Forbidden');
  }
  return user;
}

function canSubmitForReview(role: Role, authorId: string, userId: string) {
  if (can(role, 'article.review')) return true;
  return authorId === userId && can(role, 'article.create');
}

export async function submitDraftForAdminReview(articleId: string, note?: string) {
  const user = await requireAuthUser();
  const role = user.role as Role;

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, title: true, status: true, authorId: true },
  });
  if (!article) throw new Error('Article not found');
  if (!canSubmitForReview(role, article.authorId, user.id)) throw new Error('Forbidden');
  if (!['DRAFT', 'IN_REVIEW'].includes(article.status)) {
    throw new Error('Only drafts can be submitted for admin review');
  }

  const admins = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] }, status: 'ACTIVE' },
    select: { id: true },
  });
  if (!admins.length) throw new Error('No active admins to receive this review');

  const message =
    note?.trim()
    || `Review requested for “${article.title}”. Please approve or return with notes.`;

  await prisma.$transaction([
    prisma.article.update({
      where: { id: articleId },
      data: { status: 'IN_REVIEW' },
    }),
    ...admins.map((admin) =>
      prisma.editorialNotice.create({
        data: {
          type: 'REVIEW_SUBMISSION',
          message,
          recipientId: admin.id,
          senderId: user.id,
          articleId,
          metadata: {
            articleTitle: article.title,
            submittedBy: user.name ?? user.email,
          },
        },
      }),
    ),
  ]);

  await prisma.auditLog.create({
    data: {
      type: 'article.review_submit',
      message: `Submitted for admin review: ${article.title}`,
      userId: user.id,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/articles');
  revalidatePath('/cms');
  revalidatePath('/cms/articles');
  return { ok: true };
}

export async function approveReviewSubmission(
  articleId: string,
  options?: { note?: string; publish?: boolean },
) {
  const user = await requireAdminReviewer();
  const note = options?.note?.trim();
  const publish = options?.publish === true;

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, title: true, status: true, authorId: true, publishedAt: true, slug: true },
  });
  if (!article) throw new Error('Article not found');
  if (article.status !== 'IN_REVIEW') throw new Error('Article is not awaiting review');

  const approvalMessage =
    note
    || (publish
      ? `Approved and published: “${article.title}”.`
      : `Approved for publication: “${article.title}”. You may publish when ready.`);

  await prisma.$transaction([
    prisma.article.update({
      where: { id: articleId },
      data: {
        status: publish ? 'PUBLISHED' : 'DRAFT',
        publishedAt: publish ? (article.publishedAt ?? new Date()) : article.publishedAt,
      },
    }),
    prisma.editorialNotice.updateMany({
      where: { articleId, type: 'REVIEW_SUBMISSION', status: 'PENDING' },
      data: { status: 'RESOLVED' },
    }),
    prisma.editorialNotice.create({
      data: {
        type: 'REVIEW_APPROVED',
        message: approvalMessage,
        recipientId: article.authorId,
        senderId: user.id,
        articleId,
        metadata: { articleTitle: article.title, published: publish },
      },
    }),
  ]);

  await prisma.auditLog.create({
    data: {
      type: publish ? 'article.review_publish' : 'article.review_approve',
      message: `${publish ? 'Published' : 'Approved'} after review: ${article.title}`,
      userId: user.id,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/articles');
  revalidatePath('/cms');
  revalidatePath('/cms/articles');
  revalidatePath('/cms/notices');
  if (publish) revalidatePath(`/articles/${article.slug}`);
  revalidatePath('/');
  return { ok: true, published: publish };
}

export async function returnReviewSubmission(articleId: string, note: string) {
  const user = await requireAdminReviewer();
  if (!note.trim()) throw new Error('A note for the author is required');

  const article = await prisma.article.findUnique({
    where: { id: articleId },
    select: { id: true, title: true, status: true, authorId: true },
  });
  if (!article) throw new Error('Article not found');
  if (article.status !== 'IN_REVIEW') throw new Error('Article is not awaiting review');

  await prisma.$transaction([
    prisma.article.update({
      where: { id: articleId },
      data: { status: 'DRAFT' },
    }),
    prisma.editorialNotice.updateMany({
      where: { articleId, type: 'REVIEW_SUBMISSION', status: 'PENDING' },
      data: { status: 'RESOLVED' },
    }),
    prisma.editorialNotice.create({
      data: {
        type: 'REVISION_REQUEST',
        message: note.trim(),
        recipientId: article.authorId,
        senderId: user.id,
        articleId,
        metadata: { articleTitle: article.title, fromReview: true },
      },
    }),
  ]);

  await prisma.auditLog.create({
    data: {
      type: 'article.review_return',
      message: `Returned from review: ${article.title}`,
      userId: user.id,
    },
  });

  revalidatePath('/admin');
  revalidatePath('/admin/articles');
  revalidatePath('/cms');
  revalidatePath('/cms/articles');
  revalidatePath('/cms/notices');
  return { ok: true };
}

export async function dismissReviewNotice(noticeId: string) {
  const user = await requireAdminReviewer();
  const notice = await prisma.editorialNotice.findUnique({ where: { id: noticeId } });
  if (!notice || notice.recipientId !== user.id) throw new Error('Notice not found');

  await prisma.editorialNotice.update({
    where: { id: noticeId },
    data: { status: 'ACKNOWLEDGED' },
  });

  revalidatePath('/admin');
  return { ok: true };
}
'use server';

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';

export async function getAdminLogs(limit = 50) {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'logs.view')) {
    throw new Error('Forbidden');
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { timestamp: 'desc' },
    take: limit,
  });

  const userIds = [...new Set(logs.map((log) => log.userId).filter(Boolean))] as string[];
  const users = userIds.length
    ? await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true, email: true },
      })
    : [];
  const userById = new Map(users.map((user) => [user.id, user]));

  return logs.map((log) => ({
    ...log,
    userLabel: log.userId
      ? userById.get(log.userId)?.name ?? userById.get(log.userId)?.email ?? log.userId
      : 'System',
  }));
}
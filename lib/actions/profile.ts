'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function updateProfile(data: {
  name?: string;
  email?: string;
  password?: string;
  avatar?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) throw new Error('User not found');

  const updateData: any = {};
  let requiresNameApproval = false;

  if (data.name && data.name !== user.name) {
    if (user.role === 'SUPER_ADMIN' || user.role === 'ADMIN') {
      updateData.name = data.name;
    } else {
      updateData.pendingName = data.name;
      requiresNameApproval = true;
    }
  }

  if (data.email && data.email !== user.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new Error('Email already in use');
    updateData.email = data.email;
  }

  if (data.password) {
    updateData.passwordHash = await bcrypt.hash(data.password, 10);
  }

  if (data.avatar !== undefined) {
    updateData.avatar = data.avatar;
  }

  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });
  }

  if (requiresNameApproval) {
    // Notify admins about the name change request
    const admins = await prisma.user.findMany({
      where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
      select: { id: true },
    });
    
    await prisma.$transaction(
      admins.map((admin) =>
        prisma.editorialNotice.create({
          data: {
            type: 'ADMIN_NOTE',
            message: `${user.name} requested a name change to "${data.name}". Please review in the Users panel.`,
            recipientId: admin.id,
            senderId: user.id,
            metadata: { type: 'NAME_CHANGE_REQUEST', pendingName: data.name },
          },
        })
      )
    );
  }

  revalidatePath('/', 'layout');
  return { success: true, requiresNameApproval };
}

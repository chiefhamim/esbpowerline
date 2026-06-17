import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'category.manage')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const categoryId = (formData.get('categoryId') as string | null)?.trim() || 'category';

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (file.type !== 'image/png') {
    return NextResponse.json({ error: 'Category icons must be PNG' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  if (buffer.length > 512 * 1024) {
    return NextResponse.json({ error: 'Icon must be under 512KB after resize' }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'categories');
  await mkdir(uploadsDir, { recursive: true });

  const safeId = categoryId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  const safeName = `${safeId}-${Date.now()}.png`;
  const filePath = path.join(uploadsDir, safeName);
  await writeFile(filePath, buffer);

  return NextResponse.json({
    url: `/uploads/categories/${safeName}`,
    width: 128,
    height: 128,
  });
}
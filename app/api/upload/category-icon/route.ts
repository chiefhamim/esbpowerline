import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { uploadMediaBuffer } from '@/lib/media-storage';

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

  const safeId = categoryId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
  const stored = await uploadMediaBuffer({
    buffer,
    fileName: `${safeId}-${Date.now()}.png`,
    mimeType: 'image/png',
    folder: 'categories',
  });

  return NextResponse.json({
    url: stored.url,
    width: 128,
    height: 128,
    storage: stored.storage,
  });
}
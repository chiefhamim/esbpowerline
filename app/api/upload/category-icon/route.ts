import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { uploadMediaBuffer } from '@/lib/media-storage';
import { checkRateLimitResponse } from '@/lib/security';

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'category.manage')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 10 icon uploads per minute per user
  const rateLimitError = checkRateLimitResponse(request, `cat-icon:${session.user.id}`, 10, 60_000);
  if (rateLimitError) return rateLimitError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const categoryId = (formData.get('categoryId') as string | null)?.trim() || 'category';

    if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    if (file.type !== 'image/png') {
      return NextResponse.json({ error: 'Category icons must be PNG files.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > 512 * 1024) {
      return NextResponse.json({ error: 'Icon must be under 512 KB.' }, { status: 400 });
    }

    const safeId = categoryId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40);
    const stored = await uploadMediaBuffer({
      buffer,
      fileName: `${safeId}-${Date.now()}.png`,
      mimeType: 'image/png',
      folder: 'categories',
    });

    return NextResponse.json({ url: stored.url, width: 128, height: 128, storage: stored.storage });
  } catch (error) {
    console.error('[category-icon] Failed to upload icon:', error);
    return NextResponse.json({ error: 'Icon upload failed. Please try again.' }, { status: 500 });
  }
}
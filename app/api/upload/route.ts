import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { can } from '@/lib/constants';
import { createMedia } from '@/lib/actions/media';
import { uploadMediaBuffer } from '@/lib/media-storage';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || !can(session.user.role, 'media.upload')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });
  if (file.size > MAX_UPLOAD_BYTES) {
    return NextResponse.json({ error: 'File must be under 10MB' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const stored = await uploadMediaBuffer({
    buffer,
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    folder: 'library',
  });

  await createMedia({
    name: file.name,
    url: stored.url,
    type: file.type.startsWith('image/') ? 'image' : 'file',
    mimeType: file.type,
    size: file.size,
  });

  return NextResponse.json({ url: stored.url, storage: stored.storage });
}
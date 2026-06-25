import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const resolvedParams = await params;
  const pathParts = resolvedParams.path;
  if (!pathParts || pathParts.length === 0) {
    return new NextResponse('Not Found', { status: 404 });
  }

  const filename = pathParts[pathParts.length - 1];
  
  // Extract the suffix after the first timestamp hyphen.
  // e.g. "1782326325367-1731635832.Job-7.webp" -> suffix is "1731635832.Job-7.webp"
  const match = filename.match(/^\d+-(.+)$/);
  const suffix = match ? match[1] : filename;

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  try {
    const files = await fs.readdir(uploadsDir);
    
    // Find a file in public/uploads that matches the suffix
    const matchingFile = files.find(f => {
      const fMatch = f.match(/^\d+-(.+)$/);
      const fSuffix = fMatch ? fMatch[1] : f;
      return fSuffix === suffix;
    });

    if (matchingFile) {
      const filePath = path.join(uploadsDir, matchingFile);
      const fileBuffer = await fs.readFile(filePath);
      
      let contentType = 'image/webp';
      if (matchingFile.endsWith('.png')) contentType = 'image/png';
      else if (matchingFile.endsWith('.jpg') || matchingFile.endsWith('.jpeg')) contentType = 'image/jpeg';
      else if (matchingFile.endsWith('.svg')) contentType = 'image/svg+xml';
      else if (matchingFile.endsWith('.gif')) contentType = 'image/gif';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }
  } catch (error) {
    console.error('Error in uploads fallback route:', error);
  }

  return new NextResponse('Not Found', { status: 404 });
}

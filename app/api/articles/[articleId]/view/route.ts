import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  VISITOR_COOKIE,
  newVisitorToken,
  recordArticleView,
  resolveVisitorKey,
} from '@/lib/article-view-tracking';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ articleId: string }> },
) {
  try {
    const { articleId } = await params;
    if (!articleId?.trim()) {
      return NextResponse.json({ error: 'Invalid article' }, { status: 400 });
    }

    const jar = await cookies();
    let token = jar.get(VISITOR_COOKIE)?.value;
    const isNewVisitor = !token?.trim();
    if (isNewVisitor) token = newVisitorToken();

    const referrer = request.headers.get('referer');
    const visitorKey = resolveVisitorKey(token);
    const result = await recordArticleView(articleId, visitorKey, referrer);

    const response = NextResponse.json({ ok: true, recorded: result.recorded });
    if (isNewVisitor && token) {
      response.cookies.set(VISITOR_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }
    return response;
  } catch (error) {
    console.error('Error recording article view:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
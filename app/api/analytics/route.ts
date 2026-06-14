import { NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/actions/settings';

export async function GET() {
  try {
    const data = await getAnalytics();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
}
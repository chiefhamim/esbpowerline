import { NextResponse } from 'next/server';
import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

export const dynamic = 'force-dynamic';

const execFileAsync = promisify(execFile);

export async function POST() {
  if (process.env.NODE_ENV === 'production' && !process.env.PETROBANGLA_SYNC_ENABLED) {
    return NextResponse.json({
      ok: true,
      message: 'Live week served from static cache in production',
    });
  }

  try {
    const script = path.join(process.cwd(), 'scripts', 'sync_petrobangla_live.py');
    const { stdout } = await execFileAsync('python', [script], { timeout: 120_000 });
    return NextResponse.json({ ok: true, message: stdout.trim() });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
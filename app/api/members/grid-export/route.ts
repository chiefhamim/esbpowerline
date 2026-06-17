import { NextResponse } from 'next/server';
import { getMemberSession } from '@/lib/member-session';
import prisma from '@/lib/prisma';

export async function GET() {
  const memberSession = await getMemberSession();
  if (!memberSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.memberDownload.create({
    data: {
      userId: memberSession.user.id,
      label: 'Grid snapshot (CSV)',
      fileUrl: '/api/members/grid-export',
    },
  });

  const csv = [
    'metric,value,unit,source,as_of',
    'Total Installed Capacity,28420,MW,BPDB,2026-06-13',
    'Current Generation,15230,MW,NLDC,2026-06-14',
    'Renewable Share,4.8,%,SREDA,2026-06-10',
    'System Loss,7.6,%,BPDB,2026-06-01',
    'Peak Demand (Est.),15680,MW,PGCB,2026-06-13',
  ].join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="esb-grid-snapshot.csv"',
    },
  });
}
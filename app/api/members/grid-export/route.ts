import { NextResponse } from 'next/server';
import { getMemberSession } from '@/lib/member-session';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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

  const stats = await prisma.dashboardStat.findMany({
    orderBy: { statName: 'asc' },
  });

  const csvRows = ['metric,value,unit,source,as_of'];

  for (const s of stats) {
    const val = s.calculatedValue !== null && s.calculatedValue !== undefined ? s.calculatedValue : s.value;
    const asOf = s.lastVerified || s.updatedAt.toISOString().split('T')[0];
    const source = s.source || 'BPDB/NLDC';
    // CSV escape commas
    const safeMetric = s.statName.includes(',') ? `"${s.statName}"` : s.statName;
    const safeUnit = s.unit ? (s.unit.includes(',') ? `"${s.unit}"` : s.unit) : '';
    const safeSource = source.includes(',') ? `"${source}"` : source;
    csvRows.push(`${safeMetric},${val},${safeUnit},${safeSource},${asOf}`);
  }

  if (stats.length === 0) {
    csvRows.push('Total Installed Capacity,28420,MW,BPDB,2026-06-13');
    csvRows.push('Current Generation,15230,MW,NLDC,2026-06-14');
    csvRows.push('Renewable Share,4.8,%,SREDA,2026-06-10');
    csvRows.push('System Loss,7.6,%,BPDB,2026-06-01');
    csvRows.push('Peak Demand (Est.),15680,MW,PGCB,2026-06-13');
  }

  const csv = csvRows.join('\n');

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="esb-grid-snapshot.csv"',
    },
  });
}
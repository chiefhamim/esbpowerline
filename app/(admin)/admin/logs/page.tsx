import { PageHeader } from '@/components/dashboard/PageHeader';
import prisma from '@/lib/prisma';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default async function AdminLogsPage() {
  const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' }, take: 50 });

  return (
    <div>
      <PageHeader title="Activity Logs" description="Audit trail of platform actions" />
      <div className="card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>User</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="font-mono text-xs">{log.type}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{log.userId ?? '—'}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-muted-foreground">No logs yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
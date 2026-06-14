import { AdminPageHeader, AdminTableShell } from '@/components/admin/AdminUI';
import prisma from '@/lib/prisma';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollText } from 'lucide-react';

export default async function AdminLogsPage() {
  const logs = await prisma.auditLog.findMany({ orderBy: { timestamp: 'desc' }, take: 50 });

  return (
    <div>
      <AdminPageHeader
        icon={ScrollText}
        title="Activity Logs"
        description="Audit trail of platform actions and system events."
      />
      <AdminTableShell>
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
                <TableCell className="text-muted-foreground whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-muted/60 border border-border/50">
                    {log.type}
                  </span>
                </TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell className="text-muted-foreground">{log.userId ?? '—'}</TableCell>
              </TableRow>
            ))}
            {logs.length === 0 && (
              <TableRow><TableCell colSpan={4} className="text-muted-foreground text-center py-8">No logs yet</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </AdminTableShell>
    </div>
  );
}
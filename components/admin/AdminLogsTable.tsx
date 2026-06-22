'use client';

import { AdminFormattedTime } from '@/components/admin/AdminFormattedTime';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type AdminLogRow = {
  id: string;
  type: string;
  message: string;
  timestamp: Date | string;
  userLabel: string;
};

export function AdminLogsTable({ logs }: { logs: AdminLogRow[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[160px]">Time</TableHead>
          <TableHead className="w-[110px] hidden sm:table-cell">Type</TableHead>
          <TableHead className="min-w-[240px]">Message</TableHead>
          <TableHead className="w-[140px] hidden md:table-cell">User</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log) => (
          <TableRow key={log.id}>
            <TableCell className="text-muted-foreground whitespace-nowrap text-[12px]">
              <AdminFormattedTime value={log.timestamp} />
            </TableCell>
            <TableCell className="hidden sm:table-cell">
              <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-muted/60 border border-border/50">
                {log.type}
              </span>
            </TableCell>
            <TableCell className="text-[13px] font-medium text-foreground/90">{log.message}</TableCell>
            <TableCell className="text-muted-foreground text-[12px] hidden md:table-cell">{log.userLabel}</TableCell>
          </TableRow>
        ))}
        {logs.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-muted-foreground text-center py-8">
              No logs yet
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
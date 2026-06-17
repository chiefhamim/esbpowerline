import { AdminPageHeader, AdminSectionStack, AdminTableShell } from '@/components/admin/AdminUI';
import { AdminForbidden } from '@/components/admin/AdminForbidden';
import { AdminLogsTable } from '@/components/admin/AdminLogsTable';
import { getAdminLogs } from '@/lib/actions/logs';
import { ScrollText } from 'lucide-react';

export default async function AdminLogsPage() {
  let logs: Awaited<ReturnType<typeof getAdminLogs>>;
  try {
    logs = await getAdminLogs();
  } catch {
    return (
      <AdminForbidden
        title="Activity logs restricted"
        description="Only Admins and Super Admins can view the audit trail."
      />
    );
  }

  return (
    <AdminSectionStack>
      <AdminPageHeader
        icon={ScrollText}
        title="Activity Logs"
        description="Audit trail of platform actions and system events."
      />
      <AdminTableShell>
        <AdminLogsTable logs={logs} />
      </AdminTableShell>
    </AdminSectionStack>
  );
}
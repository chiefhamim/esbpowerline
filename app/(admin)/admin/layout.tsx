import { AdminShell } from '@/components/admin/AdminShell';

export const metadata = { title: 'Admin Dashboard' };

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
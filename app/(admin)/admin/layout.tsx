import { DashboardShell } from '@/components/dashboard/DashboardShell';

export const metadata = { title: 'Admin Dashboard' };

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell variant="admin">{children}</DashboardShell>;
}
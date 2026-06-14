import { DashboardShell } from '@/components/dashboard/DashboardShell';

export const metadata = { title: 'CMS' };

export default function CMSDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell variant="cms">{children}</DashboardShell>;
}
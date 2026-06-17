import { CmsShell } from '@/components/cms/CmsShell';

export const metadata = { title: 'CMS' };

export default function CMSDashboardLayout({ children }: { children: React.ReactNode }) {
  return <CmsShell>{children}</CmsShell>;
}
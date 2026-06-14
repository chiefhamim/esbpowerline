import { AdminPageHeader } from '@/components/admin/AdminUI';
import { SettingsForm } from '@/components/admin/SettingsForm';
import { getSettings } from '@/lib/actions/settings';
import { Settings } from 'lucide-react';

export default async function AdminSettingsPage() {
  const settings = await getSettings();
  return (
    <div>
      <AdminPageHeader
        icon={Settings}
        title="Settings"
        description="Site configuration, SEO defaults, and homepage hero management."
      />
      <SettingsForm settings={settings} />
    </div>
  );
}
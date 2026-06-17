'use client';

import dynamic from 'next/dynamic';

export const PlatformControlLazy = dynamic(
  () => import('@/components/admin/PlatformControl').then((m) => m.PlatformControl),
  { ssr: false, loading: () => <span className="admin-platform-trigger-placeholder" aria-hidden /> },
);

export const EditorialPlatformControlLazy = dynamic(
  () => import('@/components/cms/EditorialPlatformControl').then((m) => m.EditorialPlatformControl),
  { ssr: false, loading: () => <span className="admin-platform-trigger-placeholder" aria-hidden /> },
);

export const StaffSignOutDialogLazy = dynamic(
  () => import('@/components/auth/StaffSignOutConfirmDialog').then((m) => m.StaffSignOutConfirmDialog),
  { ssr: false },
);

export const CmsWriteHeaderActionsLazy = dynamic(
  () => import('@/components/cms/CmsWriteHeaderActions').then((m) => m.CmsWriteHeaderActions),
  { ssr: false },
);

export const EditorSettingsMenuLazy = dynamic(
  () => import('@/components/cms/EditorSettingsMenu').then((m) => m.EditorSettingsMenu),
  { ssr: false, loading: () => <span className="admin-platform-trigger-placeholder" aria-hidden /> },
);
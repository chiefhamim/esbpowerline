/** Primary platform owner — shared by server bootstrap and staff login UI. */
export const MASTER_ADMIN_EMAIL = 'admin@esbpowerline.com';

export const MASTER_ADMIN_NAME = 'System Admin';

/** Sole editorial staff account — ESB PowerLine newsroom. */
export const EDITOR_NAME = 'Mehedi Hasan Hamim';
export const EDITOR_EMAIL = 'hamim2964@gmail.com';

export const RASEL_NAME = 'Sheikh Rasel';
export const RASEL_EMAIL = 'rasel@esbpowerline.com';

/** Legacy editor alias — migrated to EDITOR_EMAIL; used only for cleanup/migration. */
export const LEGACY_EDITOR_EMAIL = 'editor@esbpowerline.com';

/** Demo author accounts removed from production — delete if found. */
export const REMOVED_DEMO_AUTHOR_EMAILS = [
  LEGACY_EDITOR_EMAIL,
  'aminul@esbpowerline.com',
  'farhana@esbpowerline.com',
  'rafiq@esbpowerline.com',
  'nadia@esbpowerline.com',
  'mehedi@esbpowerline.com',
] as const;



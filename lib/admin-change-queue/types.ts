export type AdminChangeGroup = 'settings';

export type AdminPendingChange = {
  id: string;
  group: AdminChangeGroup;
  section: string;
  label: string;
  detail: string;
  page: string;
  createdAt: number;
  revert: () => void;
  collect?: () => Record<string, unknown>;
};

export type AdminLeaveAction = 'navigate' | 'signout' | 'reload';

export type AdminLeaveIntent = {
  action: AdminLeaveAction;
  href?: string;
};
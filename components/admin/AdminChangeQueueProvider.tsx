'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { signOutToPublicSite } from '@/lib/staff-sign-out';
import { saveAdminChangeGroup } from '@/lib/admin-change-queue/save-handlers';
import type { AdminLeaveIntent, AdminPendingChange } from '@/lib/admin-change-queue/types';

type UpsertInput = Omit<AdminPendingChange, 'createdAt'> & { createdAt?: number };

type AdminChangeQueueContextValue = {
  changes: AdminPendingChange[];
  count: number;
  hasChanges: boolean;
  saving: boolean;
  dockOpen: boolean;
  setDockOpen: (open: boolean) => void;
  upsertChange: (change: UpsertInput) => void;
  removeChange: (id: string) => void;
  discardAll: () => void;
  saveAll: () => Promise<boolean>;
  requestNavigation: (href: string) => void;
  requestSignOut: () => void;
  requestReload: () => void;
  leaveIntent: AdminLeaveIntent | null;
  resolveLeaveIntent: (choice: 'save' | 'discard' | 'cancel') => Promise<void>;
  leaveDialogOpen: boolean;
};

const AdminChangeQueueContext = createContext<AdminChangeQueueContextValue | null>(null);

export function AdminChangeQueueProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [changes, setChanges] = useState<AdminPendingChange[]>([]);
  const [saving, setSaving] = useState(false);
  const [dockOpen, setDockOpen] = useState(false);
  const [leaveIntent, setLeaveIntent] = useState<AdminLeaveIntent | null>(null);
  const changesRef = useRef(changes);
  changesRef.current = changes;

  const upsertChange = useCallback((change: UpsertInput) => {
    setChanges((prev) => {
      const next = prev.filter((item) => item.id !== change.id);
      next.push({
        ...change,
        createdAt: change.createdAt ?? Date.now(),
      });
      next.sort((a, b) => a.createdAt - b.createdAt);
      return next;
    });
  }, []);

  const removeChange = useCallback((id: string) => {
    setChanges((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target) return prev;
      target.revert();
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const discardAll = useCallback(() => {
    const toRevert = [...changesRef.current].reverse();
    setChanges([]);
    setDockOpen(false);
    toRevert.forEach((item) => item.revert());
  }, []);

  const saveAll = useCallback(async () => {
    const pending = changesRef.current;
    if (!pending.length) return true;

    setSaving(true);
    try {
      const groups = new Map<string, AdminPendingChange[]>();
      for (const change of pending) {
        const bucket = groups.get(change.group) ?? [];
        bucket.push(change);
        groups.set(change.group, bucket);
      }

      for (const [group, bucket] of groups) {
        await saveAdminChangeGroup(group as AdminPendingChange['group'], bucket);
      }

      setChanges([]);
      setDockOpen(false);
      toast.success(
        pending.length === 1
          ? '1 change saved'
          : `${pending.length} changes saved`,
      );
      router.refresh();
      return true;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to save changes');
      return false;
    } finally {
      setSaving(false);
    }
  }, [router]);

  const requestNavigation = useCallback((href: string) => {
    if (!changesRef.current.length) {
      router.push(href);
      return;
    }
    setLeaveIntent({ action: 'navigate', href });
  }, [router]);

  const requestSignOut = useCallback(() => {
    if (!changesRef.current.length) {
      void signOutToPublicSite();
      return;
    }
    setLeaveIntent({ action: 'signout' });
  }, []);

  const requestReload = useCallback(() => {
    if (!changesRef.current.length) {
      window.location.reload();
      return;
    }
    setLeaveIntent({ action: 'reload' });
  }, []);

  const resolveLeaveIntent = useCallback(async (choice: 'save' | 'discard' | 'cancel') => {
    const intent = leaveIntent;
    if (!intent || choice === 'cancel') {
      setLeaveIntent(null);
      return;
    }

    if (choice === 'discard') {
      discardAll();
    } else {
      const ok = await saveAll();
      if (!ok) return;
    }

    setLeaveIntent(null);

    if (intent.action === 'navigate' && intent.href) {
      router.push(intent.href);
    } else if (intent.action === 'signout') {
      void signOutToPublicSite();
    } else if (intent.action === 'reload') {
      window.location.reload();
    }
  }, [discardAll, leaveIntent, router, saveAll]);

  useEffect(() => {
    function onBeforeUnload(event: BeforeUnloadEvent) {
      if (!changesRef.current.length) return;
      event.preventDefault();
      event.returnValue = '';
    }

    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  const value = useMemo<AdminChangeQueueContextValue>(
    () => ({
      changes,
      count: changes.length,
      hasChanges: changes.length > 0,
      saving,
      dockOpen,
      setDockOpen,
      upsertChange,
      removeChange,
      discardAll,
      saveAll,
      requestNavigation,
      requestSignOut,
      requestReload,
      leaveIntent,
      resolveLeaveIntent,
      leaveDialogOpen: leaveIntent !== null,
    }),
    [
      changes,
      saving,
      dockOpen,
      upsertChange,
      removeChange,
      discardAll,
      saveAll,
      requestNavigation,
      requestSignOut,
      requestReload,
      leaveIntent,
      resolveLeaveIntent,
    ],
  );

  return (
    <AdminChangeQueueContext.Provider value={value}>
      {children}
    </AdminChangeQueueContext.Provider>
  );
}

export function useAdminChangeQueue() {
  const ctx = useContext(AdminChangeQueueContext);
  if (!ctx) {
    throw new Error('useAdminChangeQueue must be used within AdminChangeQueueProvider');
  }
  return ctx;
}

export function useAdminChangeQueueOptional() {
  return useContext(AdminChangeQueueContext);
}
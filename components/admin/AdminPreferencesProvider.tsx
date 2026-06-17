'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  ADMIN_TIME_FORMAT_STORAGE_KEY,
  readAdminTimeFormat,
  writeAdminTimeFormat,
  type AdminTimeFormat,
} from '@/lib/admin-time-format';

type AdminPreferencesContextValue = {
  timeFormat: AdminTimeFormat;
  setTimeFormat: (format: AdminTimeFormat) => void;
};

const AdminPreferencesContext = createContext<AdminPreferencesContextValue | null>(null);

export function AdminPreferencesProvider({ children }: { children: ReactNode }) {
  const [timeFormat, setTimeFormatState] = useState<AdminTimeFormat>('12');

  useEffect(() => {
    setTimeFormatState(readAdminTimeFormat());

    function onStorage(event: StorageEvent) {
      if (event.key === null || event.key === ADMIN_TIME_FORMAT_STORAGE_KEY) {
        setTimeFormatState(readAdminTimeFormat());
      }
    }

    function onCustom(event: Event) {
      const detail = (event as CustomEvent<AdminTimeFormat>).detail;
      if (detail === '12' || detail === '24') setTimeFormatState(detail);
    }

    window.addEventListener('storage', onStorage);
    window.addEventListener('admin-time-format-change', onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('admin-time-format-change', onCustom);
    };
  }, []);

  const setTimeFormat = useCallback((format: AdminTimeFormat) => {
    writeAdminTimeFormat(format);
    setTimeFormatState(format);
  }, []);

  const value = useMemo(
    () => ({ timeFormat, setTimeFormat }),
    [timeFormat, setTimeFormat],
  );

  return (
    <AdminPreferencesContext.Provider value={value}>
      {children}
    </AdminPreferencesContext.Provider>
  );
}

export function useAdminPreferences() {
  const ctx = useContext(AdminPreferencesContext);
  if (!ctx) {
    throw new Error('useAdminPreferences must be used within AdminPreferencesProvider');
  }
  return ctx;
}
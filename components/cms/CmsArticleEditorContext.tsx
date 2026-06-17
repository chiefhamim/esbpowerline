'use client';

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';

type SaveHandler = () => void | Promise<void>;

type CmsArticleEditorContextValue = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  registerSave: (handler: SaveHandler | null) => void;
  save: () => Promise<void>;
};

const CmsArticleEditorContext = createContext<CmsArticleEditorContextValue | null>(null);

export function CmsArticleEditorProvider({ children }: { children: ReactNode }) {
  const saveRef = useRef<SaveHandler | null>(null);
  const [loading, setLoading] = useState(false);

  const registerSave = useCallback((handler: SaveHandler | null) => {
    saveRef.current = handler;
  }, []);

  const save = useCallback(async () => {
    if (!saveRef.current) return;
    await saveRef.current();
  }, []);

  const value = useMemo(
    () => ({ loading, setLoading, registerSave, save }),
    [loading, registerSave, save],
  );

  return (
    <CmsArticleEditorContext.Provider value={value}>
      {children}
    </CmsArticleEditorContext.Provider>
  );
}

export function useCmsArticleEditor() {
  return useContext(CmsArticleEditorContext);
}
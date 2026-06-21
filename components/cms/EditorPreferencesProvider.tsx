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
  applyEditorGuidanceAttribute,
  clearEditorGuidanceAttribute,
  DEFAULT_EDITOR_PREFERENCES,
  readEditorPreferences,
  showEditorGuidanceHints,
  showEditorTooltips,
  writeEditorPreferences,
  type EditorClockFormat,
  type EditorGuidanceMode,
  type EditorPreferences,
} from '@/lib/editor-preferences';

type EditorPreferencesContextValue = {
  preferences: EditorPreferences;
  guidanceMode: EditorGuidanceMode;
  showTooltips: boolean;
  showGuidanceHints: boolean;
  setGuidanceMode: (mode: EditorGuidanceMode) => void;
  setStickyTipTapToolbar: (enabled: boolean) => void;
  setClockFormat: (format: EditorClockFormat) => void;
  updatePreferences: (patch: Partial<EditorPreferences>) => void;
};

const EditorPreferencesContext = createContext<EditorPreferencesContextValue | null>(null);

export function EditorPreferencesProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<EditorPreferences>(DEFAULT_EDITOR_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readEditorPreferences();
    setPreferences(stored);
    applyEditorGuidanceAttribute(stored.guidanceMode);
    setReady(true);
    return () => clearEditorGuidanceAttribute();
  }, []);

  const persist = useCallback((next: EditorPreferences) => {
    setPreferences(next);
    writeEditorPreferences(next);
    applyEditorGuidanceAttribute(next.guidanceMode);
  }, []);

  const updatePreferences = useCallback((patch: Partial<EditorPreferences>) => {
    setPreferences((prev) => {
      const next = { ...prev, ...patch };
      writeEditorPreferences(next);
      applyEditorGuidanceAttribute(next.guidanceMode);
      return next;
    });
  }, []);

  const value = useMemo<EditorPreferencesContextValue>(() => ({
    preferences,
    guidanceMode: preferences.guidanceMode,
    showTooltips: showEditorTooltips(preferences.guidanceMode),
    showGuidanceHints: showEditorGuidanceHints(preferences.guidanceMode),
    setGuidanceMode: (mode) => updatePreferences({ guidanceMode: mode }),
    setStickyTipTapToolbar: (enabled) => updatePreferences({ stickyTipTapToolbar: enabled }),
    setClockFormat: (format) => updatePreferences({ clockFormat: format }),
    updatePreferences,
  }), [preferences, updatePreferences]);

  if (!ready) {
    return (
      <EditorPreferencesContext.Provider value={value}>
        {children}
      </EditorPreferencesContext.Provider>
    );
  }

  return (
    <EditorPreferencesContext.Provider value={value}>
      {children}
    </EditorPreferencesContext.Provider>
  );
}

export function useEditorPreferences() {
  const ctx = useContext(EditorPreferencesContext);
  if (!ctx) {
    return {
      preferences: DEFAULT_EDITOR_PREFERENCES,
      guidanceMode: DEFAULT_EDITOR_PREFERENCES.guidanceMode,
      showTooltips: true,
      showGuidanceHints: true,
      setGuidanceMode: () => {},
      setStickyTipTapToolbar: () => {},
      setClockFormat: () => {},
      updatePreferences: () => {},
    } satisfies EditorPreferencesContextValue;
  }
  return ctx;
}
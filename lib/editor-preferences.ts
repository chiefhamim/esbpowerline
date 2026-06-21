export type EditorGuidanceMode = 'noob' | 'pro';
export type EditorClockFormat = '12' | '24';

export type EditorPreferences = {
  /** noob = tooltips, panel subtitles, and field hints; pro = headings only */
  guidanceMode: EditorGuidanceMode;
  /** Keep TipTap editor toolbar sticky at the top while writing */
  stickyTipTapToolbar: boolean;
  clockFormat: EditorClockFormat;
};

export const EDITOR_PREFERENCES_STORAGE_KEY = 'esb-editor-preferences';
export const EDITOR_CLOCK_FORMAT_KEY = 'cms-editor-clock-format';

export const DEFAULT_EDITOR_PREFERENCES: EditorPreferences = {
  guidanceMode: 'noob',
  stickyTipTapToolbar: true,
  clockFormat: '12',
};

export function showEditorTooltips(mode: EditorGuidanceMode) {
  return mode === 'noob';
}

export function showEditorGuidanceHints(mode: EditorGuidanceMode) {
  return mode === 'noob';
}

function normalizeClockFormat(value: unknown): EditorClockFormat {
  return value === '24' ? '24' : '12';
}

function normalizeGuidanceMode(value: unknown): EditorGuidanceMode {
  return value === 'pro' ? 'pro' : 'noob';
}

export function parseEditorPreferences(raw: unknown): EditorPreferences {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_EDITOR_PREFERENCES };
  const data = raw as any;
  
  // Gracefully handle legacy stickyAuthorByline preference if present
  const legacySticky = data.stickyAuthorByline;
  const stickyTipTapToolbar = data.stickyTipTapToolbar !== undefined
    ? !!data.stickyTipTapToolbar
    : (legacySticky !== undefined ? !!legacySticky : true);

  return {
    guidanceMode: normalizeGuidanceMode(data.guidanceMode),
    stickyTipTapToolbar,
    clockFormat: normalizeClockFormat(data.clockFormat),
  };
}

export function readEditorPreferences(): EditorPreferences {
  if (typeof window === 'undefined') return { ...DEFAULT_EDITOR_PREFERENCES };
  try {
    const raw = window.localStorage.getItem(EDITOR_PREFERENCES_STORAGE_KEY);
    if (!raw) {
      const legacyClock = window.localStorage.getItem(EDITOR_CLOCK_FORMAT_KEY);
      return {
        ...DEFAULT_EDITOR_PREFERENCES,
        clockFormat: normalizeClockFormat(legacyClock),
      };
    }
    return parseEditorPreferences(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_EDITOR_PREFERENCES };
  }
}

export function writeEditorPreferences(next: EditorPreferences) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify(next));
  window.localStorage.setItem(EDITOR_CLOCK_FORMAT_KEY, next.clockFormat);
}

export function applyEditorGuidanceAttribute(mode: EditorGuidanceMode) {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.editorGuidance = mode;
}

export function clearEditorGuidanceAttribute() {
  if (typeof document === 'undefined') return;
  delete document.documentElement.dataset.editorGuidance;
}
'use client';

import { useEditorPreferences } from '@/components/cms/EditorPreferencesProvider';
import {
  AdminDropdownBackdrop,
  AdminDropdownPanel,
  AdminDropdownTrigger,
  useAdminDropdown,
} from '@/components/admin/AdminDropdown';
import { Settings, ChevronDown, Check, HelpCircle, Clock, Pin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EditorSettingsMenuProps {
  variant?: 'header' | 'default';
}

export function EditorSettingsMenu({ variant = 'default' }: EditorSettingsMenuProps) {
  const { open, toggle, close } = useAdminDropdown();
  const {
    preferences,
    setGuidanceMode,
    setStickyAuthorByline,
    setClockFormat,
  } = useEditorPreferences();

  return (
    <div className="relative shrink-0">
      <AdminDropdownTrigger open={open} onClick={toggle} aria-label="Editor preferences">
        <Settings className="h-3.5 w-3.5 text-sky-400 shrink-0" />
        {variant === 'header' && <span className="admin-dropdown-trigger-label">Settings</span>}
        <ChevronDown className={cn('h-3 w-3 shrink-0 opacity-60 transition-transform duration-150', open && 'rotate-180')} />
      </AdminDropdownTrigger>

      {open && (
        <>
          <AdminDropdownBackdrop onClose={close} />
          <AdminDropdownPanel className="admin-platform-menu editorial-settings-menu min-w-[240px]">
            <div className="editorial-desk-menu__header border-b border-border/40 pb-3 mb-2 px-4 pt-3">
              <div>
                <div className="editorial-desk-menu__title font-semibold text-[13px] tracking-tight">Editor settings</div>
                <p className="editorial-desk-menu__subtitle text-[11px] text-muted-foreground">Customize your writing workspace</p>
              </div>
            </div>

            {/* Guidance Mode Section */}
            <div className="px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-sky-400 flex items-center gap-1.5 mb-1.5">
                <HelpCircle className="h-3 w-3" />
                Guidance Level
              </span>
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => setGuidanceMode('guided')}
                  className={cn(
                    'w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors hover:bg-muted/50',
                    preferences.guidanceMode === 'guided' && 'bg-sky-500/10 text-sky-400 font-medium'
                  )}
                >
                  <div className="flex flex-col">
                    <span>Guided</span>
                    <span className="text-[10px] opacity-75">Show hints, tooltips, and field help</span>
                  </div>
                  {preferences.guidanceMode === 'guided' && <Check className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setGuidanceMode('compact')}
                  className={cn(
                    'w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors hover:bg-muted/50',
                    preferences.guidanceMode === 'compact' && 'bg-sky-500/10 text-sky-400 font-medium'
                  )}
                >
                  <div className="flex flex-col">
                    <span>Compact</span>
                    <span className="text-[10px] opacity-75">Headings only, minimal chrome</span>
                  </div>
                  {preferences.guidanceMode === 'compact' && <Check className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            <div className="h-px bg-border/40 my-2 mx-3" />

            {/* Sticky Byline Toggle */}
            <div className="px-4 py-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-sky-400 flex items-center gap-1.5 mb-1.5">
                <Pin className="h-3 w-3" />
                Byline Behavior
              </span>
              <button
                type="button"
                onClick={() => setStickyAuthorByline(!preferences.stickyAuthorByline)}
                className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-col">
                  <span>Sticky author byline</span>
                  <span className="text-[10px] text-muted-foreground">Pin byline while writing</span>
                </div>
                <div className={cn(
                  'w-8 h-4 rounded-full p-0.5 transition-colors duration-200 focus:outline-none',
                  preferences.stickyAuthorByline ? 'bg-sky-500' : 'bg-muted'
                )}>
                  <div className={cn(
                    'w-3 h-3 rounded-full bg-white transition-transform duration-200',
                    preferences.stickyAuthorByline ? 'translate-x-4' : 'translate-x-0'
                  )} />
                </div>
              </button>
            </div>

            <div className="h-px bg-border/40 my-2 mx-3" />

            {/* Clock Format Section */}
            <div className="px-4 py-2 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-sky-400 flex items-center gap-1.5 mb-1.5">
                <Clock className="h-3 w-3" />
                Clock Format
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setClockFormat('12')}
                  className={cn(
                    'flex-1 text-center py-1 rounded-md text-xs border transition-all',
                    preferences.clockFormat === '12'
                      ? 'border-sky-500/50 bg-sky-500/10 text-sky-400 font-medium'
                      : 'border-border/60 hover:bg-muted/30 text-muted-foreground'
                  )}
                >
                  12-Hour
                </button>
                <button
                  type="button"
                  onClick={() => setClockFormat('24')}
                  className={cn(
                    'flex-1 text-center py-1 rounded-md text-xs border transition-all',
                    preferences.clockFormat === '24'
                      ? 'border-sky-500/50 bg-sky-500/10 text-sky-400 font-medium'
                      : 'border-border/60 hover:bg-muted/30 text-muted-foreground'
                  )}
                >
                  24-Hour
                </button>
              </div>
            </div>
          </AdminDropdownPanel>
        </>
      )}
    </div>
  );
}

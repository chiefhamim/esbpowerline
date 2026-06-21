'use client';

import { useState, useEffect, useTransition } from 'react';
import { User, Plus, X, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getStaffForCollaboration } from '@/lib/actions/users';
import { toast } from 'sonner';
import { slugify } from '@/lib/utils';

type StaffMember = {
  id: string;
  name: string;
  role: string;
  avatar: string | null;
};

type EditorCollaboratorsProps = {
  authorName: string;
  collaboratorIds: string[];
  onChange: (ids: string[]) => void;
  postAsNewsDesk?: boolean;
  onPostAsNewsDeskChange?: (val: boolean) => void;
  staff: StaffMember[];
  loading?: boolean;
};

export function EditorCollaborators({
  authorName,
  collaboratorIds,
  onChange,
  postAsNewsDesk = false,
  onPostAsNewsDeskChange,
  staff = [],
  loading = false,
}: EditorCollaboratorsProps) {
  const [open, setOpen] = useState(false);

  const toggleCollaborator = (id: string) => {
    if (collaboratorIds.includes(id)) {
      onChange(collaboratorIds.filter(c => c !== id));
    } else {
      onChange([...collaboratorIds, id]);
      toast.success('Collaborator added', {
        description: 'They can now co-edit this story in the editorial workspace.',
      });
    }
  };

  const selectedStaff = staff.filter(s => collaboratorIds.includes(s.id));

  return (
    <div className="flex items-center gap-3.5 flex-wrap mb-4 mt-2">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="article-author-sticky article-author-sticky--cms shrink-0" style={{ position: 'relative', margin: 0, bottom: 'auto' }}>
          <User className="article-author-sticky__icon" aria-hidden />
          <span className="article-author-sticky__label">By</span>
          <span className="article-author-sticky__name">{postAsNewsDesk ? 'ESB News Desk' : authorName}</span>
        </div>

        <label className="inline-flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-medium text-muted-foreground hover:text-foreground border border-border/40 bg-muted/10 px-2.5 py-1 rounded-full hover:bg-muted/20 transition-all shrink-0">
          <input
            type="checkbox"
            checked={postAsNewsDesk}
            onChange={(e) => onPostAsNewsDeskChange?.(e.target.checked)}
            className="rounded border-muted-foreground/30 text-sky-500 focus:ring-sky-500 h-3 w-3 shrink-0 cursor-pointer"
          />
          <span>Post as ESB News Desk</span>
        </label>
      </div>

      {selectedStaff.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1 rounded-full border border-border/40">
          <span>with:</span>
          <span className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer underline underline-offset-2">
            <a href={`/authors/${slugify(selectedStaff[0].name)}`} target="_blank" rel="noopener noreferrer">
              {selectedStaff[0].name}
            </a>
          </span>
          <button 
            type="button" 
            onClick={() => toggleCollaborator(selectedStaff[0].id)} 
            className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
            title="Remove editor"
          >
            <X className="h-3 w-3" />
          </button>
          
          {selectedStaff.length > 1 && (
            <span 
              className="bg-muted-foreground/10 px-1.5 py-0.5 rounded text-[10px] font-bold text-foreground cursor-help ml-1" 
              title={selectedStaff.slice(1).map(s => s.name).join(', ')}
            >
              +{selectedStaff.length - 1}
            </span>
          )}
        </div>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-[28px] text-[11px] rounded-full border-dashed gap-1.5 px-3">
            <Plus className="h-3 w-3" /> Add editor
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[240px] p-0" sideOffset={8}>
          <div className="px-3 py-2.5 border-b flex items-center gap-2 bg-muted/30">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Add Collaborator</span>
          </div>
          <div className="max-h-[280px] overflow-auto p-1.5">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : staff.length === 0 ? (
              <div className="text-sm text-center text-muted-foreground p-3">No available editors</div>
            ) : (
              staff.map(s => {
                const isSelected = collaboratorIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleCollaborator(s.id)}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 hover:bg-muted rounded-md text-left transition-colors"
                  >
                    <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium truncate leading-tight">{s.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.role}</span>
                    </div>
                    {isSelected && (
                      <X className="h-3 w-3 ml-auto text-muted-foreground" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

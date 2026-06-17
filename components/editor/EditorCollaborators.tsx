'use client';

import { useState, useEffect, useTransition } from 'react';
import { User, Plus, X, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getStaffForCollaboration } from '@/lib/actions/users';
import { toast } from 'sonner';

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
};

export function EditorCollaborators({ authorName, collaboratorIds, onChange }: EditorCollaboratorsProps) {
  const [open, setOpen] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open && staff.length === 0) {
      setLoading(true);
      startTransition(async () => {
        try {
          const data = await getStaffForCollaboration();
          setStaff(data);
        } catch (e) {
          toast.error('Failed to load editors');
        } finally {
          setLoading(false);
        }
      });
    }
  }, [open, staff.length]);

  const toggleCollaborator = (id: string) => {
    if (collaboratorIds.includes(id)) {
      onChange(collaboratorIds.filter(c => c !== id));
    } else {
      onChange([...collaboratorIds, id]);
      toast.success('Editor added for collaboration. Notification sent.');
      // In a full implementation, we'd fire an EditorialNotice here via a server action.
    }
  };

  const selectedStaff = staff.filter(s => collaboratorIds.includes(s.id));

  return (
    <div className="flex items-center gap-2 flex-wrap mb-4 mt-2">
      <div className="article-author-sticky article-author-sticky--cms" style={{ position: 'relative', margin: 0, bottom: 'auto' }}>
        <User className="article-author-sticky__icon" aria-hidden />
        <span className="article-author-sticky__label">By</span>
        <span className="article-author-sticky__name">{authorName}</span>
      </div>

      {selectedStaff.map(s => (
        <div key={s.id} className="article-author-sticky article-author-sticky--cms" style={{ position: 'relative', margin: 0, bottom: 'auto' }}>
          <User className="article-author-sticky__icon" aria-hidden />
          <span className="article-author-sticky__name">{s.name}</span>
          <button type="button" onClick={() => toggleCollaborator(s.id)} className="ml-1 text-muted-foreground hover:text-foreground">
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}

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

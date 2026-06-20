'use client';

import { useState, useTransition } from 'react';
import { useSession } from '@/utils/supabase/auth-context';
import { Settings, Lock, Mail, User, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { changeStaffPassword, updateProfile } from '@/lib/actions/profile';
import { MIN_PASSWORD_LENGTH } from '@/lib/password-policy';

export function UserProfileSettings({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { data: session, update } = useSession();
  const [name, setName] = useState(session?.user?.name ?? '');
  const [email, setEmail] = useState(session?.user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePending, startProfileTransition] = useTransition();
  const [passwordPending, startPasswordTransition] = useTransition();

  function handleProfileSave() {
    startProfileTransition(async () => {
      try {
        const result = await updateProfile({
          name: name !== session?.user?.name ? name : undefined,
          email: email !== session?.user?.email ? email : undefined,
        });

        if (result.requiresNameApproval) {
          toast.success('Profile updated. Name change requires admin approval.');
        } else {
          toast.success('Profile updated successfully');
        }

        await update();
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to update profile');
      }
    });
  }

  function handlePasswordSave() {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    startPasswordTransition(async () => {
      try {
        await changeStaffPassword({ currentPassword, newPassword });
        toast.success('Password updated — use your new password next time you sign in');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : 'Failed to update password');
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-sky-500" />
            Profile Settings
          </DialogTitle>
          <DialogDescription>
            Update your account details. Name changes may require admin approval.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-2">
          <div className="grid gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Profile</p>
            <div className="grid gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" /> Name
              </label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" /> Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={handleProfileSave} disabled={profilePending} size="sm">
                {profilePending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save profile
              </Button>
            </div>
          </div>

          <div className="border-t border-border/60 pt-4 grid gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</p>
            <div className="grid gap-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-muted-foreground" /> Current password
              </label>
              <Input
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">New password</label>
              <Input
                type="password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Confirm new password</label>
              <Input
                type="password"
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handlePasswordSave}
                disabled={passwordPending || !currentPassword || !newPassword}
                size="sm"
              >
                {passwordPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update password
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
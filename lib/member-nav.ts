import type { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  Bookmark,
  BookOpen,
  Download,
  MessageSquare,
  UserRound,
  BarChart3,
} from 'lucide-react';

export type MemberNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  description: string;
};

export const MEMBER_NAV: MemberNavItem[] = [
  {
    href: '/members',
    label: 'Overview',
    icon: LayoutDashboard,
    description: 'Your member home',
  },
  {
    href: '/members/saved',
    label: 'Saved',
    icon: Bookmark,
    description: 'Articles & issues you saved',
  },
  {
    href: '/members/magazine',
    label: 'Magazine',
    icon: BookOpen,
    description: 'Full archive & PDFs',
  },
  {
    href: '/members/downloads',
    label: 'Downloads',
    icon: Download,
    description: 'Data packages you fetched',
  },
  {
    href: '/members/subscription',
    label: 'Grid subscription',
    icon: BarChart3,
    description: 'Historical grid data plans',
  },
  {
    href: '/members/comments',
    label: 'Comments',
    icon: MessageSquare,
    description: 'Your discussion posts',
  },
  {
    href: '/members/account',
    label: 'Account',
    icon: UserRound,
    description: 'Profile & sign out',
  },
];
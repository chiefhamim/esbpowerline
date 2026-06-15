/**
 * ESB PowerLine — Shared Constants (ported from legacy datastore.js)
 * ROLES + PERMISSIONS + exact 10 Categories + Statuses
 * Used by auth, middleware, CMS, Admin, and seeding.
 */

export const ROLES = {
  SUPER_ADMIN: { name: 'Super Admin', level: 100, color: '#ff3b6f' },
  ADMIN:       { name: 'Admin',       level: 80,  color: '#8b5cf6' },
  EDITOR:      { name: 'Editor',      level: 60,  color: '#3b82f6' },
  AUTHOR:      { name: 'Author',      level: 40,  color: '#10b981' },
  CONTRIBUTOR: { name: 'Contributor', level: 20,  color: '#f59e0b' },
  SUBSCRIBER:  { name: 'Subscriber',  level: 5,   color: '#6b7280' },
} as const;

export type Role = keyof typeof ROLES;

export const PERMISSIONS: Record<string, number> = {
  // Article permissions
  'article.create':       10,
  'article.edit_own':     20,
  'article.edit_any':     60,
  'article.delete_own':   40,
  'article.delete_any':   80,
  'article.publish':      40,
  'article.feature':      60,
  'article.breaking':     60,

  // Media
  'media.upload':         20,
  'media.delete_own':     40,
  'media.delete_any':     80,

  // Comments
  'comment.moderate_own': 40,
  'comment.moderate_any': 60,
  'comment.delete_any':   80,

  // Users
  'user.view':            60,
  'user.create':          80,
  'user.edit':            80,
  'user.delete':          100,
  'user.change_role':     100,

  // Settings / Admin
  'settings.view':        80,
  'settings.edit':        80,
  'logs.view':            80,

  // Categories
  'category.manage':      60,

  // Analytics
  'analytics.view_own':   20,
  'analytics.view_all':   60,

  // Ads
  'ads.manage':           80,
};

// Exact legacy categories (preserve verbatim for content parity)
export const CATEGORIES = [
  'Power Generation',
  'Renewable Energy',
  'LNG & Gas',
  'Nuclear Energy',
  'Grid & Transmission',
  'Energy Policy',
  'Rural Electrification',
  'Energy Efficiency',
  'International',
  'Market & Finance',
] as const;

export const ARTICLE_STATUSES = ['published', 'draft', 'scheduled', 'archived', 'trash'] as const;

export function can(userRole: Role | undefined, action: string): boolean {
  if (!userRole) return false;
  const roleLevel = ROLES[userRole]?.level ?? 0;
  const required = PERMISSIONS[action] ?? 100;
  return roleLevel >= required;
}

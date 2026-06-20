import { describe, it, expect } from 'vitest';
import { resolveEditorialAuthorScope } from '@/lib/editorial-scope';

describe('resolveEditorialAuthorScope', () => {
  it('forces authors to their own author id', () => {
    const author = { id: 'author-1', role: 'AUTHOR' as const };
    expect(resolveEditorialAuthorScope(author)).toBe('author-1');
    expect(resolveEditorialAuthorScope(author, 'author-1')).toBe('author-1');
  });

  it('blocks authors from querying another author', () => {
    const author = { id: 'author-1', role: 'AUTHOR' as const };
    expect(() => resolveEditorialAuthorScope(author, 'other-author')).toThrow('Forbidden');
  });

  it('allows reviewers to query any author when specified', () => {
    const admin = { id: 'admin-1', role: 'SUPER_ADMIN' as const };
    expect(resolveEditorialAuthorScope(admin, 'author-9')).toBe('author-9');
    expect(resolveEditorialAuthorScope(admin)).toBeUndefined();
  });

  it('allows editors with review permission to see all authors', () => {
    const editor = { id: 'editor-1', role: 'EDITOR' as const };
    expect(resolveEditorialAuthorScope(editor, 'author-9')).toBe('author-9');
    expect(resolveEditorialAuthorScope(editor)).toBeUndefined();
  });
});
-- Run once in Supabase Dashboard → SQL Editor

alter table "Article" enable row level security;

-- Public can view published articles
drop policy if exists "Public view published articles" on "Article";
create policy "Public view published articles"
  on "Article" for select
  to public
  using (status = 'PUBLISHED');

-- Staff can view all articles (drafts, scheduled, etc.)
drop policy if exists "Staff view all articles" on "Article";
create policy "Staff view all articles"
  on "Article" for select
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('CONTRIBUTOR', 'AUTHOR', 'EDITOR', 'ADMIN', 'SUPER_ADMIN')
  );

-- Insert requires article.create (CONTRIBUTOR, AUTHOR, EDITOR, ADMIN, SUPER_ADMIN)
-- Safe-guard: Non-admins can only insert as themselves.
drop policy if exists "Staff insert articles" on "Article";
create policy "Staff insert articles"
  on "Article" for insert
  to authenticated
  with check (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('ADMIN', 'SUPER_ADMIN')
    or (
      (auth.jwt() -> 'app_metadata' ->> 'role') in ('CONTRIBUTOR', 'AUTHOR', 'EDITOR')
      and exists (
        select 1 from "User" u 
        where u."supabaseUserId" = auth.uid()::text 
        and u.id = "authorId"
      )
    )
  );

-- Update requires article.edit_any (ADMIN, SUPER_ADMIN) OR article.edit_own + ownership
drop policy if exists "Staff update articles" on "Article";
create policy "Staff update articles"
  on "Article" for update
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('ADMIN', 'SUPER_ADMIN')
    or (
      (auth.jwt() -> 'app_metadata' ->> 'role') in ('CONTRIBUTOR', 'AUTHOR', 'EDITOR')
      and exists (
        select 1 from "User" u 
        where u."supabaseUserId" = auth.uid()::text 
        and u.id = "authorId"
      )
    )
  );

-- Delete strictly requires Admin/Super Admin
drop policy if exists "Admin delete articles" on "Article";
create policy "Admin delete articles"
  on "Article" for delete
  to authenticated
  using (
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('ADMIN', 'SUPER_ADMIN')
  );

-- ============================================================================
-- FIELD-LEVEL PERMISSION TRIGGER (BEFORE UPDATE)
-- ============================================================================
-- Direct REST API calls by the client could bypass server-side Next.js route logic.
-- This trigger blocks illicit updates to sensitive fields (status, isFeatured, isBreaking)
-- if the user lacks the specific permission, even if they own the article.

CREATE OR REPLACE FUNCTION enforce_article_field_permissions()
RETURNS TRIGGER AS $$
DECLARE
  v_role text;
BEGIN
  v_role := auth.jwt() -> 'app_metadata' ->> 'role';
  
  -- If user is Super Admin or Admin, bypass checks (they have all permissions)
  IF v_role IN ('SUPER_ADMIN', 'ADMIN') THEN
    RETURN NEW;
  END IF;

  -- 1. Check article.publish (Required: AUTHOR or EDITOR)
  -- If status is changing to or from PUBLISHED/SCHEDULED, they need publish permission.
  IF (OLD.status IS DISTINCT FROM NEW.status) AND (NEW.status IN ('PUBLISHED', 'SCHEDULED') OR OLD.status IN ('PUBLISHED', 'SCHEDULED')) THEN
    IF v_role NOT IN ('AUTHOR', 'EDITOR') THEN
      RAISE EXCEPTION 'Role % does not have article.publish permission', v_role;
    END IF;
  END IF;

  -- 2. Check article.feature (Required: EDITOR)
  IF (OLD."isFeatured" IS DISTINCT FROM NEW."isFeatured" OR OLD."isPinned" IS DISTINCT FROM NEW."isPinned") THEN
    IF v_role NOT IN ('EDITOR') THEN
      RAISE EXCEPTION 'Role % does not have article.feature permission', v_role;
    END IF;
  END IF;

  -- 3. Check article.breaking (Required: EDITOR)
  IF (OLD."isBreaking" IS DISTINCT FROM NEW."isBreaking") THEN
    IF v_role NOT IN ('EDITOR') THEN
      RAISE EXCEPTION 'Role % does not have article.breaking permission', v_role;
    END IF;
  END IF;

  -- 4. Check article.delete_any for TRASH updates (Soft-delete)
  -- The app layer soft-deletes by setting status = 'TRASH'.
  -- article.delete_own (AUTHOR+) applies if they own it.
  IF (OLD.status IS DISTINCT FROM NEW.status AND NEW.status = 'TRASH') THEN
    IF v_role = 'CONTRIBUTOR' THEN
      RAISE EXCEPTION 'Role CONTRIBUTOR does not have article.delete_own permission';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_enforce_article_field_permissions ON "Article";
CREATE TRIGGER trg_enforce_article_field_permissions
  BEFORE UPDATE ON "Article"
  FOR EACH ROW
  EXECUTE FUNCTION enforce_article_field_permissions();

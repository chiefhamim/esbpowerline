# Security Remediation — ESB PowerLine

> **Status:** Manual steps required — do NOT skip any item.
>
> **Background:** `.env` and `dev.db` were committed before `.gitignore`
> rules existed. Although they are now ignored and untracked, their
> contents **remain in git history** and any secrets they contained must
> be considered compromised.

---

## 1. Rotate all exposed secrets

Every value that was ever present in the committed `.env` or referenced
by `dev.db` must be rotated **before** purging history (so the old values
are dead even if someone already cloned the repo).

- [ ] **Supabase service role key** — Supabase Dashboard → Settings → API → Service Role Key → regenerate.
- [ ] **DATABASE_URL** (Supabase / Neon pooler password) — reset the password in your database provider and update Vercel env vars.
- [ ] **DIRECT_URL** (direct DB connection password) — same provider, same reset.
- [ ] **AUTH_SECRET** — generate a new value: `openssl rand -base64 32`. Update in Vercel env vars.
- [ ] **MASTER_ADMIN_PASSWORD** — change in Vercel env vars and anywhere it is stored.
- [ ] **SEED_DEMO_PASSWORD** — change in Vercel env vars (if set) and in any local `.env` files.
- [ ] **CRON_SECRET** — regenerate and update in Vercel env vars + any cron job configurations.

After rotating, redeploy on Vercel so the new values take effect.

---

## 2. Purge `.env` and `dev.db` from git history

> ⚠️ **This rewrites shared history.** Coordinate with your team first.
> Everyone must re-clone or `git fetch --all && git reset --hard origin/main`
> after the force-push.

### Prerequisites

```bash
# Install git-filter-repo (one-time)
pip install git-filter-repo
```

### Run the purge

```bash
# From the repo root:
git filter-repo --path .env --path dev.db --invert-paths

# Force-push all branches:
git push origin --force --all

# Force-push all tags:
git push origin --force --tags
```

### Post-purge verification

```bash
# Confirm the files no longer appear anywhere in history:
git log --all --full-history -- .env dev.db
# Should return no output.
```

---

## 3. Enable GitHub Secret Scanning + Push Protection

1. Go to your repository on GitHub.
2. Navigate to **Settings → Code security and analysis**.
3. Enable:
   - [ ] **Secret scanning** — detects committed secrets in current and historical code.
   - [ ] **Push protection** — blocks pushes that contain recognised secret patterns.

---

## 4. Post-remediation verification checklist

- [ ] `git ls-files | grep -E "\.env$|dev\.db"` returns only `.env.example`.
- [ ] `git log --all --full-history -- .env dev.db` returns nothing (history purged).
- [ ] All rotated secrets work in production (test login, DB access, cron jobs).
- [ ] GitHub Secret Scanning shows no active alerts.
- [ ] All team members have re-cloned or hard-reset their local repos.
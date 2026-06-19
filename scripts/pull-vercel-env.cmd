@echo off
REM Pull production env from Vercel into .env.production.local (requires: vercel login)
cd /d "%~dp0.."
echo Pulling Vercel production env to .env.production.local ...
call npx vercel env pull .env.production.local --environment=production --yes
if errorlevel 1 (
  echo.
  echo Failed. Run: npx vercel login
  echo Then link the project: npx vercel link
  exit /b 1
)
echo Done. Review .env.production.local then run: npm run bootstrap:prod
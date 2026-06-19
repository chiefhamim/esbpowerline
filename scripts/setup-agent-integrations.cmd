@echo off
REM One-time setup: MCP (OAuth) + local CLIs. No secrets written to git.
cd /d "%~dp0.."
echo.
echo === 1. Register Vercel + Supabase MCP with your coding agents ===
echo     (OAuth in browser — no tokens in repo)
call npx add-mcp https://mcp.vercel.com -y 2>nul
call npx add-mcp "https://mcp.supabase.com/mcp?project_ref=sxgokpmrbgdndstygapc" -y 2>nul
echo.
echo === 2. Cursor: Settings ^> Tools ^& MCP — click "Needs login" for Vercel and Supabase ===
echo === 3. Grok: run /mcps and authenticate each server ===
echo.
echo === 4. Optional CLI (after vercel login): npm run env:pull ===
echo.
pause
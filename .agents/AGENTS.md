# Rules

- If the user says "follow sauce" (where "sauce" is a file name reference in the workspace, or if there is a file named "sauce" / "sauce.md" / "sauce.txt" etc.):
  1. Start the development servers.
  2. Update the dependencies and libraries (`npm update` or relevant package manager commands).
  3. Update the codebase with the latest libraries if any.
  4. Start the Vercel CLI (`vercel dev` or other vercel command as needed).
  5. Start the Supabase CLI if it is used in the project.
  6. Connect MCP if any are configured.
  7. Once these steps are completed, say exactly: "sauce is sauced, waiting for next command, Sire!"

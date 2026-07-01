/**
 * Client hook: triggers server refresh of Petrobangla live week cache.
 * Hot PDF parsing runs on the server via sync script (Desktop paths).
 */
export async function refreshPetrobanglaLiveWeek(): Promise<{ ok: boolean; message?: string }> {
  try {
    const res = await fetch('/api/petrobangla/refresh', { method: 'POST' });
    if (!res.ok) {
      return { ok: false, message: await res.text() };
    }
    return (await res.json()) as { ok: boolean; message?: string };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : 'refresh failed' };
  }
}
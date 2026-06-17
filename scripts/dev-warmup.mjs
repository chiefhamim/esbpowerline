#!/usr/bin/env node
/**
 * Pre-compile critical routes after `npm run dev:all` starts.
 * Split-surface dev runs three Next instances — first navigation per port can take minutes.
 */

const SURFACES = [
  {
    name: 'public',
    port: 3000,
    paths: ['/', '/api/auth/session', '/login', '/members'],
  },
  {
    name: 'cms',
    port: 3001,
    paths: ['/cms', '/cms/articles/new', '/api/auth/session'],
  },
  {
    name: 'admin',
    port: 3002,
    paths: ['/admin', '/api/auth/session'],
  },
];

const PORT_TIMEOUT_MS = 180_000;
const PATH_TIMEOUT_MS = 300_000;
const POLL_MS = 5_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function probePort(port) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60_000);
  try {
    const res = await fetch(`http://127.0.0.1:${port}/`, {
      signal: controller.signal,
      redirect: 'manual',
    });
    return res.status > 0;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function waitForPort(port, label) {
  const started = Date.now();
  process.stdout.write(`[warmup] waiting for ${label} (:${port})`);
  while (Date.now() - started < PORT_TIMEOUT_MS) {
    if (await probePort(port)) {
      process.stdout.write(' ready\n');
      return true;
    }
    process.stdout.write('.');
    await sleep(POLL_MS);
  }
  process.stdout.write(' timed out\n');
  return false;
}

async function warmPath(port, path) {
  const url = `http://127.0.0.1:${port}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PATH_TIMEOUT_MS);
  const started = Date.now();
  try {
    const res = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      redirect: 'manual',
      headers: { 'x-dev-warmup': '1' },
    });
    const elapsed = ((Date.now() - started) / 1000).toFixed(1);
    console.log(`[warmup] :${port}${path} → ${res.status} (${elapsed}s)`);
    return true;
  } catch (error) {
    const elapsed = ((Date.now() - started) / 1000).toFixed(1);
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[warmup] :${port}${path} failed after ${elapsed}s — ${message}`);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  console.log('[warmup] compiling split-surface routes (first load can take a few minutes)…');

  const ready = [];
  for (const surface of SURFACES) {
    if (await waitForPort(surface.port, surface.name)) {
      ready.push(surface);
    }
  }

  if (!ready.length) {
    console.warn('[warmup] no dev servers responded — skipping');
    process.exit(0);
  }

  for (const surface of ready) {
    for (const path of surface.paths) {
      await warmPath(surface.port, path);
    }
  }

  console.log('[warmup] done — staff panels should load without long skeleton waits');
}

main().catch((error) => {
  console.error('[warmup] fatal', error);
  process.exit(1);
});
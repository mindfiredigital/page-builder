import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DEFAULT_PAGE_DIR } from './schema.js';

export interface ServeLock {
  pid: number;
  port: number;
  page: string;
  startedAt: string;
}

/* One fixed location per directory — always .pagectl/serve.json, regardless
   of which page file is being served — so "is anything running here" is a
   single, predictable question `status` (or a human) can always ask. */
export function serveLockPath(): string {
  return resolve(DEFAULT_PAGE_DIR, 'serve.json');
}

function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

/** Returns the lock only if it's real — a lock left behind by a process
    that crashed without cleaning up is treated as absent, not as "still
    running", so it never permanently blocks a fresh `serve`. */
export function readLiveServeLock(): ServeLock | null {
  const lockPath = serveLockPath();
  if (!existsSync(lockPath)) return null;

  let lock: ServeLock;
  try {
    lock = JSON.parse(readFileSync(lockPath, 'utf8'));
  } catch {
    return null;
  }

  return isProcessAlive(lock.pid) ? lock : null;
}

export function writeServeLock(lock: ServeLock): void {
  const lockPath = serveLockPath();
  mkdirSync(resolve(DEFAULT_PAGE_DIR), { recursive: true });
  writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n', 'utf8');
}

export function removeServeLock(): void {
  try {
    rmSync(serveLockPath(), { force: true });
  } catch {
    /* best-effort cleanup — a leftover lock just gets treated as stale next time */
  }
}

import { existsSync, readFileSync } from 'node:fs';
import { getBlocks, pageSchema } from '../schema.js';
import { emitResult, resolvePagePath, type BaseFlags } from '../cliRuntime.js';
import { readLiveServeLock } from '../serveLock.js';

export interface StatusOptions extends BaseFlags {
  page?: string;
}

/** Read-only self-orientation, same reflex as "git status" — an agent (or
    a human) unsure what's already here runs this first instead of
    guessing a filename or inventing a new page next to one that already
    exists and might have a live `serve` tab open on it. */
export function statusCommand(options: StatusOptions): void {
  const { path } = resolvePagePath(options.page);

  let exists = false;
  let blockCount: number | null = null;
  if (existsSync(path)) {
    exists = true;
    try {
      const parsed = pageSchema.safeParse(JSON.parse(readFileSync(path, 'utf8')));
      if (parsed.success) blockCount = getBlocks(parsed.data).length;
    } catch {
      /* leave blockCount null — validate reports the real problem */
    }
  }

  const lock = readLiveServeLock();

  const data = {
    page: { path, exists, blockCount },
    serve: lock ? { running: true, pid: lock.pid, port: lock.port, page: lock.page, startedAt: lock.startedAt } : { running: false },
  };

  emitResult(!!options.json, data, () => {
    console.log(`Page: ${path}${exists ? ` (${blockCount ?? '?'} block(s))` : ' (does not exist yet)'}`);
    if (lock) {
      console.log(`Serve: running at http://localhost:${lock.port} (pid ${lock.pid}), watching ${lock.page}`);
    } else {
      console.log('Serve: not running');
    }
  });
}

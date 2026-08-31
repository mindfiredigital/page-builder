import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { existsSync, readFileSync, watch } from 'node:fs';
import { pageSchema, makeCanvasRoot, type Block } from '../schema.js';
import { resolvePagePath, writePageFileAtomic } from '../cliRuntime.js';
import { readLiveServeLock, removeServeLock, writeServeLock } from '../serveLock.js';

export interface ServeCommandOptions {
  port?: string;
}

function readDesignFile(filePath: string): Block[] {
  if (!existsSync(filePath)) {
    const blank = [makeCanvasRoot()];
    writePageFileAtomic(filePath, blank);
    return blank;
  }
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

/** Tries `startPort`, and if something else already holds it, walks up to
    `maxAttempts` following ports instead of just crashing — "open on 4321,
    or the next free one" rather than a hard failure over a busy default. */
function listenWithFallback(server: import('node:http').Server, startPort: number, maxAttempts = 20): Promise<number> {
  return new Promise((resolvePromise, reject) => {
    let attempt = 0;

    const tryPort = (port: number): void => {
      const onError = (err: NodeJS.ErrnoException): void => {
        server.removeListener('listening', onListening);
        if (err.code === 'EADDRINUSE' && attempt < maxAttempts) {
          attempt++;
          tryPort(port + 1);
          return;
        }
        reject(err);
      };
      const onListening = (): void => {
        server.removeListener('error', onError);
        resolvePromise(port);
      };

      server.once('error', onError);
      server.once('listening', onListening);
      server.listen(port);
    };

    tryPort(startPort);
  });
}

function readJSONBody(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolvePromise, reject) => {
    let data = '';
    req.on('data', chunk => (data += chunk));
    req.on('end', () => {
      try {
        resolvePromise(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
}

export async function serveCommand(designFile: string | undefined, options: ServeCommandOptions): Promise<void> {
  const { path: filePath } = resolvePagePath(designFile);
  const port = Number(options.port ?? 4321);

  const existingLock = readLiveServeLock();
  if (existingLock) {
    console.error(
      `A pagectl serve session is already running in this directory (pid ${existingLock.pid}, port ${existingLock.port}, page ${existingLock.page}).`
    );
    console.error(`Run "pagectl status" to check, or stop that process first.`);
    process.exitCode = 2;
    return;
  }

  let currentDesign = readDesignFile(filePath);
  const sseClients = new Set<ServerResponse>();

  function broadcast(design: unknown[]): void {
    const payload = `data: ${JSON.stringify(design)}\n\n`;
    for (const res of sseClients) res.write(payload);
  }

  /* add-block/update-block/remove-block/reorder-block write straight to
     filePath — without watching, a serve session already running would go
     stale the moment the agent used one of those instead of curling
     /design directly. Debounced: an atomic write (temp file + rename)
     still fires fs.watch more than once for a single logical change. */
  let watchTimer: NodeJS.Timeout | null = null;
  watch(filePath, () => {
    if (watchTimer) clearTimeout(watchTimer);
    watchTimer = setTimeout(() => {
      if (!existsSync(filePath)) return;
      let next: unknown;
      try {
        next = JSON.parse(readFileSync(filePath, 'utf8'));
      } catch {
        return; // transient partial read — next debounced tick will retry
      }
      const parsed = pageSchema.safeParse(next);
      if (!parsed.success) return;

      currentDesign = parsed.data;
      broadcast(currentDesign);
      console.error(`[serve] ${filePath} changed on disk (${currentDesign.length} components), pushed to ${sseClients.size} open tab(s)`);
    }, 50);
  });

  const { bundleLibrary } = await import('../serve/bundleLibrary.js');
  const { buildHarnessPage } = await import('../serve/harnessPage.js');

  console.error('Bundling page-builder for the browser (one-time, no headless browser involved)...');
  const { js, css } = await bundleLibrary();
  const harnessHTML = buildHarnessPage();

  const server = createServer(async (req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(harnessHTML);
      return;
    }

    if (req.url === '/bundle.js') {
      res.writeHead(200, { 'Content-Type': 'text/javascript' });
      res.end(js);
      return;
    }

    if (req.url === '/bundle.css') {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      res.end(css);
      return;
    }

    if (req.url === '/events') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });
      res.write('\n');
      sseClients.add(res);
      req.on('close', () => sseClients.delete(res));
      return;
    }

    if (req.url === '/design' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(currentDesign));
      return;
    }

    if (req.url === '/design' && req.method === 'POST') {
      let body: unknown;
      try {
        body = await readJSONBody(req);
      } catch {
        res.writeHead(400);
        res.end('Invalid JSON');
        return;
      }

      const parsed = pageSchema.safeParse(body);
      if (!parsed.success) {
        res.writeHead(422, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ errors: parsed.error.issues }));
        return;
      }

      currentDesign = parsed.data;
      writePageFileAtomic(filePath, currentDesign);
      broadcast(currentDesign);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true, componentCount: currentDesign.length }));
      console.error(`[serve] ${filePath} updated via POST /design (${currentDesign.length} components), pushed to ${sseClients.size} open tab(s)`);
      return;
    }

    res.writeHead(404);
    res.end('Not found');
  });

  let actualPort: number;
  try {
    actualPort = await listenWithFallback(server, port);
  } catch (err) {
    console.error(`Could not bind to port ${port} or any port after it: ${(err as Error).message}`);
    process.exitCode = 5;
    return;
  }

  writeServeLock({ pid: process.pid, port: actualPort, page: filePath, startedAt: new Date().toISOString() });

  if (actualPort !== port) {
    console.error(`Port ${port} was already in use — serving on ${actualPort} instead.`);
  }
  console.error(`\npagectl serve running at http://localhost:${actualPort}`);
  console.error(`Persistent storage: ${filePath}`);
  console.error(`File changes from add-block/update-block/remove-block/reorder-block are picked up live.`);
  console.error(`Or push edits directly with:`);
  console.error(`  curl -X POST http://localhost:${actualPort}/design -H "Content-Type: application/json" -d @your-design.json`);
  console.error(`Restarting this command re-reads ${filePath} — state is not lost.\n`);

  const shutdown = (): void => {
    removeServeLock();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', removeServeLock);
}

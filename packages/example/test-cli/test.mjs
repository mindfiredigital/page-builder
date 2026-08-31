// Smoke test for pagectl — exercises plan.md Step 13's happy path and edge
// cases against a real `workspace:*` install of @mindfiredigital/page-builder-cli,
// the same way an external consumer would use it.
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const CLI_ENTRY = require.resolve('@mindfiredigital/page-builder-cli');

let passed = 0;
let failed = 0;

function check(label, condition) {
  if (condition) {
    passed++;
    console.log(`  ok  - ${label}`);
  } else {
    failed++;
    console.error(`FAIL  - ${label}`);
  }
}

function pagectl(args, opts = {}) {
  const result = spawnSync(process.execPath, [CLI_ENTRY, ...args], {
    cwd: opts.cwd ?? workdir,
    encoding: 'utf8',
    timeout: opts.timeout ?? 10_000,
  });
  let data = null;
  try {
    data = JSON.parse((result.stdout || '').trim());
  } catch {
    /* not every path emits JSON (e.g. serve's human logs) */
  }
  return { code: result.status, stdout: result.stdout, stderr: result.stderr, data };
}

const workdir = mkdtempSync(join(tmpdir(), 'pagectl-smoke-'));
console.log(`Workdir: ${workdir}`);

try {
  console.log('\n== happy path: new -> add-block x N (auto-flow + anchors) -> inspect -> validate -> build ==');
  let r = pagectl(['new', 'demo', '--json']);
  check('new creates page, exit 0', r.code === 0 && r.data.data.status === 'created');

  r = pagectl(['add-block', '--page', 'demo.page.json', '--type', 'header', '--id', 'title', '--content', 'Welcome', '--json']);
  check('add-block auto-flow header, exit 0', r.code === 0 && r.data.data.status === 'created');

  r = pagectl(['add-block', '--page', 'demo.page.json', '--type', 'text', '--id', 'body', '--content', 'Body copy', '--json']);
  check('add-block auto-flow text, exit 0', r.code === 0 && r.data.data.status === 'created');

  r = pagectl(['add-block', '--page', 'demo.page.json', '--type', 'button', '--id', 'cta', '--content', 'Go', '--below', 'body', '--align', 'right', '--json']);
  check('add-block --below anchor, exit 0', r.code === 0 && r.data.data.status === 'created');

  r = pagectl(['inspect', '--page', 'demo.page.json', '--json']);
  check('inspect lists 3 blocks', r.code === 0 && r.data.data.blocks.length === 3);

  r = pagectl(['validate', '--page', 'demo.page.json', '--json']);
  check('validate reports valid (no overlaps)', r.code === 0 && r.data.data.valid === true);

  r = pagectl(['build', '--page', 'demo.page.json', '--out', 'out', '--json']);
  check('build exits 0', r.code === 0 && r.data.data.status === 'built');
  check('build writes index.html', existsSync(join(workdir, 'out', 'index.html')));
  check('build writes styles.css', existsSync(join(workdir, 'out', 'styles.css')));

  console.log('\n== idempotency ==');
  r = pagectl(['add-block', '--page', 'demo.page.json', '--type', 'header', '--id', 'title', '--content', 'Welcome', '--json']);
  check('same id + same content -> no-op, exit 0', r.code === 0 && r.data.data.status === 'already-exists');

  r = pagectl(['add-block', '--page', 'demo.page.json', '--type', 'header', '--id', 'title', '--content', 'Changed', '--json']);
  check('same id + different content -> clear error, exit 2', r.code === 2 && !!r.data.error);
  check('...error points at update-block', r.data.fix.includes('update-block'));

  console.log('\n== missing anchor ==');
  r = pagectl(['add-block', '--page', 'demo.page.json', '--type', 'text', '--id', 'ghost', '--below', 'nope', '--json']);
  check('missing anchor -> exit 4', r.code === 4);

  console.log('\n== overlap detection ==');
  r = pagectl(['add-block', '--page', 'demo.page.json', '--type', 'text', '--id', 'overlapper', '--x', '0', '--y', '0', '--json']);
  check('explicit overlap onto header placed', r.code === 0);
  r = pagectl(['validate', '--page', 'demo.page.json', '--json']);
  check('overlap -> invalid, exit 2', r.code === 2 && r.data.data.valid === false);
  check('overlap issue carries a fix hint', r.data.data.issues.some(i => i.kind === 'overlap' && i.fix.length > 0));
  r = pagectl(['remove-block', '--page', 'demo.page.json', '--id', 'overlapper', '--json']);
  check('cleanup: remove-block ok', r.code === 0);

  console.log('\n== --no-input + missing required flag ==');
  r = pagectl(['add-block', '--page', 'demo.page.json', '--no-input', '--json'], { timeout: 5000 });
  check('missing --type/--id -> exit 2, no hang', r.code === 2);

  console.log('\n== update-block --left repeated past the canvas edge ==');
  // cta's starting x depends on its --below/--align anchor placement above;
  // loop generously so it's guaranteed to hit x=0 and then clamp regardless
  // of where it started.
  let last;
  for (let i = 0; i < 40; i++) {
    last = pagectl(['update-block', '--page', 'demo.page.json', '--id', 'cta', '--left', '--json']);
  }
  check('repeated --left clamps, never negative', last.code === 0 && last.data.data.box.x >= 0);
  check('...and reports clamped-no-change once flush against the edge', last.data.data.status === 'clamped-no-change');

  console.log('\n== remove-block then inspect ==');
  const before = pagectl(['inspect', '--page', 'demo.page.json', '--json']).data.data.blocks.map(b => b.id);
  r = pagectl(['remove-block', '--page', 'demo.page.json', '--id', 'body', '--json']);
  check('remove-block exit 0', r.code === 0);
  const after = pagectl(['inspect', '--page', 'demo.page.json', '--json']).data.data.blocks.map(b => b.id);
  check('block gone', !after.includes('body'));
  check('other blocks unaffected', before.filter(id => id !== 'body').every(id => after.includes(id)));

  console.log('\n== typo\'d --page surfaces the real sibling instead of silently inventing a new one ==');
  r = pagectl(['add-block', '--page', 'demoo.page.json', '--type', 'header', '--id', 'oops', '--json']);
  check('typo -> not-found, exit 4', r.code === 4);
  check('...fix hint names the real sibling file', r.data.fix.includes('demo.page.json'));
  check('typo never created a stray file', !existsSync(join(workdir, 'demoo.page.json')));

  console.log('\n== default page file (no --page anywhere) ==');
  const defaultDir = join(workdir, 'default-page-test');
  mkdirSync(defaultDir, { recursive: true });
  r = pagectl(['add-block', '--type', 'header', '--id', 'h1', '--content', 'Hi', '--json'], { cwd: defaultDir });
  check('add-block with no --page auto-creates .pagectl/page.json', r.code === 0 && r.data.data.status === 'created');
  check('...and writes to .pagectl/page.json specifically', existsSync(join(defaultDir, '.pagectl', 'page.json')));

  r = pagectl(['add-block', '--type', 'text', '--id', 'h2', '--content', 'again', '--below', 'h1', '--json'], { cwd: defaultDir });
  check('a second no --page call lands on the SAME default file', r.code === 0);

  r = pagectl(['inspect', '--json'], { cwd: defaultDir });
  check('inspect with no --page sees both blocks from the default file', r.code === 0 && r.data.data.blocks.length === 2);

  r = pagectl(['status', '--json'], { cwd: defaultDir });
  check('status reports the default page exists with the right block count', r.code === 0 && r.data.data.page.exists && r.data.data.page.blockCount === 2);
  check('status reports no serve session running yet', r.data.data.serve.running === false);

  console.log('\n== serve running + a plain add-block call while it is up ==');
  const port = 4700 + Math.floor(Math.random() * 200);
  const { spawn } = await import('node:child_process');
  const server = spawn(process.execPath, [CLI_ENTRY, 'serve', 'demo.page.json', '--port', String(port)], {
    cwd: workdir,
    stdio: 'ignore',
  });

  // Poll instead of a blind sleep — esbuild's first cold-start bundle can
  // occasionally take well over a second on a busy machine.
  async function waitForServe(timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      try {
        const res = await fetch(`http://localhost:${port}/design`);
        if (res.ok) return true;
      } catch {
        /* not listening yet */
      }
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    return false;
  }

  const serveUp = await waitForServe(15_000);
  check('serve comes up and answers GET /design', serveUp);

  pagectl(['add-block', '--page', 'demo.page.json', '--type', 'text', '--id', 'live', '--content', 'pushed live', '--json']);

  await new Promise(resolve => setTimeout(resolve, 500));

  let liveDesign = [];
  try {
    const res = await fetch(`http://localhost:${port}/design`);
    liveDesign = await res.json();
  } catch (err) {
    console.error(`  (could not reach serve: ${err.message})`);
  }
  check('serve picks up the file write live', liveDesign.some(b => b.id === 'live'));

  r = pagectl(['status', '--page', 'demo.page.json', '--json']);
  check('status reports serve running with the right port while it is up', r.code === 0 && r.data.data.serve.running && r.data.data.serve.port === port);

  const secondServeAttempt = spawnSync(process.execPath, [CLI_ENTRY, 'serve', 'demo.page.json', '--port', String(port + 1)], {
    cwd: workdir,
    encoding: 'utf8',
    timeout: 5000,
  });
  check('a second serve in the same directory refuses instead of double-starting', secondServeAttempt.status !== 0);

  // Wait for the process to actually exit (fs.watch holds a directory
  // handle on Windows) before cleanup, or the recursive rmSync below can
  // hit EPERM/EBUSY on a still-open handle.
  await new Promise(resolve => {
    server.once('exit', resolve);
    server.kill();
    setTimeout(resolve, 2000);
  });
} finally {
  rmSync(workdir, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);

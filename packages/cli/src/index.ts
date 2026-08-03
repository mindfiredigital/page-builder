import { Command } from 'commander';
import { runCommand } from './cliRuntime.js';
import { schemaCommand } from './commands/schema.js';
import { statusCommand } from './commands/status.js';
import { listBlocksCommand } from './commands/listBlocks.js';
import { newCommand } from './commands/new.js';
import { addBlockCommand } from './commands/addBlock.js';
import { updateBlockCommand } from './commands/updateBlock.js';
import { removeBlockCommand } from './commands/removeBlock.js';
import { reorderBlockCommand } from './commands/reorderBlock.js';
import { inspectCommand } from './commands/inspect.js';
import { validateCommand } from './commands/validate.js';
import { buildCommand } from './commands/build.js';
import { serveCommand } from './commands/serve.js';
import { setCanvasCommand } from './commands/setCanvas.js';

const program = new Command();

function collect(value: string, previous: string[]): string[] {
  return [...previous, value];
}

program
  .name('pagectl')
  .description(
    'Scriptable, self-describing CLI for @mindfiredigital/page-builder pages. ' +
      'v1 covers flat, top-level, absolute-mode pages (text/header/button/container/image). ' +
      'Run "pagectl schema" for the full machine-readable command tree.'
  )
  .version('1.0.0');

program
  .command('schema')
  .description('Print the machine-readable command tree, canvas info, block palette, and every flag enum.')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action(options => runCommand(!!options.json, () => schemaCommand(options)));

program
  .command('status')
  .description('Report the default (or given) page file\'s existence/block count, and whether a "serve" session is already running.')
  .option('--page <file>', 'page JSON file (default: .pagectl/page.json)')
  .option('--json', 'emit structured JSON')
  .action(options => runCommand(!!options.json, () => statusCommand(options)));

program
  .command('list-blocks')
  .description('Print the block palette and defaults.')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action(options => runCommand(!!options.json, () => listBlocksCommand(options)));

program
  .command('new <slug>')
  .description('Explicitly create an additional, separately named page (not needed for the common single-page case — add-block etc. auto-create the default page).')
  .option('-o, --out <path>', 'output file path (default: <slug>.page.json)')
  .option('--force', 'overwrite an existing page file with a blank canvas')
  .option('--dry-run', 'compute and report without writing')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action((slug, options) => runCommand(!!options.json, () => newCommand(slug, options)));

program
  .command('add-block')
  .description('Add a block to the default (or given) page, auto-creating it if needed. Default placement is auto-flow.')
  .option('--page <file>', 'page JSON file (default: .pagectl/page.json, auto-created on first use)')
  .option('--type <type>', 'block type: text|header|button|container|image')
  .option('--id <id>', 'unique block id')
  .option('--content <text>', 'block text content')
  .option('--src <url>', 'image URL (--type image only)')
  .option('--style <kv>', 'CSS style as key=value (repeatable)', collect, [])
  .option('--class <name>', 'extra CSS class (repeatable)', collect, [])
  .option('--raw-content', 'use --content verbatim instead of auto-wrapping it')
  .option('--width <n>', 'override the type default width')
  .option('--height <n>', 'override the type default height')
  .option('--below <id>', 'anchor: place below this block id')
  .option('--right-of <id>', 'anchor: place to the right of this block id')
  .option('--align <value>', 'left|center|right, used with --below', 'left')
  .option('--gap <n>', 'override the CLI default gap for anchor placement')
  .option('--x <n>', 'explicit x (escape hatch; requires --y)')
  .option('--y <n>', 'explicit y (escape hatch; requires --x)')
  .option('--parent <id>', 'not supported in v1 — always refused, out of scope')
  .option('--dry-run', 'compute and report without writing')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action(options => runCommand(!!options.json, () => addBlockCommand(options)));

program
  .command('update-block')
  .description('Nudge a block one grid step, jump to an explicit --x/--y, resize it, and/or fix its content/style/class.')
  .option('--page <file>', 'page JSON file (default: .pagectl/page.json, auto-created on first use)')
  .option('--id <id>', 'block id')
  .option('--left', 'nudge left one grid step')
  .option('--right', 'nudge right one grid step')
  .option('--up', 'nudge up one grid step')
  .option('--down', 'nudge down one grid step')
  .option('--x <n>', 'explicit x (escape hatch for a large move; requires --y)')
  .option('--y <n>', 'explicit y (escape hatch for a large move; requires --x)')
  .option('--width <n>', 'resize: new width in px (independent of --height)')
  .option('--height <n>', 'resize: new height in px (independent of --width)')
  .option('--content <text>', 'new text content')
  .option('--src <url>', 'new image URL (image blocks only)')
  .option('--style <kv>', 'CSS style as key=value (repeatable)', collect, [])
  .option('--class <name>', 'extra CSS class (repeatable)', collect, [])
  .option('--raw-content', 'use --content verbatim instead of auto-wrapping it')
  .option('--dry-run', 'compute and report without writing')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action(options => runCommand(!!options.json, () => updateBlockCommand(options)));

program
  .command('remove-block')
  .description('Remove a block from a page.')
  .option('--page <file>', 'page JSON file (default: .pagectl/page.json, auto-created on first use)')
  .option('--id <id>', 'block id')
  .option('--dry-run', 'compute and report without writing')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action(options => runCommand(!!options.json, () => removeBlockCommand(options)));

program
  .command('reorder-block')
  .description('Change a block\'s array order (auto-flow order / z-order), not its position.')
  .option('--page <file>', 'page JSON file (default: .pagectl/page.json, auto-created on first use)')
  .option('--id <id>', 'block id to move')
  .option('--before <id>', 'move before this block id')
  .option('--after <id>', 'move after this block id')
  .option('--dry-run', 'compute and report without writing')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action(options => runCommand(!!options.json, () => reorderBlockCommand(options)));

program
  .command('inspect')
  .description('Print canvas info, next auto-flow y, and every block\'s box.')
  .option('--page <file>', 'page JSON file (default: .pagectl/page.json, auto-created on first use)')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action(options => runCommand(!!options.json, () => inspectCommand(options)));

program
  .command('validate')
  .description('Schema + scope + overlap + out-of-bounds + stale-inlineStyle checks, each with a fix hint.')
  .option('--page <file>', 'page JSON file (default: .pagectl/page.json, auto-created on first use)')
  .option('--fix', 'auto-repair blocks whose inlineStyle has drifted from position/dimensions/style')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action(options => runCommand(!!options.json, () => validateCommand(options)));

program
  .command('build')
  .description('Rough static HTML/CSS export for shipping/inspection (NOT a preview of the real editor — use "serve" for that).')
  .option('--page <file>', 'page JSON file (default: .pagectl/page.json, auto-created on first use)')
  .option('-o, --out <dir>', 'output directory (default: pagectl-output)')
  .option('--dry-run', 'compute and report without writing')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action(options => runCommand(!!options.json, () => buildCommand(options)));

program
  .command('set-canvas')
  .description('Set style on the page\'s canvas root (e.g. a page background color) without adding a block that would overlap everything else.')
  .option('--page <file>', 'page JSON file (default: .pagectl/page.json, auto-created on first use)')
  .option('--style <kv>', 'CSS style as key=value (repeatable)', collect, [])
  .option('--dry-run', 'compute and report without writing')
  .option('--json', 'emit structured JSON')
  .option('--no-input', 'fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)')
  .action(options => runCommand(!!options.json, () => setCanvasCommand(options)));

program
  .command('serve [file]')
  .description('Serve the real page-builder editor backed by the default (or given) page file; watches it on disk for live updates. Refuses to double-start in the same directory.')
  .option('-p, --port <port>', 'port to try first; falls back to the next free port if taken', '4321')
  .action(async (file, options) => {
    await serveCommand(file, options);
  });

/* Even a malformed command line (unknown flag, missing subcommand) must
   still honor the --json contract on stdout, not Commander's own
   stderr-and-exit(1) — "always on stdout, always valid single-line JSON,
   including on crashes". We can't know which subcommand's --json applies,
   so we scan the raw argv for --json before Commander gets a chance to
   fail. */
const wantsJson = process.argv.includes('--json');
program.exitOverride();

try {
  await program.parseAsync(process.argv);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  const code = (err as { exitCode?: number }).exitCode ?? 2;
  if (code === 0) process.exit(0);

  if (wantsJson) {
    process.stdout.write(
      JSON.stringify({ error: message, fix: 'Run "pagectl schema" for the full command tree and flag list.' }) + '\n'
    );
  } else {
    console.error(`Error: ${message}`);
  }
  process.exitCode = 2;
}

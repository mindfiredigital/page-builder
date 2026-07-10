import { ALIGN_VALUES, BLOCKS, BLOCK_TYPES, CANVAS, DEFAULT_PAGE_DIR, DEFAULT_PAGE_FILENAME, DIRECTION_VALUES } from '../schema.js';
import { emitResult, type BaseFlags } from '../cliRuntime.js';

/* Machine-readable command tree, canvas info, block palette, and every
   flag's full enum of valid values — the agent should never have to guess
   a valid flag value any more than it guesses a coordinate. */
export function schemaCommand(options: BaseFlags): void {
  const data = {
    binary: 'pagectl',
    scope: {
      description: 'v1 covers flat, top-level, absolute-mode pages using text/header/button/container blocks only.',
      outOfScope: ['grid-mode pages', 'nested containers', 'image', 'video', 'table', 'richtext', 'link', 'twoCol', 'threeCol', 'landingpage', 'multi-page projects'],
    },
    workflow: {
      afterEditingBlocks:
        'Once the user\'s blocks are added/edited and "validate" passes, ALWAYS run "pagectl serve" next so the user can see the live result in a browser — do this by default, without asking permission first. Starting a local dev server is not a risky or optional action here; it is the expected last step of building a page. If unsure whether one is already running, check "pagectl status" first (it reports the pid/port) rather than skipping serve or guessing.',
      whenServeIsAlreadyRunning:
        'If "pagectl status" shows a serve session already running, do not start a second one (it will refuse anyway) — just tell the user the existing URL from status\'s "serve.port", and keep editing via add-block/update-block as normal; the open tab updates live.',
      doNotDoThis:
        'Do NOT run "pagectl build" as a way to show the user their page, and do NOT describe it as a preview. Its static HTML/CSS output does not resemble the real editor and is template-based, not pixel-accurate. Only run "build" if the user explicitly asks to export/ship static files.',
    },
    defaultPage: {
      path: `${DEFAULT_PAGE_DIR}/${DEFAULT_PAGE_FILENAME}`,
      description:
        'Every command that takes --page falls back to this one file (relative to the current directory) when --page is omitted. It is auto-created on first use. Use this by default — only pass --page for a deliberately separate, named page (see "new"). This means an agent given zero file-naming instructions always converges on the same file as everything else, including "serve".',
    },
    canvas: CANVAS,
    blockTypes: BLOCK_TYPES,
    blocks: BLOCK_TYPES.map(type => ({
      type,
      defaultWidth: BLOCKS[type].defaultWidth,
      defaultHeight: BLOCKS[type].defaultHeight,
      baseClass: BLOCKS[type].baseClass,
      requiresTextSpan: BLOCKS[type].requiresTextSpan,
    })),
    enums: {
      align: ALIGN_VALUES,
      direction: DIRECTION_VALUES,
      blockType: BLOCK_TYPES,
    },
    exitCodes: { ok: 0, badInput: 2, auth: 3, notFound: 4, transient: 5 },
    globalFlags: {
      '--json': 'Emit {"schema":"1","data":...} on success or {"error":"...","fix":"..."} on failure, always one line on stdout.',
      '--dry-run': 'Compute and report the result without writing the page file.',
      '--force': 'Overwrite guard escape hatch (currently used by "new").',
      '--no-input': 'Fail fast with a fix hint instead of prompting — pagectl never prompts, so this is always the effective behavior.',
    },
    commands: [
      {
        name: 'schema',
        usage: 'pagectl schema [--json]',
        description: 'Print this command tree.',
      },
      {
        name: 'status',
        usage: 'pagectl status [--page <file>] [--json]',
        description:
          'Read-only self-orientation, same reflex as "git status": reports whether the (default or given) page file exists and its block count, and whether a "serve" session is currently running (and on what port/watching which file). Run this first in an unfamiliar directory instead of guessing.',
      },
      {
        name: 'list-blocks',
        usage: 'pagectl list-blocks [--json]',
        description: 'Print the block palette and defaults.',
      },
      {
        name: 'new',
        usage: 'pagectl new <slug> [--out <path>] [--force] [--dry-run] [--json]',
        description:
          'Explicitly create an additional, separately named page (not needed for the common single-page case — add-block/etc. auto-create the default page on first use). Idempotent: same slug + same content -> no-op exit 0; different content -> exit 2 unless --force; new slug -> created exit 0. Output carries a "note" field (non-blocking) if other *.page.json files already exist in the directory.',
      },
      {
        name: 'add-block',
        usage:
          'pagectl add-block [--page <file>] --type <type> --id <id> [--content <text>] [--style k=v]... [--class <name>]... [--raw-content] [--width <n>] [--height <n>] [--below <id> | --right-of <id> | --x <n> --y <n>] [--align left|center|right] [--gap <n>] [--dry-run] [--json]',
        description:
          'Add a block to the default page (or --page if given), auto-creating that page file if it does not exist yet. Default placement is auto-flow (no coordinates needed); --align applies even without --below (left/center/right against the full canvas width). Idempotent on identical retry ("already-exists", exit 0); different content on the same --id is a distinct error directing you to update-block, exit 2. Missing anchor id -> exit 4. Nesting inside a container is refused (out of scope).',
      },
      {
        name: 'update-block',
        usage:
          'pagectl update-block [--page <file>] --id <id> [--left | --right | --up | --down] [--x <n> --y <n>] [--content <text>] [--style k=v]... [--class <name>]... [--raw-content] [--dry-run] [--json]',
        description:
          'Move one grid step in a direction (repeat the call for "a lot"; every call clamps to canvas bounds, snaps to grid, and echoes the new box — "clamped-no-change" if already at an edge), OR jump straight to an explicit --x/--y (escape hatch for a large move, instead of many repeated direction calls or deleting and re-adding the block) — not both in the same call. Either can be combined with --content/--style/--class.',
      },
      {
        name: 'remove-block',
        usage: 'pagectl remove-block [--page <file>] --id <id> [--dry-run] [--json]',
        description: 'Remove a block. Missing id -> exit 4. Does not reflow other blocks.',
      },
      {
        name: 'reorder-block',
        usage: 'pagectl reorder-block [--page <file>] --id <id> (--before <id> | --after <id>) [--dry-run] [--json]',
        description: 'Change array order only (affects auto-flow/z-order), not position. Missing id -> exit 4.',
      },
      {
        name: 'inspect',
        usage: 'pagectl inspect [--page <file>] [--json]',
        description: 'Print the resolved page path, canvas info, next auto-flow y, and every block\'s box.',
      },
      {
        name: 'validate',
        usage: 'pagectl validate [--page <file>] [--fix] [--json]',
        description:
          'Schema validity + scope + overlap + out-of-bounds + stale-inlineStyle checks, each with a fix hint. Exit 2 on any issue. --fix auto-repairs blocks whose inlineStyle drifted from position/dimensions/style (e.g. written by a pagectl build predating that fix) — other issue kinds still need an explicit update-block/remove-block call.',
      },
      {
        name: 'build',
        usage: 'pagectl build [--page <file>] [--out <dir>] [--dry-run] [--json]',
        description:
          'DO NOT use this to show the user their page — it is a rough static HTML/CSS export (template-based, no headless browser, real core CSS linked verbatim) for explicit shipping/download requests only. It is NOT a preview, is not pixel-accurate, and must not be described as one. Use "serve" to show the user anything.',
      },
      {
        name: 'serve',
        usage: 'pagectl serve [file] [--port <n>]',
        description:
          'The correct way to show the user their page — serves the real page-builder editor UI backed by the default page file (or the given one), and watches it on disk so add-block/update-block/remove-block/reorder-block reflect live in the open browser tab. Run this by default after editing blocks, without waiting to be asked (see "workflow" above). POST /design also accepted. Tries --port (default 4321) and falls back to the next free port if it\'s taken — always tell the user the actual port from stderr or "status", never assume 4321. Refuses to start a second session in the same directory while one is already running (check "status" first).',
      },
    ],
  };

  emitResult(!!options.json, data, () => {
    console.log(JSON.stringify(data, null, 2));
  });
}

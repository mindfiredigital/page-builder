#!/usr/bin/env node
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/serve/bundleLibrary.ts
var bundleLibrary_exports = {};
__export(bundleLibrary_exports, {
  bundleLibrary: () => bundleLibrary
});
import { build } from "esbuild";
import { dirname as dirname3, resolve as resolve5 } from "node:path";
import { fileURLToPath } from "node:url";
async function bundleLibrary() {
  if (cached)
    return cached;
  const entry = resolve5(__dirname, "libraryEntry.ts");
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: "iife",
    platform: "browser",
    target: "es2019",
    outdir: resolve5(__dirname, ".virtual-out"),
    logLevel: "silent",
    /* web-component/core declare "sideEffects": false for tree-shaking
       consumers; we import purely for the customElements.define() side
       effect, so keep it despite that hint. */
    ignoreAnnotations: true
  });
  let js = "";
  let css = "";
  for (const file of result.outputFiles ?? []) {
    if (file.path.endsWith(".css"))
      css += file.text;
    else
      js += file.text;
  }
  if (!js) {
    throw new Error("esbuild produced no JS output while bundling the library.");
  }
  cached = { js, css };
  return cached;
}
var __dirname, cached;
var init_bundleLibrary = __esm({
  "src/serve/bundleLibrary.ts"() {
    "use strict";
    __dirname = dirname3(fileURLToPath(import.meta.url));
    cached = null;
  }
});

// src/serve/harnessPage.ts
var harnessPage_exports = {};
__export(harnessPage_exports, {
  buildHarnessPage: () => buildHarnessPage
});
function buildHarnessPage() {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>pagebuilder serve</title>
<link rel="stylesheet" href="/bundle.css" />
<style>
  #pb-status {
    padding: 6px 12px;
    background: #111;
    color: #0f0;
    font-family: monospace;
    font-size: 12px;
  }
</style>
</head>
<body>
<div id="pb-status">connecting...</div>
<page-builder id="pb"></page-builder>
<script src="/bundle.js"></script>
<script>
  const pb = document.getElementById('pb');
  const statusEl = document.getElementById('pb-status');

  // layoutMode is a JS property, not an HTML attribute, and the underlying
  // PageBuilder core defaults to 'grid' when it's left unset \u2014 which
  // silently breaks pagectl's absolute x/y positions in the live preview.
  // pagectl v1 is absolute-mode only; pin it before anything initializes.
  pb.layoutMode = 'absolute';

  fetch('/design')
    .then(r => r.json())
    .then(design => {
      pb.initialDesign = design;
      pb.configData = { Basic: [], Extra: [], Custom: [] };
    });

  const source = new EventSource('/events');
  source.onopen = () => (statusEl.textContent = 'live \u2014 connected to sidecar');
  source.onmessage = event => {
    const design = JSON.parse(event.data);
    if (pb.generateOutput) {
      try {
        pb.applyDesign(design);
      } catch {
        /* not initialized yet \u2014 fall back to (re)setting initialDesign */
        pb.initialDesign = design;
        pb.configData = { Basic: [], Extra: [], Custom: [] };
      }
    }
    statusEl.textContent = 'updated at ' + new Date().toLocaleTimeString();
  };
  source.onerror = () => (statusEl.textContent = 'disconnected from sidecar');
</script>
</body>
</html>`;
}
var init_harnessPage = __esm({
  "src/serve/harnessPage.ts"() {
    "use strict";
  }
});

// src/index.ts
import { Command } from "commander";

// src/cliRuntime.ts
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";

// src/schema.ts
import { z } from "zod";
var CANVAS = {
  width: 1200,
  height: 800,
  gap: 24,
  grid: 8,
  nudgeStep: 8
};
var DEFAULT_PAGE_DIR = ".pagectl";
var DEFAULT_PAGE_FILENAME = "page.json";
var BLOCK_TYPES = ["text", "header", "button", "container"];
var ALIGN_VALUES = ["left", "center", "right"];
var DIRECTION_VALUES = ["left", "right", "up", "down"];
function isBlockType(type) {
  return BLOCK_TYPES.includes(type);
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function wrapTextSpan(text) {
  return `<span class="component-text-content" contenteditable="true">${escapeHtml(text)}</span>`;
}
var TEXT_CONTENT_SPAN_RE = /class="[^"]*\bcomponent-text-content\b[^"]*"/;
function hasTextSpan(html) {
  return TEXT_CONTENT_SPAN_RE.test(html);
}
var BLOCKS = {
  text: {
    type: "text",
    label: "Text",
    defaultWidth: 300,
    defaultHeight: 50,
    baseClass: "text-component",
    requiresTextSpan: true,
    defaultText: "Sample Text",
    defaultContent: (text = "Sample Text") => wrapTextSpan(text)
  },
  header: {
    type: "header",
    label: "Header",
    defaultWidth: 400,
    defaultHeight: 60,
    baseClass: "header-component",
    requiresTextSpan: true,
    defaultText: "Header",
    defaultContent: (text = "Header") => wrapTextSpan(text)
  },
  button: {
    type: "button",
    label: "Button",
    defaultWidth: 160,
    defaultHeight: 48,
    baseClass: "button-component",
    requiresTextSpan: false,
    defaultText: "Click Me",
    defaultContent: (text = "Click Me") => escapeHtml(text)
  },
  container: {
    type: "container",
    label: "Container",
    defaultWidth: 300,
    defaultHeight: 200,
    baseClass: "container-component",
    requiresTextSpan: false,
    defaultContent: () => ""
  }
};
var WRAP_METRICS = {
  header: { lineHeight: 32, avgCharWidth: 25 },
  text: { lineHeight: 24, avgCharWidth: 14 }
};
var WRAP_PADDING = 16;
function estimateWrappedHeight(type, text, width, minHeight) {
  const metrics = WRAP_METRICS[type];
  if (!metrics || !text)
    return minHeight;
  const usableWidth = Math.max(width - WRAP_PADDING, 40);
  const charsPerLine = Math.max(Math.floor(usableWidth / metrics.avgCharWidth), 1);
  const lines = Math.max(Math.ceil(text.length / charsPerLine), 1);
  const estimated = lines * metrics.lineHeight + WRAP_PADDING;
  return Math.max(minHeight, estimated);
}
var blockSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  content: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  dimensions: z.object({ width: z.number(), height: z.number() }),
  style: z.record(z.string()).default({}),
  inlineStyle: z.string().default(""),
  classes: z.array(z.string()).default([]),
  dataAttributes: z.record(z.string()).default({}),
  imageSrc: z.string().nullable().optional(),
  videoSrc: z.string().nullable().optional(),
  props: z.record(z.unknown()).optional()
});
var pageSchema = z.array(blockSchema).min(1);
function makeCanvasRoot() {
  return {
    id: "canvas",
    type: "canvas",
    content: "",
    position: { x: 0, y: 0 },
    dimensions: { width: CANVAS.width, height: CANVAS.height },
    style: {},
    inlineStyle: "",
    classes: [],
    dataAttributes: {}
  };
}
function getCanvasRoot(page) {
  return page.find((b) => b.id === "canvas" && b.type === "canvas");
}
function getBlocks(page) {
  return page.filter((b) => !(b.id === "canvas" && b.type === "canvas"));
}
function checkScope(page) {
  const canvas = getCanvasRoot(page);
  if (!canvas) {
    return {
      reason: 'Page is missing its canvas root entry (id "canvas", type "canvas").',
      fix: 'Use "pagectl new <slug>" to create a valid page instead of hand-assembling the array.'
    };
  }
  if (canvas.classes.includes("grid-layout-active")) {
    return {
      reason: "Page is in grid layout mode; pagectl v1 only supports absolute-mode pages.",
      fix: "Grid-mode pages are out of scope for this CLI version \u2014 edit them in the page-builder UI instead."
    };
  }
  for (const block of getBlocks(page)) {
    if (!isBlockType(block.type)) {
      return {
        reason: `Block "${block.id}" has type "${block.type}", which is outside pagectl v1's supported palette (${BLOCK_TYPES.join(", ")}).`,
        fix: "image/video/table/richtext/link/twoCol/threeCol/landingpage blocks and nested containers are out of scope for this CLI version."
      };
    }
  }
  return null;
}

// src/cliRuntime.ts
var PAGE_FILE_SUFFIX = ".page.json";
function resolvePagePath(explicit) {
  if (explicit)
    return { path: resolve(explicit), isDefault: false };
  return { path: resolve(DEFAULT_PAGE_DIR, DEFAULT_PAGE_FILENAME), isDefault: true };
}
function findSiblingPageFiles(targetPath) {
  const dir = dirname(targetPath);
  const self = basename(targetPath);
  try {
    return readdirSync(dir).filter((f) => f.endsWith(PAGE_FILE_SUFFIX) && f !== self).sort();
  } catch {
    return [];
  }
}
function slugFromPageFilePath(targetPath) {
  const name = basename(targetPath);
  return name.endsWith(PAGE_FILE_SUFFIX) ? name.slice(0, -PAGE_FILE_SUFFIX.length) : null;
}
var EXIT = {
  OK: 0,
  BAD_INPUT: 2,
  AUTH: 3,
  NOT_FOUND: 4,
  TRANSIENT: 5
};
var CliError = class extends Error {
  constructor(code, message, fix) {
    super(message);
    this.code = code;
    this.fix = fix;
  }
};
function badInput(message, fix) {
  throw new CliError(EXIT.BAD_INPUT, message, fix);
}
function notFoundErr(message, fix) {
  throw new CliError(EXIT.NOT_FOUND, message, fix);
}
function transientErr(message, fix) {
  throw new CliError(EXIT.TRANSIENT, message, fix);
}
function loadPageFile(explicitPath) {
  const { path: resolved, isDefault } = resolvePagePath(explicitPath);
  if (!existsSync(resolved)) {
    if (isDefault) {
      const fresh = [makeCanvasRoot()];
      writePageFileAtomic(resolved, fresh);
      return { page: fresh, path: resolved };
    }
    const slug = slugFromPageFilePath(resolved);
    const createHint = slug ? `pagectl new ${slug}` : `pagectl new <slug> --out ${resolved}`;
    const siblings = findSiblingPageFiles(resolved);
    const fix = siblings.length > 0 ? `Found existing page file(s) in this directory: ${siblings.join(", ")}. Pass one of them as --page if that's what you meant, or create a new one with "${createHint}".` : `Create it first with "${createHint}", or omit --page to use the default page at ${DEFAULT_PAGE_DIR}/${DEFAULT_PAGE_FILENAME}.`;
    notFoundErr(`Page file not found: ${resolved}`, fix);
  }
  let raw;
  try {
    raw = readFileSync(resolved, "utf8");
  } catch (err) {
    transientErr(
      `Could not read ${resolved}: ${err.message}`,
      "Check file permissions and retry."
    );
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    badInput(
      `Invalid JSON in ${resolved}: ${err.message}`,
      'Fix the JSON syntax by hand, or regenerate the file with "pagectl new".'
    );
  }
  const parsed = pageSchema.safeParse(data);
  if (!parsed.success) {
    badInput(
      `${resolved} does not match the page schema: ${parsed.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ")}`,
      `Run "pagectl validate --page ${resolved}" for full details.`
    );
  }
  const violation = checkScope(parsed.data);
  if (violation) {
    badInput(violation.reason, violation.fix);
  }
  return { page: parsed.data, path: resolved };
}
function writePageFileAtomic(filePath, page) {
  const resolved = resolve(filePath);
  mkdirSync(dirname(resolved), { recursive: true });
  const tmp = `${resolved}.${process.pid}.${Date.now()}.tmp`;
  writeFileSync(tmp, JSON.stringify(page, null, 2) + "\n", "utf8");
  renameSync(tmp, resolved);
  return resolved;
}
function emitResult(json, data, humanPrinter) {
  if (json) {
    process.stdout.write(JSON.stringify({ schema: "1", data }) + "\n");
  } else {
    humanPrinter();
  }
}
async function runCommand(json, fn) {
  try {
    await fn();
  } catch (err) {
    const cliErr = err instanceof CliError ? err : new CliError(
      EXIT.TRANSIENT,
      err instanceof Error ? err.message : String(err),
      "Unexpected error \u2014 re-run the command in isolation, or file an issue with this output."
    );
    if (json) {
      process.stdout.write(JSON.stringify({ error: cliErr.message, fix: cliErr.fix }) + "\n");
    } else {
      console.error(`Error: ${cliErr.message}`);
      console.error(`Fix: ${cliErr.fix}`);
    }
    process.exitCode = cliErr.code;
  }
}
function parseKeyValueList(pairs, flagName) {
  const out = {};
  for (const pair of pairs ?? []) {
    const eq = pair.indexOf("=");
    if (eq <= 0) {
      badInput(
        `Malformed ${flagName} value "${pair}" \u2014 expected "key=value".`,
        `Pass it as e.g. ${flagName} color=#e11.`
      );
    }
    out[pair.slice(0, eq)] = pair.slice(eq + 1);
  }
  return out;
}

// src/commands/schema.ts
function schemaCommand(options) {
  const data = {
    binary: "pagectl",
    scope: {
      description: "v1 covers flat, top-level, absolute-mode pages using text/header/button/container blocks only.",
      outOfScope: ["grid-mode pages", "nested containers", "image", "video", "table", "richtext", "link", "twoCol", "threeCol", "landingpage", "multi-page projects"]
    },
    workflow: {
      afterEditingBlocks: `Once the user's blocks are added/edited and "validate" passes, ALWAYS run "pagectl serve" next so the user can see the live result in a browser \u2014 do this by default, without asking permission first. Starting a local dev server is not a risky or optional action here; it is the expected last step of building a page. If unsure whether one is already running, check "pagectl status" first (it reports the pid/port) rather than skipping serve or guessing.`,
      whenServeIsAlreadyRunning: `If "pagectl status" shows a serve session already running, do not start a second one (it will refuse anyway) \u2014 just tell the user the existing URL from status's "serve.port", and keep editing via add-block/update-block as normal; the open tab updates live.`,
      doNotDoThis: 'Do NOT run "pagectl build" as a way to show the user their page, and do NOT describe it as a preview. Its static HTML/CSS output does not resemble the real editor and is template-based, not pixel-accurate. Only run "build" if the user explicitly asks to export/ship static files.'
    },
    defaultPage: {
      path: `${DEFAULT_PAGE_DIR}/${DEFAULT_PAGE_FILENAME}`,
      description: 'Every command that takes --page falls back to this one file (relative to the current directory) when --page is omitted. It is auto-created on first use. Use this by default \u2014 only pass --page for a deliberately separate, named page (see "new"). This means an agent given zero file-naming instructions always converges on the same file as everything else, including "serve".'
    },
    canvas: CANVAS,
    blockTypes: BLOCK_TYPES,
    blocks: BLOCK_TYPES.map((type) => ({
      type,
      defaultWidth: BLOCKS[type].defaultWidth,
      defaultHeight: BLOCKS[type].defaultHeight,
      baseClass: BLOCKS[type].baseClass,
      requiresTextSpan: BLOCKS[type].requiresTextSpan
    })),
    enums: {
      align: ALIGN_VALUES,
      direction: DIRECTION_VALUES,
      blockType: BLOCK_TYPES
    },
    exitCodes: { ok: 0, badInput: 2, auth: 3, notFound: 4, transient: 5 },
    globalFlags: {
      "--json": 'Emit {"schema":"1","data":...} on success or {"error":"...","fix":"..."} on failure, always one line on stdout.',
      "--dry-run": "Compute and report the result without writing the page file.",
      "--force": 'Overwrite guard escape hatch (currently used by "new").',
      "--no-input": "Fail fast with a fix hint instead of prompting \u2014 pagectl never prompts, so this is always the effective behavior."
    },
    commands: [
      {
        name: "schema",
        usage: "pagectl schema [--json]",
        description: "Print this command tree."
      },
      {
        name: "status",
        usage: "pagectl status [--page <file>] [--json]",
        description: 'Read-only self-orientation, same reflex as "git status": reports whether the (default or given) page file exists and its block count, and whether a "serve" session is currently running (and on what port/watching which file). Run this first in an unfamiliar directory instead of guessing.'
      },
      {
        name: "list-blocks",
        usage: "pagectl list-blocks [--json]",
        description: "Print the block palette and defaults."
      },
      {
        name: "new",
        usage: "pagectl new <slug> [--out <path>] [--force] [--dry-run] [--json]",
        description: 'Explicitly create an additional, separately named page (not needed for the common single-page case \u2014 add-block/etc. auto-create the default page on first use). Idempotent: same slug + same content -> no-op exit 0; different content -> exit 2 unless --force; new slug -> created exit 0. Output carries a "note" field (non-blocking) if other *.page.json files already exist in the directory.'
      },
      {
        name: "add-block",
        usage: "pagectl add-block [--page <file>] --type <type> --id <id> [--content <text>] [--style k=v]... [--class <name>]... [--raw-content] [--width <n>] [--height <n>] [--below <id> | --right-of <id> | --x <n> --y <n>] [--align left|center|right] [--gap <n>] [--dry-run] [--json]",
        description: 'Add a block to the default page (or --page if given), auto-creating that page file if it does not exist yet. Default placement is auto-flow (no coordinates needed); --align applies even without --below (left/center/right against the full canvas width). Idempotent on identical retry ("already-exists", exit 0); different content on the same --id is a distinct error directing you to update-block, exit 2. Missing anchor id -> exit 4. Nesting inside a container is refused (out of scope).'
      },
      {
        name: "update-block",
        usage: "pagectl update-block [--page <file>] --id <id> [--left | --right | --up | --down] [--x <n> --y <n>] [--content <text>] [--style k=v]... [--class <name>]... [--raw-content] [--dry-run] [--json]",
        description: 'Move one grid step in a direction (repeat the call for "a lot"; every call clamps to canvas bounds, snaps to grid, and echoes the new box \u2014 "clamped-no-change" if already at an edge), OR jump straight to an explicit --x/--y (escape hatch for a large move, instead of many repeated direction calls or deleting and re-adding the block) \u2014 not both in the same call. Either can be combined with --content/--style/--class.'
      },
      {
        name: "remove-block",
        usage: "pagectl remove-block [--page <file>] --id <id> [--dry-run] [--json]",
        description: "Remove a block. Missing id -> exit 4. Does not reflow other blocks."
      },
      {
        name: "reorder-block",
        usage: "pagectl reorder-block [--page <file>] --id <id> (--before <id> | --after <id>) [--dry-run] [--json]",
        description: "Change array order only (affects auto-flow/z-order), not position. Missing id -> exit 4."
      },
      {
        name: "inspect",
        usage: "pagectl inspect [--page <file>] [--json]",
        description: "Print the resolved page path, canvas info, next auto-flow y, and every block's box."
      },
      {
        name: "validate",
        usage: "pagectl validate [--page <file>] [--fix] [--json]",
        description: "Schema validity + scope + overlap + out-of-bounds + stale-inlineStyle checks, each with a fix hint. Exit 2 on any issue. --fix auto-repairs blocks whose inlineStyle drifted from position/dimensions/style (e.g. written by a pagectl build predating that fix) \u2014 other issue kinds still need an explicit update-block/remove-block call."
      },
      {
        name: "build",
        usage: "pagectl build [--page <file>] [--out <dir>] [--dry-run] [--json]",
        description: 'DO NOT use this to show the user their page \u2014 it is a rough static HTML/CSS export (template-based, no headless browser, real core CSS linked verbatim) for explicit shipping/download requests only. It is NOT a preview, is not pixel-accurate, and must not be described as one. Use "serve" to show the user anything.'
      },
      {
        name: "serve",
        usage: "pagectl serve [file] [--port <n>]",
        description: `The correct way to show the user their page \u2014 serves the real page-builder editor UI backed by the default page file (or the given one), and watches it on disk so add-block/update-block/remove-block/reorder-block reflect live in the open browser tab. Run this by default after editing blocks, without waiting to be asked (see "workflow" above). POST /design also accepted. Tries --port (default 4321) and falls back to the next free port if it's taken \u2014 always tell the user the actual port from stderr or "status", never assume 4321. Refuses to start a second session in the same directory while one is already running (check "status" first).`
      }
    ]
  };
  emitResult(!!options.json, data, () => {
    console.log(JSON.stringify(data, null, 2));
  });
}

// src/commands/status.ts
import { existsSync as existsSync3, readFileSync as readFileSync3 } from "node:fs";

// src/serveLock.ts
import { existsSync as existsSync2, mkdirSync as mkdirSync2, readFileSync as readFileSync2, rmSync, writeFileSync as writeFileSync2 } from "node:fs";
import { resolve as resolve2 } from "node:path";
function serveLockPath() {
  return resolve2(DEFAULT_PAGE_DIR, "serve.json");
}
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}
function readLiveServeLock() {
  const lockPath = serveLockPath();
  if (!existsSync2(lockPath))
    return null;
  let lock;
  try {
    lock = JSON.parse(readFileSync2(lockPath, "utf8"));
  } catch {
    return null;
  }
  return isProcessAlive(lock.pid) ? lock : null;
}
function writeServeLock(lock) {
  const lockPath = serveLockPath();
  mkdirSync2(resolve2(DEFAULT_PAGE_DIR), { recursive: true });
  writeFileSync2(lockPath, JSON.stringify(lock, null, 2) + "\n", "utf8");
}
function removeServeLock() {
  try {
    rmSync(serveLockPath(), { force: true });
  } catch {
  }
}

// src/commands/status.ts
function statusCommand(options) {
  const { path } = resolvePagePath(options.page);
  let exists = false;
  let blockCount = null;
  if (existsSync3(path)) {
    exists = true;
    try {
      const parsed = pageSchema.safeParse(JSON.parse(readFileSync3(path, "utf8")));
      if (parsed.success)
        blockCount = getBlocks(parsed.data).length;
    } catch {
    }
  }
  const lock = readLiveServeLock();
  const data = {
    page: { path, exists, blockCount },
    serve: lock ? { running: true, pid: lock.pid, port: lock.port, page: lock.page, startedAt: lock.startedAt } : { running: false }
  };
  emitResult(!!options.json, data, () => {
    console.log(`Page: ${path}${exists ? ` (${blockCount ?? "?"} block(s))` : " (does not exist yet)"}`);
    if (lock) {
      console.log(`Serve: running at http://localhost:${lock.port} (pid ${lock.pid}), watching ${lock.page}`);
    } else {
      console.log("Serve: not running");
    }
  });
}

// src/commands/listBlocks.ts
function listBlocksCommand(options) {
  const data = BLOCK_TYPES.map((type) => {
    const def = BLOCKS[type];
    return {
      type: def.type,
      label: def.label,
      defaultWidth: def.defaultWidth,
      defaultHeight: def.defaultHeight,
      baseClass: def.baseClass,
      requiresTextSpan: def.requiresTextSpan,
      defaultText: def.defaultText ?? null
    };
  });
  emitResult(!!options.json, data, () => {
    for (const b of data) {
      console.log(`${b.type.padEnd(10)} ${b.defaultWidth}x${b.defaultHeight}  class=${b.baseClass}`);
    }
  });
}

// src/commands/new.ts
import { existsSync as existsSync4, readFileSync as readFileSync4 } from "node:fs";
import { resolve as resolve3 } from "node:path";
function readExisting(filePath) {
  if (!existsSync4(filePath))
    return null;
  try {
    return JSON.parse(readFileSync4(filePath, "utf8"));
  } catch (err) {
    badInput(
      `${filePath} already exists but is not valid JSON: ${err.message}`,
      "Delete or fix the file by hand, or pass --force to overwrite it."
    );
  }
}
function newCommand(slug, options) {
  const outPath = resolve3(options.out ?? `${slug}.page.json`);
  const fresh = [makeCanvasRoot()];
  const existing = readExisting(outPath);
  const siblings = findSiblingPageFiles(outPath);
  const note = siblings.length > 0 ? `Other page file(s) already exist in this directory: ${siblings.join(", ")}. If you meant to edit one of those, use "pagectl add-block --page <file> ..." instead of creating a new page.` : void 0;
  if (existing) {
    const sameParams = JSON.stringify(existing) === JSON.stringify(fresh);
    if (sameParams) {
      emitResult(!!options.json, { status: "no-op", slug, path: outPath, note }, () => {
        console.log(`Page "${slug}" already exists with identical params -> ${outPath} (no-op)`);
        if (note)
          console.log(`Note: ${note}`);
      });
      return;
    }
    if (!options.force) {
      badInput(
        `Page file already exists with different content: ${outPath}`,
        `It already has real content \u2014 if you meant to edit it, use "pagectl add-block --page ${outPath} ..." instead. To deliberately reset it to a blank canvas, pass --force.`
      );
    }
  }
  if (options.dryRun) {
    emitResult(!!options.json, { status: "dry-run", slug, path: outPath, note }, () => {
      console.log(`[dry-run] Would create page "${slug}" -> ${outPath}`);
      if (note)
        console.log(`Note: ${note}`);
    });
    return;
  }
  writePageFileAtomic(outPath, fresh);
  emitResult(
    !!options.json,
    { status: existing ? "overwritten" : "created", slug, path: outPath, note },
    () => {
      console.log(`Created page "${slug}" -> ${outPath}`);
      if (note)
        console.log(`Note: ${note}`);
    }
  );
}

// src/layout.ts
function snap(value) {
  return Math.round(value / CANVAS.grid) * CANVAS.grid;
}
function renderInlineStyle(box, extraStyle = {}) {
  const declarations = [
    "position: absolute",
    `left: ${box.x}px`,
    `top: ${box.y}px`,
    `width: ${box.width}px`,
    `height: ${box.height}px`,
    ...Object.entries(extraStyle).map(([key, value]) => `${key}: ${value}`)
  ];
  return declarations.join("; ") + ";";
}
function clampX(x, width) {
  const max = Math.max(0, CANVAS.width - width);
  return Math.min(Math.max(x, 0), max);
}
function clampY(y) {
  return Math.max(y, 0);
}
function clampAndSnap(x, y, width, height) {
  const snappedX = snap(x);
  const snappedY = snap(y);
  const clampedX = clampX(snappedX, width);
  const clampedY = clampY(snappedY);
  return {
    box: { x: clampedX, y: clampedY, width, height },
    clamped: clampedX !== snappedX || clampedY !== snappedY
  };
}
function nextAutoFlowY(page) {
  const blocks = getBlocks(page);
  if (blocks.length === 0)
    return CANVAS.gap;
  const maxBottom = Math.max(...blocks.map((b) => b.position.y + b.dimensions.height));
  return maxBottom + CANVAS.gap;
}
function computeAutoFlowPosition(page, width, height, align = "left") {
  const y = nextAutoFlowY(page);
  let x;
  switch (align) {
    case "left":
      x = CANVAS.gap;
      break;
    case "center":
      x = CANVAS.width / 2 - width / 2;
      break;
    case "right":
      x = CANVAS.width - CANVAS.gap - width;
      break;
  }
  return clampAndSnap(x, y, width, height);
}
function findAnchor(page, anchorId) {
  const anchor = getBlocks(page).find((b) => b.id === anchorId);
  if (!anchor) {
    notFoundErr(
      `Anchor block "${anchorId}" not found on this page.`,
      'Check the id with "pagectl inspect --page <file>" and retry.'
    );
  }
  return anchor;
}
function alignX(anchor, width, align) {
  switch (align) {
    case "left":
      return anchor.position.x;
    case "center":
      return anchor.position.x + anchor.dimensions.width / 2 - width / 2;
    case "right":
      return anchor.position.x + anchor.dimensions.width - width;
  }
}
function computeBelowPosition(page, anchorId, width, height, align, gap) {
  const anchor = findAnchor(page, anchorId);
  const x = alignX(anchor, width, align);
  const y = anchor.position.y + anchor.dimensions.height + gap;
  return clampAndSnap(x, y, width, height);
}
function computeRightOfPosition(page, anchorId, width, height, gap) {
  const anchor = findAnchor(page, anchorId);
  const x = anchor.position.x + anchor.dimensions.width + gap;
  const y = anchor.position.y;
  return clampAndSnap(x, y, width, height);
}
function computeExplicitPosition(x, y, width, height) {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    badInput("--x and --y must both be finite numbers.", "Pass both --x and --y as numbers, e.g. --x 40 --y 20.");
  }
  return clampAndSnap(x, y, width, height);
}
function nudge(box, direction) {
  let rawX = box.x;
  let rawY = box.y;
  switch (direction) {
    case "left":
      rawX -= CANVAS.nudgeStep;
      break;
    case "right":
      rawX += CANVAS.nudgeStep;
      break;
    case "up":
      rawY -= CANVAS.nudgeStep;
      break;
    case "down":
      rawY += CANVAS.nudgeStep;
      break;
  }
  const { box: newBox } = clampAndSnap(rawX, rawY, box.width, box.height);
  let status;
  if (newBox.x === box.x && newBox.y === box.y) {
    status = "clamped-no-change";
  } else if (newBox.x !== snap(rawX) || newBox.y !== snap(rawY)) {
    status = "clamped-to-edge";
  } else {
    status = "moved";
  }
  return { box: newBox, status };
}
function findOverlaps(blocks, tolerance = 2) {
  const overlaps = [];
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i];
      const b = blocks[j];
      const ax1 = a.position.x + tolerance;
      const ay1 = a.position.y + tolerance;
      const ax2 = a.position.x + a.dimensions.width - tolerance;
      const ay2 = a.position.y + a.dimensions.height - tolerance;
      const bx1 = b.position.x + tolerance;
      const by1 = b.position.y + tolerance;
      const bx2 = b.position.x + b.dimensions.width - tolerance;
      const by2 = b.position.y + b.dimensions.height - tolerance;
      const intersects = ax1 < bx2 && ax2 > bx1 && ay1 < by2 && ay2 > by1;
      if (intersects)
        overlaps.push({ a: a.id, b: b.id });
    }
  }
  return overlaps;
}
function findOutOfBounds(blocks) {
  const issues = [];
  for (const b of blocks) {
    if (b.position.x < 0)
      issues.push({ id: b.id, reason: `x (${b.position.x}) is negative.` });
    if (b.position.y < 0)
      issues.push({ id: b.id, reason: `y (${b.position.y}) is negative.` });
    if (b.position.x + b.dimensions.width > CANVAS.width) {
      issues.push({
        id: b.id,
        reason: `right edge (${b.position.x + b.dimensions.width}) exceeds canvas width (${CANVAS.width}).`
      });
    }
  }
  return issues;
}

// src/commands/addBlock.ts
function addBlockCommand(options) {
  if (!options.type)
    badInput("--type is required.", `Pass --type <${BLOCK_TYPES.join("|")}>.`);
  if (!options.id)
    badInput("--id is required.", "Pass a unique --id for this block.");
  if (options.parent) {
    badInput(
      "Nesting a block inside a container is out of scope for pagectl v1.",
      "Add the block top-level instead; nested containers are not supported."
    );
  }
  if (!isBlockType(options.type)) {
    badInput(
      `Unknown block type "${options.type}".`,
      `Supported types in pagectl v1: ${BLOCK_TYPES.join(", ")}. Run "pagectl list-blocks" for details.`
    );
  }
  const def = BLOCKS[options.type];
  const { page, path } = loadPageFile(options.page);
  const blocks = getBlocks(page);
  const width = options.width ? Number(options.width) : def.defaultWidth;
  const rawText = !options.rawContent ? options.content ?? def.defaultText ?? "" : "";
  const height = options.height ? Number(options.height) : estimateWrappedHeight(options.type, rawText, width, def.defaultHeight);
  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    badInput("--width and --height must be positive numbers.", "Omit them to use the type default, or pass positive numbers.");
  }
  let content;
  if (options.type === "container") {
    if (options.content) {
      badInput(
        "container blocks take no --content in pagectl v1 (no children).",
        "Drop --content for container blocks."
      );
    }
    content = def.defaultContent();
  } else if (options.rawContent) {
    if (!options.content) {
      badInput("--raw-content requires --content.", 'Pass --content "<markup>" alongside --raw-content.');
    }
    if (def.requiresTextSpan && !hasTextSpan(options.content)) {
      badInput(
        `--raw-content for type "${options.type}" is missing the required component-text-content span.`,
        `Include <span class="component-text-content" contenteditable="true">...</span> in --content, or drop --raw-content to have pagectl wrap it for you.`
      );
    }
    content = options.content;
  } else {
    content = def.defaultContent(options.content);
  }
  const existing = blocks.find((b) => b.id === options.id);
  const style = parseKeyValueList(options.style, "--style");
  const classes = Array.from(/* @__PURE__ */ new Set([def.baseClass, ...options.class ?? []]));
  if (existing) {
    const candidateSameShape = existing.type === options.type && existing.content === content && JSON.stringify(existing.style) === JSON.stringify({ ...existing.style, ...style }) && classes.every((c) => existing.classes.includes(c));
    if (candidateSameShape) {
      emitResult(!!options.json, { status: "already-exists", id: options.id, path }, () => {
        console.log(`Block "${options.id}" already exists with identical content (no-op).`);
      });
      return;
    }
    badInput(
      `Block "${options.id}" already exists with different content.`,
      `Use "pagectl update-block --page ${path} --id ${options.id} ..." to change it instead of add-block.`
    );
  }
  if (options.below && options.rightOf) {
    badInput("--below and --right-of cannot both be set.", "Pick exactly one anchor relationship.");
  }
  if (options.x && !options.y || options.y && !options.x) {
    badInput("--x and --y must be passed together.", "Pass both --x and --y, or neither.");
  }
  const align = options.align ?? "left";
  if (!ALIGN_VALUES.includes(align)) {
    badInput(`Unknown --align "${options.align}".`, `Use one of: ${ALIGN_VALUES.join(", ")}.`);
  }
  const gap = options.gap ? Number(options.gap) : CANVAS.gap;
  if (!Number.isFinite(gap) || gap < 0) {
    badInput("--gap must be a non-negative number.", "Omit --gap to use the CLI default.");
  }
  let placement;
  if (options.x && options.y) {
    placement = computeExplicitPosition(Number(options.x), Number(options.y), width, height);
  } else if (options.below) {
    placement = computeBelowPosition(page, options.below, width, height, align, gap);
  } else if (options.rightOf) {
    placement = computeRightOfPosition(page, options.rightOf, width, height, gap);
  } else {
    placement = computeAutoFlowPosition(page, width, height, align);
  }
  const newBlock = {
    id: options.id,
    type: options.type,
    content,
    position: { x: placement.box.x, y: placement.box.y },
    dimensions: { width: placement.box.width, height: placement.box.height },
    style,
    inlineStyle: renderInlineStyle(placement.box, style),
    classes,
    dataAttributes: {}
  };
  const nextPage = [...page, newBlock];
  if (options.dryRun) {
    emitResult(
      !!options.json,
      { status: "dry-run", id: options.id, path, box: placement.box, clamped: placement.clamped },
      () => console.log(`[dry-run] Would add "${options.id}" at (${placement.box.x}, ${placement.box.y})`)
    );
    return;
  }
  writePageFileAtomic(path, nextPage);
  emitResult(
    !!options.json,
    { status: "created", id: options.id, path, box: placement.box, clamped: placement.clamped },
    () => {
      console.log(
        `Added "${options.id}" (${options.type}) at (${placement.box.x}, ${placement.box.y}) ${placement.box.width}x${placement.box.height}${placement.clamped ? " [clamped]" : ""} -> ${path}`
      );
    }
  );
}

// src/commands/updateBlock.ts
function updateBlockCommand(options) {
  if (!options.id)
    badInput("--id is required.", "Pass --id <block id>.");
  const directionFlags = {
    left: options.left,
    right: options.right,
    up: options.up,
    down: options.down
  };
  const directions = DIRECTION_VALUES.filter((d) => directionFlags[d]);
  if (directions.length > 1) {
    badInput("Only one of --left/--right/--up/--down may be set per call.", `Call update-block once per direction \u2014 "a lot" is repeated calls, not a bigger step.`);
  }
  if (options.x && !options.y || options.y && !options.x) {
    badInput("--x and --y must be passed together.", "Pass both --x and --y, or neither.");
  }
  const hasExplicitMove = !!(options.x && options.y);
  if (hasExplicitMove && directions.length > 0) {
    badInput(
      "Cannot combine --x/--y with a direction flag in the same call.",
      "Use --x/--y to jump to an exact position, or --left/--right/--up/--down to nudge relatively \u2014 not both at once."
    );
  }
  const hasContentEdit = options.content !== void 0;
  const hasStyleEdit = (options.style ?? []).length > 0;
  const hasClassEdit = (options.class ?? []).length > 0;
  if (directions.length === 0 && !hasExplicitMove && !hasContentEdit && !hasStyleEdit && !hasClassEdit) {
    badInput(
      "Nothing to update.",
      `Pass a direction (--left/--right/--up/--down), an explicit --x/--y, and/or --content/--style/--class. Valid directions: ${DIRECTION_VALUES.join(", ")}.`
    );
  }
  const { page, path } = loadPageFile(options.page);
  const index = page.findIndex((b) => b.id === options.id && b.id !== "canvas");
  if (index === -1) {
    notFoundErr(
      `Block "${options.id}" not found on this page.`,
      'Check the id with "pagectl inspect --page <file>" and retry.'
    );
  }
  const block = page[index];
  if (!isBlockType(block.type)) {
    badInput(
      `Block "${options.id}" has type "${block.type}", which is outside pagectl v1's supported palette.`,
      "This block was likely created outside pagectl; edit it in the page-builder UI instead."
    );
  }
  const def = BLOCKS[block.type];
  const updated = { ...block, style: { ...block.style }, classes: [...block.classes] };
  let status = "updated";
  if (directions.length === 1) {
    const box = { x: block.position.x, y: block.position.y, width: block.dimensions.width, height: block.dimensions.height };
    const result = nudge(box, directions[0]);
    updated.position = { x: result.box.x, y: result.box.y };
    status = result.status;
  } else if (hasExplicitMove) {
    const placement = computeExplicitPosition(Number(options.x), Number(options.y), block.dimensions.width, block.dimensions.height);
    updated.position = { x: placement.box.x, y: placement.box.y };
    status = placement.clamped ? "clamped-to-edge" : "moved";
  }
  if (hasContentEdit) {
    if (block.type === "container") {
      badInput("container blocks take no --content in pagectl v1 (no children).", "Drop --content for container blocks.");
    }
    if (options.rawContent) {
      if (def.requiresTextSpan && !hasTextSpan(options.content)) {
        badInput(
          `--raw-content for type "${block.type}" is missing the required component-text-content span.`,
          `Include <span class="component-text-content" contenteditable="true">...</span> in --content, or drop --raw-content to have pagectl wrap it for you.`
        );
      }
      updated.content = options.content;
    } else {
      updated.content = def.defaultContent(options.content);
    }
  }
  if (hasStyleEdit) {
    Object.assign(updated.style, parseKeyValueList(options.style, "--style"));
  }
  if (hasClassEdit) {
    updated.classes = Array.from(/* @__PURE__ */ new Set([...updated.classes, ...options.class ?? []]));
  }
  const resultBox = { x: updated.position.x, y: updated.position.y, width: updated.dimensions.width, height: updated.dimensions.height };
  updated.inlineStyle = renderInlineStyle(resultBox, updated.style);
  const nextPage = [...page];
  nextPage[index] = updated;
  if (options.dryRun) {
    emitResult(
      !!options.json,
      { status: "dry-run", id: options.id, path, box: resultBox },
      () => console.log(`[dry-run] Would update "${options.id}"`)
    );
    return;
  }
  writePageFileAtomic(path, nextPage);
  emitResult(!!options.json, { status, id: options.id, path, box: resultBox }, () => {
    console.log(`Updated "${options.id}" -> ${status} @ (${resultBox.x}, ${resultBox.y}) -> ${path}`);
  });
}

// src/commands/removeBlock.ts
function removeBlockCommand(options) {
  if (!options.id)
    badInput("--id is required.", "Pass --id <block id>.");
  const { page, path } = loadPageFile(options.page);
  const index = page.findIndex((b) => b.id === options.id && b.id !== "canvas");
  if (index === -1) {
    notFoundErr(
      `Block "${options.id}" not found on this page.`,
      'Check the id with "pagectl inspect --page <file>" and retry.'
    );
  }
  const nextPage = page.filter((_, i) => i !== index);
  if (options.dryRun) {
    emitResult(
      !!options.json,
      { status: "dry-run", id: options.id, path, remaining: nextPage.length - 1 },
      () => console.log(`[dry-run] Would remove "${options.id}"`)
    );
    return;
  }
  writePageFileAtomic(path, nextPage);
  emitResult(!!options.json, { status: "removed", id: options.id, path, remaining: nextPage.length - 1 }, () => {
    console.log(`Removed "${options.id}" (${nextPage.length - 1} block(s) remaining) -> ${path}`);
  });
}

// src/commands/reorderBlock.ts
function reorderBlockCommand(options) {
  if (!options.id)
    badInput("--id is required.", "Pass --id <block id>.");
  if (options.before && options.after || !options.before && !options.after) {
    badInput("Pass exactly one of --before or --after.", "e.g. --before intro or --after intro.");
  }
  const referenceId = options.before ?? options.after;
  const { page, path } = loadPageFile(options.page);
  const sourceIndex = page.findIndex((b) => b.id === options.id && b.id !== "canvas");
  if (sourceIndex === -1) {
    notFoundErr(`Block "${options.id}" not found on this page.`, 'Check the id with "pagectl inspect --page <file>" and retry.');
  }
  const referenceIndex = page.findIndex((b) => b.id === referenceId && b.id !== "canvas");
  if (referenceIndex === -1) {
    notFoundErr(`Reference block "${referenceId}" not found on this page.`, 'Check the id with "pagectl inspect --page <file>" and retry.');
  }
  if (options.id === referenceId) {
    badInput("--id and the reference id must differ.", "Pick a different reference block.");
  }
  const withoutSource = page.filter((_, i) => i !== sourceIndex);
  const sourceBlock = page[sourceIndex];
  const newReferenceIndex = withoutSource.findIndex((b) => b.id === referenceId);
  const insertAt = options.before ? newReferenceIndex : newReferenceIndex + 1;
  const nextPage = [...withoutSource.slice(0, insertAt), sourceBlock, ...withoutSource.slice(insertAt)];
  const order = nextPage.filter((b) => b.id !== "canvas").map((b) => b.id);
  if (options.dryRun) {
    emitResult(!!options.json, { status: "dry-run", path, order }, () => console.log(`[dry-run] Would reorder -> ${order.join(", ")}`));
    return;
  }
  writePageFileAtomic(path, nextPage);
  emitResult(!!options.json, { status: "reordered", path, order }, () => {
    console.log(`New order: ${order.join(", ")} -> ${path}`);
  });
}

// src/commands/inspect.ts
function inspectCommand(options) {
  const { page, path } = loadPageFile(options.page);
  const blocks = getBlocks(page);
  const data = {
    path,
    canvas: { width: CANVAS.width, height: CANVAS.height },
    nextAutoFlowY: nextAutoFlowY(page),
    blocks: blocks.map((b) => ({
      id: b.id,
      type: b.type,
      x: b.position.x,
      y: b.position.y,
      width: b.dimensions.width,
      height: b.dimensions.height
    }))
  };
  emitResult(!!options.json, data, () => {
    console.log(`Page: ${data.path}`);
    console.log(`Canvas: ${data.canvas.width}x${data.canvas.height}  next auto-flow y: ${data.nextAutoFlowY}`);
    for (const b of data.blocks) {
      console.log(`  ${b.id.padEnd(20)} ${b.type.padEnd(10)} (${b.x}, ${b.y}) ${b.width}x${b.height}`);
    }
    if (data.blocks.length === 0)
      console.log("  (no blocks)");
  });
}

// src/commands/validate.ts
import { existsSync as existsSync5, readFileSync as readFileSync5 } from "node:fs";
function validateCommand(options) {
  const { path: filePath, isDefault } = resolvePagePath(options.page);
  const issues = [];
  if (!existsSync5(filePath)) {
    if (isDefault) {
      writePageFileAtomic(filePath, [makeCanvasRoot()]);
    } else {
      const slug = slugFromPageFilePath(filePath);
      const createHint = slug ? `pagectl new ${slug}` : `pagectl new <slug> --out ${filePath}`;
      const siblings = findSiblingPageFiles(filePath);
      const fix = siblings.length > 0 ? `Found existing page file(s) in this directory: ${siblings.join(", ")}. Pass one of them as --page if that's what you meant, or create a new one with "${createHint}".` : `Create it first with "${createHint}", or omit --page to validate the default page.`;
      badInput(`Page file not found: ${filePath}`, fix);
    }
  }
  let raw;
  try {
    raw = readFileSync5(filePath, "utf8");
  } catch (err) {
    badInput(`Could not read ${filePath}: ${err.message}`, "Check file permissions and retry.");
  }
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    issues.push({
      kind: "schema",
      message: `Invalid JSON: ${err.message}`,
      fix: 'Fix the JSON syntax by hand, or regenerate the file with "pagectl new".'
    });
    report(options, filePath, issues, 0);
    return;
  }
  const parsed = pageSchema.safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push({
        kind: "schema",
        message: `${issue.path.join(".") || "(root)"}: ${issue.message}`,
        fix: "Match the PageComponent shape (id, type, content, position, dimensions, style, inlineStyle, classes, dataAttributes)."
      });
    }
    report(options, filePath, issues, 0);
    return;
  }
  const violation = checkScope(parsed.data);
  if (violation) {
    issues.push({ kind: "scope", message: violation.reason, fix: violation.fix });
  }
  const blocks = getBlocks(parsed.data);
  const staleIds = /* @__PURE__ */ new Set();
  for (const block of blocks) {
    const expected = renderInlineStyle(
      { x: block.position.x, y: block.position.y, width: block.dimensions.width, height: block.dimensions.height },
      block.style
    );
    if (block.inlineStyle !== expected) {
      staleIds.add(block.id);
      issues.push({
        kind: "stale-inline-style",
        message: `"${block.id}"'s inlineStyle doesn't match its position/dimensions/style, so the real editor won't render it where the JSON says it is.`,
        fix: options.fix ? "Repairing automatically (--fix was passed)." : `Re-run with --fix to repair automatically, or touch it once with "pagectl update-block --page ${filePath} --id ${block.id} --right --left" (net zero move, regenerates inlineStyle).`
      });
    }
  }
  for (const overlap of findOverlaps(blocks)) {
    issues.push({
      kind: "overlap",
      message: `"${overlap.a}" and "${overlap.b}" overlap.`,
      fix: `Move one of them apart with repeated "pagectl update-block --page ${filePath} --id ${overlap.b} --left/--right/--up/--down" calls.`
    });
  }
  for (const oob of findOutOfBounds(blocks)) {
    issues.push({
      kind: "out-of-bounds",
      message: `"${oob.id}": ${oob.reason}`,
      fix: `Reposition it with "pagectl update-block --page ${filePath} --id ${oob.id} --left/--right/--up/--down" until it's back on canvas (${CANVAS.width}x${CANVAS.height}).`
    });
  }
  const didRepair = !!options.fix && staleIds.size > 0;
  if (didRepair) {
    const repairedPage = parsed.data.map((block) => {
      if (!staleIds.has(block.id))
        return block;
      return {
        ...block,
        inlineStyle: renderInlineStyle(
          { x: block.position.x, y: block.position.y, width: block.dimensions.width, height: block.dimensions.height },
          block.style
        )
      };
    });
    writePageFileAtomic(filePath, repairedPage);
  }
  const remainingIssues = didRepair ? issues.filter((i) => i.kind !== "stale-inline-style") : issues;
  report(options, filePath, remainingIssues, didRepair ? staleIds.size : 0);
}
function report(options, filePath, remainingIssues, repairedCount) {
  const valid = remainingIssues.length === 0;
  emitResult(!!options.json, { valid, path: filePath, repairedCount, issues: remainingIssues }, () => {
    if (repairedCount > 0) {
      console.log(`Repaired stale inlineStyle on ${repairedCount} block(s): ${filePath}`);
    }
    if (valid) {
      console.log(`Valid: ${filePath}`);
      return;
    }
    console.error(`Invalid: ${filePath}`);
    for (const issue of remainingIssues) {
      console.error(`  [${issue.kind}] ${issue.message}`);
      console.error(`    fix: ${issue.fix}`);
    }
  });
  if (!valid)
    process.exitCode = EXIT.BAD_INPUT;
}

// src/commands/build.ts
import { createRequire } from "node:module";
import { dirname as dirname2, resolve as resolve4 } from "node:path";
import { mkdirSync as mkdirSync3, readFileSync as readFileSync6, writeFileSync as writeFileSync3 } from "node:fs";
var NOT_A_PREVIEW_NOTE = 'This is a rough static export (template-based, no headless browser) \u2014 not pixel parity with the real editor. For an accurate live view, use "pagectl serve" instead.';
var require2 = createRequire(import.meta.url);
function readCoreCss() {
  try {
    const corePkgJson = require2.resolve("@mindfiredigital/page-builder/package.json");
    const cssPath = resolve4(dirname2(corePkgJson), "dist/styles/index.css");
    return readFileSync6(cssPath, "utf8");
  } catch (err) {
    transientErr(
      `Could not locate @mindfiredigital/page-builder's built CSS: ${err.message}`,
      'Run the core package build first ("pnpm --filter @mindfiredigital/page-builder build"), then retry.'
    );
  }
}
function renderBlock(block) {
  const style = block.inlineStyle || renderInlineStyle(
    { x: block.position.x, y: block.position.y, width: block.dimensions.width, height: block.dimensions.height },
    block.style
  );
  const classAttr = block.classes.join(" ");
  switch (block.type) {
    case "button":
      return `<button id="${escapeHtml(block.id)}" class="${escapeHtml(classAttr)}" style="${escapeHtml(style)}">${block.content}</button>`;
    case "text":
    case "header":
    case "container":
    default:
      return `<div id="${escapeHtml(block.id)}" class="${escapeHtml(classAttr)}" style="${escapeHtml(style)}">${block.content}</div>`;
  }
}
function buildCommand(options) {
  const { page } = loadPageFile(options.page);
  const blocks = getBlocks(page);
  const css = readCoreCss();
  const bodyBlocks = blocks.map(renderBlock).join("\n  ");
  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>pagectl build</title>
<link rel="stylesheet" href="styles.css" />
</head>
<body>
<div class="page-builder-canvas" style="position:relative;width:${CANVAS.width}px;min-height:${CANVAS.height}px;">
  ${bodyBlocks}
</div>
</body>
</html>
`;
  const outDir = resolve4(options.out ?? "pagectl-output");
  if (options.dryRun) {
    emitResult(
      !!options.json,
      { status: "dry-run", outDir, blockCount: blocks.length, note: NOT_A_PREVIEW_NOTE },
      () => console.error(`[dry-run] Would write ${outDir}/index.html and ${outDir}/styles.css`)
    );
    return;
  }
  mkdirSync3(outDir, { recursive: true });
  writeFileSync3(resolve4(outDir, "index.html"), html, "utf8");
  writeFileSync3(resolve4(outDir, "styles.css"), css, "utf8");
  emitResult(!!options.json, { status: "built", outDir, blockCount: blocks.length, note: NOT_A_PREVIEW_NOTE }, () => {
    console.log(`Wrote ${resolve4(outDir, "index.html")}`);
    console.log(`Wrote ${resolve4(outDir, "styles.css")}`);
    console.log(NOT_A_PREVIEW_NOTE);
  });
}

// src/commands/serve.ts
import { createServer } from "node:http";
import { existsSync as existsSync6, readFileSync as readFileSync7, watch } from "node:fs";
function readDesignFile(filePath) {
  if (!existsSync6(filePath)) {
    const blank = [makeCanvasRoot()];
    writePageFileAtomic(filePath, blank);
    return blank;
  }
  return JSON.parse(readFileSync7(filePath, "utf8"));
}
function listenWithFallback(server, startPort, maxAttempts = 20) {
  return new Promise((resolvePromise, reject) => {
    let attempt = 0;
    const tryPort = (port) => {
      const onError = (err) => {
        server.removeListener("listening", onListening);
        if (err.code === "EADDRINUSE" && attempt < maxAttempts) {
          attempt++;
          tryPort(port + 1);
          return;
        }
        reject(err);
      };
      const onListening = () => {
        server.removeListener("error", onError);
        resolvePromise(port);
      };
      server.once("error", onError);
      server.once("listening", onListening);
      server.listen(port);
    };
    tryPort(startPort);
  });
}
function readJSONBody(req) {
  return new Promise((resolvePromise, reject) => {
    let data = "";
    req.on("data", (chunk) => data += chunk);
    req.on("end", () => {
      try {
        resolvePromise(JSON.parse(data));
      } catch (err) {
        reject(err);
      }
    });
  });
}
async function serveCommand(designFile, options) {
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
  const sseClients = /* @__PURE__ */ new Set();
  function broadcast(design) {
    const payload = `data: ${JSON.stringify(design)}

`;
    for (const res of sseClients)
      res.write(payload);
  }
  let watchTimer = null;
  watch(filePath, () => {
    if (watchTimer)
      clearTimeout(watchTimer);
    watchTimer = setTimeout(() => {
      if (!existsSync6(filePath))
        return;
      let next;
      try {
        next = JSON.parse(readFileSync7(filePath, "utf8"));
      } catch {
        return;
      }
      const parsed = pageSchema.safeParse(next);
      if (!parsed.success)
        return;
      currentDesign = parsed.data;
      broadcast(currentDesign);
      console.error(`[serve] ${filePath} changed on disk (${currentDesign.length} components), pushed to ${sseClients.size} open tab(s)`);
    }, 50);
  });
  const { bundleLibrary: bundleLibrary2 } = await Promise.resolve().then(() => (init_bundleLibrary(), bundleLibrary_exports));
  const { buildHarnessPage: buildHarnessPage2 } = await Promise.resolve().then(() => (init_harnessPage(), harnessPage_exports));
  console.error("Bundling page-builder for the browser (one-time, no headless browser involved)...");
  const { js, css } = await bundleLibrary2();
  const harnessHTML = buildHarnessPage2();
  const server = createServer(async (req, res) => {
    if (req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(harnessHTML);
      return;
    }
    if (req.url === "/bundle.js") {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.end(js);
      return;
    }
    if (req.url === "/bundle.css") {
      res.writeHead(200, { "Content-Type": "text/css" });
      res.end(css);
      return;
    }
    if (req.url === "/events") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive"
      });
      res.write("\n");
      sseClients.add(res);
      req.on("close", () => sseClients.delete(res));
      return;
    }
    if (req.url === "/design" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(currentDesign));
      return;
    }
    if (req.url === "/design" && req.method === "POST") {
      let body;
      try {
        body = await readJSONBody(req);
      } catch {
        res.writeHead(400);
        res.end("Invalid JSON");
        return;
      }
      const parsed = pageSchema.safeParse(body);
      if (!parsed.success) {
        res.writeHead(422, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ errors: parsed.error.issues }));
        return;
      }
      currentDesign = parsed.data;
      writePageFileAtomic(filePath, currentDesign);
      broadcast(currentDesign);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true, componentCount: currentDesign.length }));
      console.error(`[serve] ${filePath} updated via POST /design (${currentDesign.length} components), pushed to ${sseClients.size} open tab(s)`);
      return;
    }
    res.writeHead(404);
    res.end("Not found");
  });
  let actualPort;
  try {
    actualPort = await listenWithFallback(server, port);
  } catch (err) {
    console.error(`Could not bind to port ${port} or any port after it: ${err.message}`);
    process.exitCode = 5;
    return;
  }
  writeServeLock({ pid: process.pid, port: actualPort, page: filePath, startedAt: (/* @__PURE__ */ new Date()).toISOString() });
  if (actualPort !== port) {
    console.error(`Port ${port} was already in use \u2014 serving on ${actualPort} instead.`);
  }
  console.error(`
pagectl serve running at http://localhost:${actualPort}`);
  console.error(`Persistent storage: ${filePath}`);
  console.error(`File changes from add-block/update-block/remove-block/reorder-block are picked up live.`);
  console.error(`Or push edits directly with:`);
  console.error(`  curl -X POST http://localhost:${actualPort}/design -H "Content-Type: application/json" -d @your-design.json`);
  console.error(`Restarting this command re-reads ${filePath} \u2014 state is not lost.
`);
  const shutdown = () => {
    removeServeLock();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("exit", removeServeLock);
}

// src/index.ts
var program = new Command();
function collect(value, previous) {
  return [...previous, value];
}
program.name("pagectl").description(
  'Scriptable, self-describing CLI for @mindfiredigital/page-builder pages. v1 covers flat, top-level, absolute-mode pages (text/header/button/container). Run "pagectl schema" for the full machine-readable command tree.'
).version("1.0.0");
program.command("schema").description("Print the machine-readable command tree, canvas info, block palette, and every flag enum.").option("--json", "emit structured JSON").option("--no-input", "fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)").action((options) => runCommand(!!options.json, () => schemaCommand(options)));
program.command("status").description(`Report the default (or given) page file's existence/block count, and whether a "serve" session is already running.`).option("--page <file>", "page JSON file (default: .pagectl/page.json)").option("--json", "emit structured JSON").action((options) => runCommand(!!options.json, () => statusCommand(options)));
program.command("list-blocks").description("Print the block palette and defaults.").option("--json", "emit structured JSON").option("--no-input", "fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)").action((options) => runCommand(!!options.json, () => listBlocksCommand(options)));
program.command("new <slug>").description("Explicitly create an additional, separately named page (not needed for the common single-page case \u2014 add-block etc. auto-create the default page).").option("-o, --out <path>", "output file path (default: <slug>.page.json)").option("--force", "overwrite an existing page file with a blank canvas").option("--dry-run", "compute and report without writing").option("--json", "emit structured JSON").option("--no-input", "fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)").action((slug, options) => runCommand(!!options.json, () => newCommand(slug, options)));
program.command("add-block").description("Add a block to the default (or given) page, auto-creating it if needed. Default placement is auto-flow.").option("--page <file>", "page JSON file (default: .pagectl/page.json, auto-created on first use)").option("--type <type>", "block type: text|header|button|container").option("--id <id>", "unique block id").option("--content <text>", "block text content").option("--style <kv>", "CSS style as key=value (repeatable)", collect, []).option("--class <name>", "extra CSS class (repeatable)", collect, []).option("--raw-content", "use --content verbatim instead of auto-wrapping it").option("--width <n>", "override the type default width").option("--height <n>", "override the type default height").option("--below <id>", "anchor: place below this block id").option("--right-of <id>", "anchor: place to the right of this block id").option("--align <value>", "left|center|right, used with --below", "left").option("--gap <n>", "override the CLI default gap for anchor placement").option("--x <n>", "explicit x (escape hatch; requires --y)").option("--y <n>", "explicit y (escape hatch; requires --x)").option("--parent <id>", "not supported in v1 \u2014 always refused, out of scope").option("--dry-run", "compute and report without writing").option("--json", "emit structured JSON").option("--no-input", "fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)").action((options) => runCommand(!!options.json, () => addBlockCommand(options)));
program.command("update-block").description("Nudge a block one grid step, or jump to an explicit --x/--y, and/or fix its content/style/class.").option("--page <file>", "page JSON file (default: .pagectl/page.json, auto-created on first use)").option("--id <id>", "block id").option("--left", "nudge left one grid step").option("--right", "nudge right one grid step").option("--up", "nudge up one grid step").option("--down", "nudge down one grid step").option("--x <n>", "explicit x (escape hatch for a large move; requires --y)").option("--y <n>", "explicit y (escape hatch for a large move; requires --x)").option("--content <text>", "new text content").option("--style <kv>", "CSS style as key=value (repeatable)", collect, []).option("--class <name>", "extra CSS class (repeatable)", collect, []).option("--raw-content", "use --content verbatim instead of auto-wrapping it").option("--dry-run", "compute and report without writing").option("--json", "emit structured JSON").option("--no-input", "fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)").action((options) => runCommand(!!options.json, () => updateBlockCommand(options)));
program.command("remove-block").description("Remove a block from a page.").option("--page <file>", "page JSON file (default: .pagectl/page.json, auto-created on first use)").option("--id <id>", "block id").option("--dry-run", "compute and report without writing").option("--json", "emit structured JSON").option("--no-input", "fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)").action((options) => runCommand(!!options.json, () => removeBlockCommand(options)));
program.command("reorder-block").description("Change a block's array order (auto-flow order / z-order), not its position.").option("--page <file>", "page JSON file (default: .pagectl/page.json, auto-created on first use)").option("--id <id>", "block id to move").option("--before <id>", "move before this block id").option("--after <id>", "move after this block id").option("--dry-run", "compute and report without writing").option("--json", "emit structured JSON").option("--no-input", "fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)").action((options) => runCommand(!!options.json, () => reorderBlockCommand(options)));
program.command("inspect").description("Print canvas info, next auto-flow y, and every block's box.").option("--page <file>", "page JSON file (default: .pagectl/page.json, auto-created on first use)").option("--json", "emit structured JSON").option("--no-input", "fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)").action((options) => runCommand(!!options.json, () => inspectCommand(options)));
program.command("validate").description("Schema + scope + overlap + out-of-bounds + stale-inlineStyle checks, each with a fix hint.").option("--page <file>", "page JSON file (default: .pagectl/page.json, auto-created on first use)").option("--fix", "auto-repair blocks whose inlineStyle has drifted from position/dimensions/style").option("--json", "emit structured JSON").option("--no-input", "fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)").action((options) => runCommand(!!options.json, () => validateCommand(options)));
program.command("build").description('Rough static HTML/CSS export for shipping/inspection (NOT a preview of the real editor \u2014 use "serve" for that).').option("--page <file>", "page JSON file (default: .pagectl/page.json, auto-created on first use)").option("-o, --out <dir>", "output directory (default: pagectl-output)").option("--dry-run", "compute and report without writing").option("--json", "emit structured JSON").option("--no-input", "fail fast instead of prompting (pagectl never prompts; this is always the effective behavior)").action((options) => runCommand(!!options.json, () => buildCommand(options)));
program.command("serve [file]").description("Serve the real page-builder editor backed by the default (or given) page file; watches it on disk for live updates. Refuses to double-start in the same directory.").option("-p, --port <port>", "port to try first; falls back to the next free port if taken", "4321").action(async (file, options) => {
  await serveCommand(file, options);
});
var wantsJson = process.argv.includes("--json");
program.exitOverride();
try {
  await program.parseAsync(process.argv);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  const code = err.exitCode ?? 2;
  if (code === 0)
    process.exit(0);
  if (wantsJson) {
    process.stdout.write(
      JSON.stringify({ error: message, fix: 'Run "pagectl schema" for the full command tree and flag list.' }) + "\n"
    );
  } else {
    console.error(`Error: ${message}`);
  }
  process.exitCode = 2;
}
//# sourceMappingURL=index.js.map
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { CANVAS, escapeHtml, getBlocks, type Block } from '../schema.js';
import { emitResult, loadPageFile, transientErr, type BaseFlags } from '../cliRuntime.js';
import { renderInlineStyle } from '../layout.js';

export interface BuildOptions extends BaseFlags {
  page?: string;
  out?: string;
}

const NOT_A_PREVIEW_NOTE =
  'This is a rough static export (template-based, no headless browser) — not pixel parity with the real editor. For an accurate live view, use "pagectl serve" instead.';

const require = createRequire(import.meta.url);

/* Links the real, already-built CSS verbatim into the output instead of
   hand-writing CSS — gets close visual parity for classes like
   .button-component/.text-component without needing a browser to compute
   it. No headless browser, no Playwright: per-block-type HTML templates. */
function readCoreCss(): string {
  try {
    const corePkgJson = require.resolve('@mindfiredigital/page-builder/package.json');
    const cssPath = resolve(dirname(corePkgJson), 'dist/styles/index.css');
    return readFileSync(cssPath, 'utf8');
  } catch (err) {
    transientErr(
      `Could not locate @mindfiredigital/page-builder's built CSS: ${(err as Error).message}`,
      'Run the core package build first ("pnpm --filter @mindfiredigital/page-builder build"), then retry.'
    );
  }
}

function renderBlock(block: Block): string {
  /* inlineStyle is the canonical rendering source (same one the real
     editor reads on restore) — fall back to recomputing it only for
     blocks written before that was true. */
  const style =
    block.inlineStyle ||
    renderInlineStyle(
      { x: block.position.x, y: block.position.y, width: block.dimensions.width, height: block.dimensions.height },
      block.style
    );
  const classAttr = block.classes.join(' ');

  switch (block.type) {
    case 'button':
      return `<button id="${escapeHtml(block.id)}" class="${escapeHtml(classAttr)}" style="${escapeHtml(style)}">${block.content}</button>`;
    case 'text':
    case 'header':
    case 'container':
    default:
      return `<div id="${escapeHtml(block.id)}" class="${escapeHtml(classAttr)}" style="${escapeHtml(style)}">${block.content}</div>`;
  }
}

export function buildCommand(options: BuildOptions): void {
  const { page } = loadPageFile(options.page);
  const blocks = getBlocks(page);
  const css = readCoreCss();

  const bodyBlocks = blocks.map(renderBlock).join('\n  ');
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

  const outDir = resolve(options.out ?? 'pagectl-output');

  if (options.dryRun) {
    emitResult(!!options.json, { status: 'dry-run', outDir, blockCount: blocks.length, note: NOT_A_PREVIEW_NOTE }, () =>
      console.error(`[dry-run] Would write ${outDir}/index.html and ${outDir}/styles.css`)
    );
    return;
  }

  mkdirSync(outDir, { recursive: true });
  writeFileSync(resolve(outDir, 'index.html'), html, 'utf8');
  writeFileSync(resolve(outDir, 'styles.css'), css, 'utf8');

  emitResult(!!options.json, { status: 'built', outDir, blockCount: blocks.length, note: NOT_A_PREVIEW_NOTE }, () => {
    console.log(`Wrote ${resolve(outDir, 'index.html')}`);
    console.log(`Wrote ${resolve(outDir, 'styles.css')}`);
    console.log(NOT_A_PREVIEW_NOTE);
  });
}

import { getCanvasRoot } from '../schema.js';
import { badInput, emitResult, loadPageFile, parseKeyValueList, writePageFileAtomic, type BaseFlags } from '../cliRuntime.js';

export interface SetCanvasOptions extends BaseFlags {
  page?: string;
  style?: string[];
}

/* The canvas root entry (id "canvas", type "canvas") is excluded from
   getBlocks() everywhere else in the CLI (add-block/validate/overlap
   checks never see it), but it's a real entry in the page JSON with its
   own style/inlineStyle — CanvasStateManager.restoreState() in
   packages/core applies canvas.inlineStyle straight onto the DOM canvas
   element via setAttribute('style', ...) whenever it's non-empty. That's
   the only supported way to theme the page itself (e.g. an off-white
   "newsprint" background) without adding a full-bleed block that would
   overlap every other block on the page and fail validate. Deliberately
   narrow: only style is settable here, never position/dimensions — those
   stay owned by CANVAS.width/height and harnessPage.ts's width pinning. */
export function setCanvasCommand(options: SetCanvasOptions): void {
  const style = parseKeyValueList(options.style, '--style');
  if (Object.keys(style).length === 0) {
    badInput('--style is required (at least one key=value pair).', 'Pass e.g. --style background-color=#f2ede4.');
  }

  const { page, path } = loadPageFile(options.page);
  const canvas = getCanvasRoot(page);
  if (!canvas) {
    badInput('Page is missing its canvas root entry (id "canvas", type "canvas").', 'Recreate the page with "pagectl new <slug>".');
  }

  const nextStyle = { ...canvas.style, ...style };
  const inlineStyle =
    Object.entries(nextStyle)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ') + (Object.keys(nextStyle).length ? ';' : '');

  const nextCanvas = { ...canvas, style: nextStyle, inlineStyle };
  const nextPage = page.map(block => (block.id === 'canvas' && block.type === 'canvas' ? nextCanvas : block));

  if (options.dryRun) {
    emitResult(!!options.json, { status: 'dry-run', path, style: nextStyle, inlineStyle }, () =>
      console.log(`[dry-run] Would set canvas style -> ${inlineStyle}`)
    );
    return;
  }

  writePageFileAtomic(path, nextPage);

  emitResult(!!options.json, { status: 'updated', path, style: nextStyle, inlineStyle }, () => {
    console.log(`Updated canvas style -> ${inlineStyle} -> ${path}`);
  });
}

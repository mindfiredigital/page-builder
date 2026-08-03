import { BLOCKS, hasTextSpan, isBlockType, DIRECTION_VALUES, type Direction } from '../schema.js';
import {
  badInput,
  emitResult,
  loadPageFile,
  notFoundErr,
  parseKeyValueList,
  writePageFileAtomic,
  type BaseFlags,
} from '../cliRuntime.js';
import { clampAndSnap, computeExplicitPosition, nudge, renderInlineStyle, type Box } from '../layout.js';

export interface UpdateBlockOptions extends BaseFlags {
  page?: string;
  id: string;
  left?: boolean;
  right?: boolean;
  up?: boolean;
  down?: boolean;
  x?: string;
  y?: string;
  width?: string;
  height?: string;
  content?: string;
  src?: string;
  style?: string[];
  class?: string[];
  rawContent?: boolean;
}

export function updateBlockCommand(options: UpdateBlockOptions): void {
  if (!options.id) badInput('--id is required.', 'Pass --id <block id>.');

  const directionFlags: Record<Direction, boolean | undefined> = {
    left: options.left,
    right: options.right,
    up: options.up,
    down: options.down,
  };
  const directions = DIRECTION_VALUES.filter(d => directionFlags[d]);
  if (directions.length > 1) {
    badInput('Only one of --left/--right/--up/--down may be set per call.', `Call update-block once per direction — "a lot" is repeated calls, not a bigger step.`);
  }

  if ((options.x && !options.y) || (options.y && !options.x)) {
    badInput('--x and --y must be passed together.', 'Pass both --x and --y, or neither.');
  }
  const hasExplicitMove = !!(options.x && options.y);
  if (hasExplicitMove && directions.length > 0) {
    badInput(
      'Cannot combine --x/--y with a direction flag in the same call.',
      'Use --x/--y to jump to an exact position, or --left/--right/--up/--down to nudge relatively — not both at once.'
    );
  }

  const hasContentEdit = options.content !== undefined;
  const hasSrcEdit = options.src !== undefined;
  const hasStyleEdit = (options.style ?? []).length > 0;
  const hasClassEdit = (options.class ?? []).length > 0;

  /* Unlike --x/--y, width and height are independent CSS properties, not a
     coordinate pair — either may be passed alone (e.g. widen a block
     without touching its height). */
  const hasResize = options.width !== undefined || options.height !== undefined;
  if (options.width !== undefined) {
    const w = Number(options.width);
    if (!Number.isFinite(w) || w <= 0) badInput('--width must be a positive number.', 'Pass a positive number of pixels.');
  }
  if (options.height !== undefined) {
    const h = Number(options.height);
    if (!Number.isFinite(h) || h <= 0) badInput('--height must be a positive number.', 'Pass a positive number of pixels.');
  }

  if (directions.length === 0 && !hasExplicitMove && !hasResize && !hasContentEdit && !hasSrcEdit && !hasStyleEdit && !hasClassEdit) {
    badInput(
      'Nothing to update.',
      `Pass a direction (--left/--right/--up/--down), an explicit --x/--y, --width/--height, and/or --content/--src/--style/--class. Valid directions: ${DIRECTION_VALUES.join(', ')}.`
    );
  }

  const { page, path } = loadPageFile(options.page);
  const index = page.findIndex(b => b.id === options.id && b.id !== 'canvas');
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
      'This block was likely created outside pagectl; edit it in the page-builder UI instead.'
    );
  }
  const def = BLOCKS[block.type];

  const updated = { ...block, style: { ...block.style }, classes: [...block.classes] };
  let status: string = 'updated';

  /* Resize is resolved before position: a wider/taller block may need
     re-clamping against the canvas margin even if the caller didn't ask
     to move it (see the resize-only branch below), and an explicit
     --x/--y or nudge in the same call should clamp/snap against the *new*
     dimensions, not the stale ones. */
  const newWidth = options.width !== undefined ? Number(options.width) : block.dimensions.width;
  const newHeight = options.height !== undefined ? Number(options.height) : block.dimensions.height;
  if (hasResize) {
    updated.dimensions = { width: newWidth, height: newHeight };
  }

  if (directions.length === 1) {
    const box: Box = { x: block.position.x, y: block.position.y, width: newWidth, height: newHeight };
    const result = nudge(box, directions[0]);
    updated.position = { x: result.box.x, y: result.box.y };
    status = result.status;
  } else if (hasExplicitMove) {
    const placement = computeExplicitPosition(Number(options.x), Number(options.y), newWidth, newHeight);
    updated.position = { x: placement.box.x, y: placement.box.y };
    status = placement.clamped ? 'clamped-to-edge' : 'moved';
  } else if (hasResize) {
    /* No move requested, but a bigger box can still push past the canvas
       margin at the block's existing position — re-clamp/snap it against
       the new dimensions rather than leaving position untouched (matching
       findOutOfBounds's own right-edge check in layout.ts). Status is
       derived from comparing the actual before/after position, not
       clampAndSnap's own `clamped` flag: CANVAS.margin (75) isn't a
       multiple of CANVAS.grid (8), so a block already sitting exactly at
       the margin — the common case, e.g. any default-aligned block — snaps
       to 72 and then clamps straight back to 75, tripping `clamped: true`
       even though the position never actually changes. That's fine for
       addBlock's one-shot placement (it doesn't compare to a prior
       position), but here it would mislabel a no-op resize as
       "resized-clamped" and make an agent think the block moved when it
       didn't. */
    const { box } = clampAndSnap(block.position.x, block.position.y, newWidth, newHeight);
    updated.position = { x: box.x, y: box.y };
    const positionChanged = box.x !== block.position.x || box.y !== block.position.y;
    status = positionChanged ? 'resized-clamped' : 'resized';
  }

  if (hasContentEdit) {
    if (block.type === 'container') {
      badInput('container blocks take no --content in pagectl v1 (no children).', 'Drop --content for container blocks.');
    }
    if (options.rawContent) {
      if (def.requiresTextSpan && !hasTextSpan(options.content!)) {
        badInput(
          `--raw-content for type "${block.type}" is missing the required component-text-content span.`,
          `Include <span class="component-text-content" contenteditable="true">...</span> in --content, or drop --raw-content to have pagectl wrap it for you.`
        );
      }
      updated.content = options.content!;
    } else {
      updated.content = def.defaultContent(options.content);
    }
  }

  if (hasSrcEdit) {
    if (block.type !== 'image') {
      badInput('--src is only valid for image blocks.', `Block "${options.id}" is type "${block.type}".`);
    }
    updated.imageSrc = options.src;
  }

  if (hasStyleEdit) {
    Object.assign(updated.style, parseKeyValueList(options.style, '--style'));
  }

  /* addBlock.ts bakes a min-width/min-height into every block's own style
     equal to its creation-time width/height, to beat a couple of real-editor
     CSS floors (container's 100px min-height/min-width class, and a
     preview-canvas width clamp — see addBlock.ts's own comment). Resizing
     via update-block without also bumping those would leave the OLD,
     smaller floor in place, which silently wins over the new, larger
     width/height and makes the resize invisible in the real editor — the
     exact bug class documented in addBlock.ts, just triggered from this
     command instead. Caller-supplied --style min-width/min-height (this
     call) still wins, same precedence as addBlock. */
  if (hasResize) {
    const styleOverride = hasStyleEdit ? parseKeyValueList(options.style, '--style') : {};
    if (!('min-height' in styleOverride)) updated.style['min-height'] = `${newHeight}px`;
    if (!('min-width' in styleOverride)) updated.style['min-width'] = `${newWidth}px`;
  }

  if (hasClassEdit) {
    updated.classes = Array.from(new Set([...updated.classes, ...(options.class ?? [])]));
  }

  const resultBox = { x: updated.position.x, y: updated.position.y, width: updated.dimensions.width, height: updated.dimensions.height };

  /* Regenerated unconditionally (not just when position/style actually
     changed) — inlineStyle is the only thing the real library reads to
     position a block on restore, so it must always stay in sync with
     position/dimensions/style, never left stale. */
  updated.inlineStyle = renderInlineStyle(resultBox, updated.style);

  const nextPage = [...page];
  nextPage[index] = updated;

  if (options.dryRun) {
    emitResult(!!options.json, { status: 'dry-run', id: options.id, path, box: resultBox }, () =>
      console.log(`[dry-run] Would update "${options.id}"`)
    );
    return;
  }

  writePageFileAtomic(path, nextPage);

  emitResult(!!options.json, { status, id: options.id, path, box: resultBox }, () => {
    console.log(`Updated "${options.id}" -> ${status} @ (${resultBox.x}, ${resultBox.y}) -> ${path}`);
  });
}

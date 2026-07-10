import { CANVAS, getBlocks, type Align, type Block, type Direction } from './schema.js';
import { badInput, notFoundErr } from './cliRuntime.js';

export interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function snap(value: number): number {
  return Math.round(value / CANVAS.grid) * CANVAS.grid;
}

/** The real library's restoreState()/applyDesign() only ever reads
    `inlineStyle` to position a block — `position.x/y` is round-tripped as
    data but nothing turns it back into CSS on restore (only a live
    drag actually sets element.style.left/top directly). So this is the
    canonical rendering source, not `position`/`style` — every command that
    sets a block's box or style must regenerate this string, or the block
    is present in the JSON but invisible/unpositioned in the real editor. */
export function renderInlineStyle(box: Box, extraStyle: Record<string, string> = {}): string {
  const declarations = [
    'position: absolute',
    `left: ${box.x}px`,
    `top: ${box.y}px`,
    `width: ${box.width}px`,
    `height: ${box.height}px`,
    ...Object.entries(extraStyle).map(([key, value]) => `${key}: ${value}`),
  ];
  return declarations.join('; ') + ';';
}

function clampX(x: number, width: number): number {
  const max = Math.max(0, CANVAS.width - width);
  return Math.min(Math.max(x, 0), max);
}

function clampY(y: number): number {
  return Math.max(y, 0);
}

/** Snaps to the grid, then clamps to the canvas bounds. Reports whether
    clamping actually changed the snapped value — callers use this to
    distinguish "moved" from "clamped-to-edge" / "clamped-no-change". */
export function clampAndSnap(x: number, y: number, width: number, height: number): { box: Box; clamped: boolean } {
  const snappedX = snap(x);
  const snappedY = snap(y);
  const clampedX = clampX(snappedX, width);
  const clampedY = clampY(snappedY);
  return {
    box: { x: clampedX, y: clampedY, width, height },
    clamped: clampedX !== snappedX || clampedY !== snappedY,
  };
}

/** Auto-flow cursor = max(all existing blocks' y + height) + gap, not the
    previous array entry's Y — an anchor-placed block earlier in the page
    can otherwise get overlapped by the next auto-flow block, since the
    cursor wasn't tracking the true visual bottom. */
export function nextAutoFlowY(page: Block[]): number {
  const blocks = getBlocks(page);
  if (blocks.length === 0) return CANVAS.gap;
  const maxBottom = Math.max(...blocks.map(b => b.position.y + b.dimensions.height));
  return maxBottom + CANVAS.gap;
}

/** --align defaults to 'left' (the historical CANVAS.gap-from-the-left
    behavior); 'center'/'right' align against the full canvas width, same
    vocabulary as --below's anchor-relative align, since a top-level
    auto-flow block's only real "anchor" is the canvas itself. */
export function computeAutoFlowPosition(
  page: Block[],
  width: number,
  height: number,
  align: Align = 'left'
): { box: Box; clamped: boolean } {
  const y = nextAutoFlowY(page);
  let x: number;
  switch (align) {
    case 'left':
      x = CANVAS.gap;
      break;
    case 'center':
      x = CANVAS.width / 2 - width / 2;
      break;
    case 'right':
      x = CANVAS.width - CANVAS.gap - width;
      break;
  }
  return clampAndSnap(x, y, width, height);
}

function findAnchor(page: Block[], anchorId: string): Block {
  const anchor = getBlocks(page).find(b => b.id === anchorId);
  if (!anchor) {
    notFoundErr(
      `Anchor block "${anchorId}" not found on this page.`,
      'Check the id with "pagectl inspect --page <file>" and retry.'
    );
  }
  return anchor;
}

function alignX(anchor: Block, width: number, align: Align): number {
  switch (align) {
    case 'left':
      return anchor.position.x;
    case 'center':
      return anchor.position.x + anchor.dimensions.width / 2 - width / 2;
    case 'right':
      return anchor.position.x + anchor.dimensions.width - width;
  }
}

export function computeBelowPosition(
  page: Block[],
  anchorId: string,
  width: number,
  height: number,
  align: Align,
  gap: number
): { box: Box; clamped: boolean } {
  const anchor = findAnchor(page, anchorId);
  const x = alignX(anchor, width, align);
  const y = anchor.position.y + anchor.dimensions.height + gap;
  return clampAndSnap(x, y, width, height);
}

export function computeRightOfPosition(
  page: Block[],
  anchorId: string,
  width: number,
  height: number,
  gap: number
): { box: Box; clamped: boolean } {
  const anchor = findAnchor(page, anchorId);
  const x = anchor.position.x + anchor.dimensions.width + gap;
  const y = anchor.position.y;
  return clampAndSnap(x, y, width, height);
}

export function computeExplicitPosition(x: number, y: number, width: number, height: number): { box: Box; clamped: boolean } {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    badInput('--x and --y must both be finite numbers.', 'Pass both --x and --y as numbers, e.g. --x 40 --y 20.');
  }
  return clampAndSnap(x, y, width, height);
}

export type NudgeStatus = 'moved' | 'clamped-no-change' | 'clamped-to-edge';

/** Direction-only move, fixed CLI-owned step. "A little" vs "a lot" is
    expressed by calling this multiple times, never by the agent picking a
    pixel amount. */
export function nudge(box: Box, direction: Direction): { box: Box; status: NudgeStatus } {
  let rawX = box.x;
  let rawY = box.y;
  switch (direction) {
    case 'left':
      rawX -= CANVAS.nudgeStep;
      break;
    case 'right':
      rawX += CANVAS.nudgeStep;
      break;
    case 'up':
      rawY -= CANVAS.nudgeStep;
      break;
    case 'down':
      rawY += CANVAS.nudgeStep;
      break;
  }

  const { box: newBox } = clampAndSnap(rawX, rawY, box.width, box.height);

  let status: NudgeStatus;
  if (newBox.x === box.x && newBox.y === box.y) {
    status = 'clamped-no-change';
  } else if (newBox.x !== snap(rawX) || newBox.y !== snap(rawY)) {
    status = 'clamped-to-edge';
  } else {
    status = 'moved';
  }

  return { box: newBox, status };
}

export interface Overlap {
  a: string;
  b: string;
}

/** Exact bounding-box intersection with a small tolerance to absorb
    grid-snap rounding, not a hair-trigger false positive. */
export function findOverlaps(blocks: Block[], tolerance = 2): Overlap[] {
  const overlaps: Overlap[] = [];
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
      if (intersects) overlaps.push({ a: a.id, b: b.id });
    }
  }
  return overlaps;
}

export interface OutOfBounds {
  id: string;
  reason: string;
}

export function findOutOfBounds(blocks: Block[]): OutOfBounds[] {
  const issues: OutOfBounds[] = [];
  for (const b of blocks) {
    if (b.position.x < 0) issues.push({ id: b.id, reason: `x (${b.position.x}) is negative.` });
    if (b.position.y < 0) issues.push({ id: b.id, reason: `y (${b.position.y}) is negative.` });
    if (b.position.x + b.dimensions.width > CANVAS.width) {
      issues.push({
        id: b.id,
        reason: `right edge (${b.position.x + b.dimensions.width}) exceeds canvas width (${CANVAS.width}).`,
      });
    }
  }
  return issues;
}

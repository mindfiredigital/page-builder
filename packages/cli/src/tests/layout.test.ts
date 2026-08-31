import { CANVAS } from '../schema.js';
import { clampAndSnap, computeAutoFlowPosition, findOutOfBounds } from '../layout.js';
import type { Block } from '../schema.js';

/* Regression coverage for CANVAS.margin: the real editor's own
   CanvasDragHandler.js boundary-clamp refuses to let a top-level absolute
   block sit closer than CANVAS.margin to any canvas edge (preview-printable
   mode, which pagectl always uses) — confirmed live with Playwright. Every
   position pagectl computes must already respect that margin, or the real
   editor silently repositions/shrinks the block and any anchor math built
   on top of it (--below/--right-of) goes wrong. */
describe('CANVAS.margin-aware clamping', () => {
  it('clampAndSnap never returns x below CANVAS.margin', () => {
    const { box } = clampAndSnap(0, 0, 100, 50);
    expect(box.x).toBe(CANVAS.margin);
  });

  it('clampAndSnap never returns y below CANVAS.margin', () => {
    const { box } = clampAndSnap(200, 0, 100, 50);
    expect(box.y).toBe(CANVAS.margin);
  });

  it('clampAndSnap keeps the right edge within CANVAS.width - CANVAS.margin when it fits', () => {
    const { box } = clampAndSnap(CANVAS.width, 100, 200, 50);
    expect(box.x + box.width).toBeLessThanOrEqual(CANVAS.width - CANVAS.margin);
  });

  it('computeAutoFlowPosition default (left) align lands flush on the margin, not 0', () => {
    const { box } = computeAutoFlowPosition([], 300, 50, 'left');
    expect(box.x).toBe(CANVAS.margin);
    expect(box.y).toBe(CANVAS.margin);
  });

  it('computeAutoFlowPosition right align keeps the right edge within one grid step of CANVAS.width - CANVAS.margin', () => {
    // CANVAS.margin (75) isn't itself a multiple of CANVAS.grid (8), so the
    // grid-snapped x can land up to one grid step short of an exact flush edge.
    const { box } = computeAutoFlowPosition([], 300, 50, 'right');
    expect(CANVAS.width - CANVAS.margin - (box.x + box.width)).toBeLessThan(CANVAS.grid);
    expect(box.x + box.width).toBeLessThanOrEqual(CANVAS.width - CANVAS.margin);
  });
});

describe('findOutOfBounds with CANVAS.margin', () => {
  const makeBlock = (overrides: Partial<Block> = {}): Block => ({
    id: 'b1',
    type: 'text',
    content: 'hi',
    position: { x: CANVAS.margin, y: CANVAS.margin },
    dimensions: { width: 100, height: 50 },
    style: {},
    inlineStyle: '',
    classes: [],
    dataAttributes: {},
    ...overrides,
  });

  it('flags a block positioned inside the margin even though it is technically on-canvas', () => {
    const issues = findOutOfBounds([makeBlock({ position: { x: 24, y: 24 } })]);
    expect(issues.length).toBeGreaterThan(0);
    expect(issues[0].reason).toMatch(/canvas margin/);
  });

  it('flags a block whose right edge crosses into the margin', () => {
    const issues = findOutOfBounds([makeBlock({ position: { x: CANVAS.margin, y: CANVAS.margin }, dimensions: { width: CANVAS.width, height: 50 } })]);
    expect(issues.some(i => i.reason.includes('right edge'))).toBe(true);
  });

  it('passes a block that fully respects the margin on both edges', () => {
    const issues = findOutOfBounds([makeBlock({ dimensions: { width: CANVAS.width - 2 * CANVAS.margin, height: 50 } })]);
    expect(issues).toEqual([]);
  });
});

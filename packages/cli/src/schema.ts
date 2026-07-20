import { z } from 'zod';

/* Every number the CLI ever produces (position, gap, grid) comes from here.
   The agent picks words (type, direction, anchor id, align) — never a pixel
   value — and these constants are what turns those words into numbers.
   CLI-side only: never written into the exported page JSON. */
export const CANVAS = {
  /* True A4-shaped print page, not an invented widescreen canvas. 869x1123
     is the real editor's own absolute-mode print-preview shape: 869 is
     packages/core's `#canvas.preview-printable` max-width (see
     packages/core/dist/styles/layout/canvas-modes.css), and 1123 is the
     height its own full-screen preview modal uses for an absolute-layout
     page (previewModalBuilder.ts's `isAbsolute` iframe: width 869 x
     min-height 1123 — A4 portrait at 96dpi is 794x1123px, and 869 is that
     same print-preview treatment with extra side padding baked in). Using
     these exact numbers means pagectl's fixed-size override in
     harnessPage.ts pins the canvas to what the real editor already treats
     as its printable-page shape, instead of fighting it into a wider one. */
  width: 869,
  height: 1123,
  gap: 24,
  grid: 8,
  nudgeStep: 8,
  /* Mirrors packages/core's `#canvas.preview-printable` padding (75px on
     top/left/right — see packages/core/dist/styles/layout/canvas-modes.css).
     pagectl always adds "preview-printable" to every canvas root (see
     ABSOLUTE_CANVAS_CLASSES below), which puts every live "serve" session
     in that mode. In that mode, CanvasDragHandler.js's own boundary-clamp
     logic refuses to let a top-level absolute block's left/top go below
     this margin, or its right edge cross (canvas width − margin) —
     confirmed live with Playwright: a block positioned/sized without
     respecting this gets silently repositioned/left where pagectl's own
     math didn't expect it, breaking any --below/--right-of anchored off
     of it. CANVAS.gap remains the spacing *between* sibling blocks;
     CANVAS.margin is the minimum distance from the canvas edge itself —
     different concerns, both real. There is no bottom padding in the real
     CSS (top/left/right only), which is why clampY/findOutOfBounds only
     ever floor y, never cap the bottom edge — a magazine page is allowed
     to run longer than one A4 height and scroll. */
  margin: 75,
} as const;

/* The one page file pagectl reads/writes when --page is omitted. Every
   command defaults here, so an agent given zero file-naming instructions
   has nothing else to reach for — there's exactly one obvious target per
   directory, and it's the same one `serve` watches by default too. */
export const DEFAULT_PAGE_DIR = '.pagectl';
export const DEFAULT_PAGE_FILENAME = 'page.json';

export const BLOCK_TYPES = ['text', 'header', 'button', 'container', 'image'] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export const ALIGN_VALUES = ['left', 'center', 'right'] as const;
export type Align = (typeof ALIGN_VALUES)[number];

export const DIRECTION_VALUES = ['left', 'right', 'up', 'down'] as const;
export type Direction = (typeof DIRECTION_VALUES)[number];

export function isBlockType(type: string): type is BlockType {
  return (BLOCK_TYPES as readonly string[]).includes(type);
}

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Matches the exact markup packages/core/src/components/{Text,Header}Component.ts
   produce: a contenteditable span carrying the "component-text-content" class.
   Restoring a text/header block's `content` without this span is the exact
   gap that crashed the real library earlier in this project. */
export function wrapTextSpan(text: string): string {
  return `<span class="component-text-content" contenteditable="true">${escapeHtml(text)}</span>`;
}

const TEXT_CONTENT_SPAN_RE = /class="[^"]*\bcomponent-text-content\b[^"]*"/;

export function hasTextSpan(html: string): boolean {
  return TEXT_CONTENT_SPAN_RE.test(html);
}

/* Mirrors packages/core/src/constants/iconConstant.ts's EDIT_PENCIL_ICON.
   The CLI has no dependency on core's constants module, so this is
   duplicated rather than imported. */
const EDIT_PENCIL_ICON = '🖊️';

/* Matches the exact DOM packages/core/src/components/ImageComponent.ts's
   create() produces (upload-placeholder div, hidden file input, pencil
   button, <img>). CanvasStateManager.restoreState() overwrites a restored
   image block's children with this `content`, then ImageComponent.
   restoreImageUpload() queries into it for `img`, `.upload-btn`,
   `input[type=file]`, and a generic placeholder `div` — so all four must
   be present or restore silently no-ops. The actual URL is never baked in
   here; it lives in the block's own top-level `imageSrc` field, which
   restoreImageUpload reads separately. */
export function imageContentTemplate(): string {
  return (
    '<div>Click to upload image</div>' +
    '<input type="file" accept="image/*" style="display: none;" />' +
    `<button class="upload-btn" style="position: absolute; padding: 8px; background: transparent; border: none; cursor: pointer; opacity: 0; transition: opacity 0.2s; left: 50%; top: 50%; transform: translate(-50%, -50%); font-size: 24px;">${EDIT_PENCIL_ICON}</button>` +
    '<img alt="" style="width: 100%; height: 100%; object-fit: contain; border: none; display: none;" />'
  );
}

export interface BlockDefinition {
  type: BlockType;
  label: string;
  defaultWidth: number;
  defaultHeight: number;
  /** Base class CanvasComponentFactory.createComponent() gives this type. */
  baseClass: string;
  requiresTextSpan: boolean;
  defaultText?: string;
  defaultContent(text?: string): string;
}

/* Block palette mapped to the exact real `type` strings from page-builder's
   own sidebar (CanvasComponentFactory's factoryMap) — "header", not
   "heading". Container is scoped to v1's "no children" cut: its content is
   always empty. */
export const BLOCKS: Record<BlockType, BlockDefinition> = {
  text: {
    type: 'text',
    label: 'Text',
    defaultWidth: 300,
    defaultHeight: 50,
    baseClass: 'text-component',
    requiresTextSpan: true,
    defaultText: 'Sample Text',
    defaultContent: (text = 'Sample Text') => wrapTextSpan(text),
  },
  header: {
    type: 'header',
    label: 'Header',
    defaultWidth: 400,
    defaultHeight: 60,
    baseClass: 'header-component',
    requiresTextSpan: true,
    defaultText: 'Header',
    defaultContent: (text = 'Header') => wrapTextSpan(text),
  },
  button: {
    type: 'button',
    label: 'Button',
    defaultWidth: 160,
    defaultHeight: 48,
    baseClass: 'button-component',
    requiresTextSpan: false,
    defaultText: 'Click Me',
    defaultContent: (text = 'Click Me') => escapeHtml(text),
  },
  container: {
    type: 'container',
    label: 'Container',
    defaultWidth: 300,
    defaultHeight: 200,
    baseClass: 'container-component',
    requiresTextSpan: false,
    defaultContent: () => '',
  },
  image: {
    type: 'image',
    label: 'Image',
    defaultWidth: 300,
    defaultHeight: 300,
    baseClass: 'image-component',
    requiresTextSpan: false,
    defaultContent: () => imageContentTemplate(),
  },
};

/* Grounded in the real CSS (packages/core/src/styles/components/{header,text}.css)
   for line-height — header is 24px/700, text is 16px/1.5 — but avgCharWidth
   is calibrated against an actual observed render rather than pure font
   theory: a naive ~0.6em-per-char estimate for the 24px bold header
   predicted a 32-char string would fit one line at 600px width, but it
   really wrapped to two (the delete-icon/label chrome sharing the box eats
   more horizontal room than font metrics alone account for). Deliberately
   one-directional — this only ever grows a block's height above the flat
   type default, never shrinks it — trading "a little taller than strictly
   needed" for "never overlaps the next auto-flow block". */
const WRAP_METRICS: Partial<Record<BlockType, { lineHeight: number; avgCharWidth: number }>> = {
  header: { lineHeight: 32, avgCharWidth: 25 },
  text: { lineHeight: 24, avgCharWidth: 14 },
};

const WRAP_PADDING = 16;

export function estimateWrappedHeight(type: BlockType, text: string, width: number, minHeight: number): number {
  const metrics = WRAP_METRICS[type];
  if (!metrics || !text) return minHeight;

  const usableWidth = Math.max(width - WRAP_PADDING, 40);
  const charsPerLine = Math.max(Math.floor(usableWidth / metrics.avgCharWidth), 1);
  const lines = Math.max(Math.ceil(text.length / charsPerLine), 1);
  const estimated = lines * metrics.lineHeight + WRAP_PADDING;

  return Math.max(minHeight, estimated);
}

/* Mirrors `PageComponent` from packages/core/src/types/types.d.ts. This is
   also the literal file format `serve` broadcasts to the real
   page-builder-web-component, so it is not a CLI-invented shape — it is the
   real design JSON, canvas root included. */
export const blockSchema = z.object({
  id: z.string().min(1),
  type: z.string().min(1),
  content: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  dimensions: z.object({ width: z.number(), height: z.number() }),
  style: z.record(z.string()).default({}),
  inlineStyle: z.string().default(''),
  classes: z.array(z.string()).default([]),
  dataAttributes: z.record(z.string()).default({}),
  imageSrc: z.string().nullable().optional(),
  videoSrc: z.string().nullable().optional(),
  props: z.record(z.unknown()).optional(),
});

export const pageSchema = z.array(blockSchema).min(1);

export type Block = z.infer<typeof blockSchema>;
export type Page = Block[];

/* 'preview-printable' + 'preview-desktop' are the real editor's own markers
   for absolute-mode canvas chrome (CanvasInitializer.ts adds them once at
   mount time, gated on layoutMode === 'absolute'). CanvasStateManager's
   restoreState() — the function that both the initial page load AND every
   live "serve" push (add-block/update-block/etc.) go through — always does
   `canvasElement.className = ''` and then re-adds ONLY whatever is in this
   canvas entry's `classes` array, discarding anything the mount-time init
   added. A page.json whose canvas.classes is [] therefore loses its
   absolute-mode chrome the moment any live edit is pushed, even though
   layoutMode itself never actually changes — reads as "flipped to grid" in
   the browser without a reload (which re-adds them, then immediately loses
   them again the same way, but you don't see the one settled frame).
   Baking them into the canvas root here is the CLI-side fix: v1 pages are
   absolute-only, so these two classes belong on every canvas root pagectl
   ever writes. */
export const ABSOLUTE_CANVAS_CLASSES = ['preview-printable', 'preview-desktop'];

export function makeCanvasRoot(): Block {
  return {
    id: 'canvas',
    type: 'canvas',
    content: '',
    position: { x: 0, y: 0 },
    dimensions: { width: CANVAS.width, height: CANVAS.height },
    style: {},
    inlineStyle: '',
    classes: [...ABSOLUTE_CANVAS_CLASSES],
    dataAttributes: {},
  };
}

export function getCanvasRoot(page: Block[]): Block | undefined {
  return page.find(b => b.id === 'canvas' && b.type === 'canvas');
}

export function getBlocks(page: Block[]): Block[] {
  return page.filter(b => !(b.id === 'canvas' && b.type === 'canvas'));
}

export interface ScopeViolation {
  reason: string;
  fix: string;
}

/* v1 scope cut, enforced on every read: flat, top-level, absolute-mode
   pages using text/header/button/container/image only. Grid-mode pages,
   nested containers, video/table/richtext/link/twoCol/threeCol/landingpage
   and multi-page projects refuse with a clear error instead of silently
   misbehaving. */
export function checkScope(page: Block[]): ScopeViolation | null {
  const canvas = getCanvasRoot(page);
  if (!canvas) {
    return {
      reason: 'Page is missing its canvas root entry (id "canvas", type "canvas").',
      fix: 'Use "pagectl new <slug>" to create a valid page instead of hand-assembling the array.',
    };
  }

  if (canvas.classes.includes('grid-layout-active')) {
    return {
      reason: 'Page is in grid layout mode; pagectl v1 only supports absolute-mode pages.',
      fix: 'Grid-mode pages are out of scope for this CLI version — edit them in the page-builder UI instead.',
    };
  }

  for (const block of getBlocks(page)) {
    if (!isBlockType(block.type)) {
      return {
        reason: `Block "${block.id}" has type "${block.type}", which is outside pagectl v1's supported palette (${BLOCK_TYPES.join(', ')}).`,
        fix: 'video/table/richtext/link/twoCol/threeCol/landingpage blocks and nested containers are out of scope for this CLI version.',
      };
    }
  }

  return null;
}

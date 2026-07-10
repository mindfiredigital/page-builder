import { z } from 'zod';

/* Every number the CLI ever produces (position, gap, grid) comes from here.
   The agent picks words (type, direction, anchor id, align) — never a pixel
   value — and these constants are what turns those words into numbers.
   CLI-side only: never written into the exported page JSON. */
export const CANVAS = {
  width: 1200,
  height: 800,
  gap: 24,
  grid: 8,
  nudgeStep: 8,
} as const;

/* The one page file pagectl reads/writes when --page is omitted. Every
   command defaults here, so an agent given zero file-naming instructions
   has nothing else to reach for — there's exactly one obvious target per
   directory, and it's the same one `serve` watches by default too. */
export const DEFAULT_PAGE_DIR = '.pagectl';
export const DEFAULT_PAGE_FILENAME = 'page.json';

export const BLOCK_TYPES = ['text', 'header', 'button', 'container'] as const;
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

export function makeCanvasRoot(): Block {
  return {
    id: 'canvas',
    type: 'canvas',
    content: '',
    position: { x: 0, y: 0 },
    dimensions: { width: CANVAS.width, height: CANVAS.height },
    style: {},
    inlineStyle: '',
    classes: [],
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
   pages using text/header/button/container only. Grid-mode pages, nested
   containers, image/video/table/richtext/link/twoCol/threeCol/landingpage
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
        fix: 'image/video/table/richtext/link/twoCol/threeCol/landingpage blocks and nested containers are out of scope for this CLI version.',
      };
    }
  }

  return null;
}

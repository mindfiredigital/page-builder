import {
  ALIGN_VALUES,
  BLOCKS,
  BLOCK_TYPES,
  estimateWrappedHeight,
  getBlocks,
  hasTextSpan,
  isBlockType,
  type Align,
} from '../schema.js';
import {
  badInput,
  emitResult,
  loadPageFile,
  parseKeyValueList,
  writePageFileAtomic,
  type BaseFlags,
} from '../cliRuntime.js';
import {
  computeAutoFlowPosition,
  computeBelowPosition,
  computeExplicitPosition,
  computeRightOfPosition,
  renderInlineStyle,
} from '../layout.js';
import { CANVAS } from '../schema.js';

export interface AddBlockOptions extends BaseFlags {
  page?: string;
  type: string;
  id: string;
  content?: string;
  style?: string[];
  class?: string[];
  rawContent?: boolean;
  width?: string;
  height?: string;
  below?: string;
  rightOf?: string;
  align?: string;
  gap?: string;
  x?: string;
  y?: string;
  parent?: string;
}

export function addBlockCommand(options: AddBlockOptions): void {
  if (!options.type) badInput('--type is required.', `Pass --type <${BLOCK_TYPES.join('|')}>.`);
  if (!options.id) badInput('--id is required.', 'Pass a unique --id for this block.');

  if (options.parent) {
    badInput(
      'Nesting a block inside a container is out of scope for pagectl v1.',
      'Add the block top-level instead; nested containers are not supported.'
    );
  }

  if (!isBlockType(options.type)) {
    badInput(
      `Unknown block type "${options.type}".`,
      `Supported types in pagectl v1: ${BLOCK_TYPES.join(', ')}. Run "pagectl list-blocks" for details.`
    );
  }

  const def = BLOCKS[options.type];
  const { page, path } = loadPageFile(options.page);
  const blocks = getBlocks(page);

  const width = options.width ? Number(options.width) : def.defaultWidth;

  // Only estimate when height wasn't explicitly given, and only for
  // plain (non-raw) text/header content — --raw-content is an escape
  // hatch the caller already owns full responsibility for.
  const rawText = !options.rawContent ? (options.content ?? def.defaultText ?? '') : '';
  const height = options.height ? Number(options.height) : estimateWrappedHeight(options.type, rawText, width, def.defaultHeight);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    badInput('--width and --height must be positive numbers.', 'Omit them to use the type default, or pass positive numbers.');
  }

  let content: string;
  if (options.type === 'container') {
    if (options.content) {
      badInput(
        'container blocks take no --content in pagectl v1 (no children).',
        'Drop --content for container blocks.'
      );
    }
    content = def.defaultContent();
  } else if (options.rawContent) {
    if (!options.content) {
      badInput('--raw-content requires --content.', 'Pass --content "<markup>" alongside --raw-content.');
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

  const existing = blocks.find(b => b.id === options.id);
  const style = parseKeyValueList(options.style, '--style');
  const classes = Array.from(new Set([def.baseClass, ...(options.class ?? [])]));

  if (existing) {
    const candidateSameShape =
      existing.type === options.type &&
      existing.content === content &&
      JSON.stringify(existing.style) === JSON.stringify({ ...existing.style, ...style }) &&
      classes.every(c => existing.classes.includes(c));

    if (candidateSameShape) {
      emitResult(!!options.json, { status: 'already-exists', id: options.id, path }, () => {
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
    badInput('--below and --right-of cannot both be set.', 'Pick exactly one anchor relationship.');
  }
  if ((options.x && !options.y) || (options.y && !options.x)) {
    badInput('--x and --y must be passed together.', 'Pass both --x and --y, or neither.');
  }

  const align = (options.align ?? 'left') as Align;
  if (!ALIGN_VALUES.includes(align)) {
    badInput(`Unknown --align "${options.align}".`, `Use one of: ${ALIGN_VALUES.join(', ')}.`);
  }
  const gap = options.gap ? Number(options.gap) : CANVAS.gap;
  if (!Number.isFinite(gap) || gap < 0) {
    badInput('--gap must be a non-negative number.', 'Omit --gap to use the CLI default.');
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
    dataAttributes: {},
  };

  const nextPage = [...page, newBlock];

  if (options.dryRun) {
    emitResult(
      !!options.json,
      { status: 'dry-run', id: options.id, path, box: placement.box, clamped: placement.clamped },
      () => console.log(`[dry-run] Would add "${options.id}" at (${placement.box.x}, ${placement.box.y})`)
    );
    return;
  }

  writePageFileAtomic(path, nextPage);

  emitResult(
    !!options.json,
    { status: 'created', id: options.id, path, box: placement.box, clamped: placement.clamped },
    () => {
      console.log(
        `Added "${options.id}" (${options.type}) at (${placement.box.x}, ${placement.box.y}) ${placement.box.width}x${placement.box.height}${
          placement.clamped ? ' [clamped]' : ''
        } -> ${path}`
      );
    }
  );
}

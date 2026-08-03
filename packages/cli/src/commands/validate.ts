import { existsSync, readFileSync } from 'node:fs';
import {
  ABSOLUTE_CANVAS_CLASSES,
  CANVAS,
  checkScope,
  estimateWrappedHeight,
  extractPlainText,
  getBlocks,
  getCanvasRoot,
  isBlockType,
  makeCanvasRoot,
  pageSchema,
  type Block,
} from '../schema.js';
import {
  badInput,
  emitResult,
  EXIT,
  findSiblingPageFiles,
  resolvePagePath,
  slugFromPageFilePath,
  writePageFileAtomic,
  type BaseFlags,
} from '../cliRuntime.js';
import { findOutOfBounds, findOverlaps, renderInlineStyle } from '../layout.js';

export interface ValidateOptions extends BaseFlags {
  page?: string;
  fix?: boolean;
}

interface Issue {
  kind: 'schema' | 'scope' | 'overlap' | 'out-of-bounds' | 'stale-inline-style' | 'stale-canvas-classes' | 'possible-text-overflow';
  message: string;
  fix: string;
}

/* Scope: top-level blocks only, matching the container-nesting scope cut.
   Unlike loadPageFile()'s other callers, this one keeps its own read loop
   instead of erroring immediately on schema problems — it needs to report
   *all* issues (schema, scope, overlap, out-of-bounds) in one pass. */
export function validateCommand(options: ValidateOptions): void {
  const { path: filePath, isDefault } = resolvePagePath(options.page);
  const issues: Issue[] = [];

  if (!existsSync(filePath)) {
    if (isDefault) {
      writePageFileAtomic(filePath, [makeCanvasRoot()]);
    } else {
      const slug = slugFromPageFilePath(filePath);
      const createHint = slug ? `pagectl new ${slug}` : `pagectl new <slug> --out ${filePath}`;
      const siblings = findSiblingPageFiles(filePath);
      const fix =
        siblings.length > 0
          ? `Found existing page file(s) in this directory: ${siblings.join(', ')}. Pass one of them as --page if that's what you meant, or create a new one with "${createHint}".`
          : `Create it first with "${createHint}", or omit --page to validate the default page.`;
      badInput(`Page file not found: ${filePath}`, fix);
    }
  }

  let raw: string;
  try {
    raw = readFileSync(filePath, 'utf8');
  } catch (err) {
    badInput(`Could not read ${filePath}: ${(err as Error).message}`, 'Check file permissions and retry.');
  }

  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    issues.push({
      kind: 'schema',
      message: `Invalid JSON: ${(err as Error).message}`,
      fix: 'Fix the JSON syntax by hand, or regenerate the file with "pagectl new".',
    });
    report(options, filePath, issues, 0);
    return;
  }

  const parsed = pageSchema.safeParse(data);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      issues.push({
        kind: 'schema',
        message: `${issue.path.join('.') || '(root)'}: ${issue.message}`,
        fix: 'Match the PageComponent shape (id, type, content, position, dimensions, style, inlineStyle, classes, dataAttributes).',
      });
    }
    report(options, filePath, issues, 0);
    return;
  }

  const violation = checkScope(parsed.data);
  if (violation) {
    issues.push({ kind: 'scope', message: violation.reason, fix: violation.fix });
  }

  /* The real editor's restoreState() replaces the canvas element's entire
     classList with whatever is in this canvas entry's `classes` array on
     EVERY restore — including the live push a "serve" session broadcasts
     after every add-block/update-block/etc. A canvas entry missing its
     absolute-mode chrome classes (e.g. from a page.json written before
     this was understood, or hand-edited) renders fine on the very first
     load's own restore, then loses that chrome on the next live edit —
     reads as "flipped to grid layout" even though nothing in the JSON's
     block positions is wrong. */
  const canvasRoot = !violation ? getCanvasRoot(parsed.data) : undefined;
  const missingCanvasClasses = canvasRoot
    ? ABSOLUTE_CANVAS_CLASSES.filter(cls => !canvasRoot.classes.includes(cls))
    : [];
  if (missingCanvasClasses.length > 0) {
    issues.push({
      kind: 'stale-canvas-classes',
      message: `Canvas root is missing absolute-mode chrome class(es) (${missingCanvasClasses.join(', ')}) — the live "serve" preview will lose them on the next edit and appear to fall out of absolute layout.`,
      fix: options.fix
        ? 'Repairing automatically (--fix was passed).'
        : 'Re-run with --fix to repair automatically.',
    });
  }

  const blocks = getBlocks(parsed.data);

  /* inlineStyle is the only thing the real editor reads to position a
     block on restore (see layout.ts's renderInlineStyle doc comment) —
     blocks written before that was understood (or hand-edited) can drift
     out of sync with position/dimensions/style. Detect and, with --fix,
     repair them in place. */
  const staleIds = new Set<string>();
  for (const block of blocks) {
    const expected = renderInlineStyle(
      { x: block.position.x, y: block.position.y, width: block.dimensions.width, height: block.dimensions.height },
      block.style
    );
    if (block.inlineStyle !== expected) {
      staleIds.add(block.id);
      issues.push({
        kind: 'stale-inline-style',
        message: `"${block.id}"'s inlineStyle doesn't match its position/dimensions/style, so the real editor won't render it where the JSON says it is.`,
        fix: options.fix
          ? 'Repairing automatically (--fix was passed).'
          : `Re-run with --fix to repair automatically, or touch it once with "pagectl update-block --page ${filePath} --id ${block.id} --right --left" (net zero move, regenerates inlineStyle).`,
      });
    }
  }

  for (const overlap of findOverlaps(blocks)) {
    issues.push({
      kind: 'overlap',
      message: `"${overlap.a}" and "${overlap.b}" overlap.`,
      fix: `Move one of them apart with repeated "pagectl update-block --page ${filePath} --id ${overlap.b} --left/--right/--up/--down" calls.`,
    });
  }

  for (const oob of findOutOfBounds(blocks)) {
    issues.push({
      kind: 'out-of-bounds',
      message: `"${oob.id}": ${oob.reason}`,
      fix: `Reposition it with "pagectl update-block --page ${filePath} --id ${oob.id} --left/--right/--up/--down" until it's back on canvas (${CANVAS.width}x${CANVAS.height}).`,
    });
  }

  /* Heuristic, not exact math — same estimator addBlock.ts uses when
     --height is omitted, but here re-run against EVERY text/header block's
     actual declared height and actual style (including any custom
     font-size), whether that height came from the estimator or was set
     explicitly. That gap — nothing ever checked an explicit --height
     against the real font-size — is exactly how two real layout bugs
     shipped past a clean "validate" in this project: a masthead and a
     column title, both custom-sized, both wrapped to an extra line inside
     a box sized for one. estimateWrappedHeight is deliberately
     one-directional (over- rather than under-predicts), so this errs
     toward flagging borderline cases rather than missing real ones. */
  const overflowEstimates = new Map<string, number>();
  for (const block of blocks) {
    if (!isBlockType(block.type)) continue;
    if (block.type !== 'text' && block.type !== 'header') continue;

    const plainText = extractPlainText(block.content);
    const estimated = Math.round(estimateWrappedHeight(block.type, plainText, block.dimensions.width, 0, block.style));

    if (estimated > block.dimensions.height) {
      overflowEstimates.set(block.id, estimated);
      issues.push({
        kind: 'possible-text-overflow',
        message: `"${block.id}"'s content likely wraps past its declared height (${block.dimensions.height}px) at its font-size — estimated ~${estimated}px needed.`,
        fix: options.fix
          ? 'Repairing automatically (--fix was passed): growing height to fit.'
          : `Re-run with --fix to grow it automatically, or "pagectl update-block --page ${filePath} --id ${block.id} --height ${estimated}".`,
      });
    }
  }

  const fixCanvasClasses = !!options.fix && missingCanvasClasses.length > 0;
  const fixOverflow = !!options.fix && overflowEstimates.size > 0;
  const didRepair = (!!options.fix && staleIds.size > 0) || fixCanvasClasses || fixOverflow;
  if (didRepair) {
    const repairedPage: Block[] = parsed.data.map(block => {
      if (fixCanvasClasses && block.id === 'canvas' && block.type === 'canvas') {
        return { ...block, classes: Array.from(new Set([...block.classes, ...ABSOLUTE_CANVAS_CLASSES])) };
      }

      let next = block;

      if (overflowEstimates.has(block.id)) {
        const estimatedHeight = overflowEstimates.get(block.id)!;
        const nextStyle = { ...next.style };
        // Same precedence as addBlock/update-block's own min-height floor:
        // only bump it if it was ever set, and always keep it in sync with
        // the real height, so the CSS floor can't silently keep winning.
        if ('min-height' in nextStyle) nextStyle['min-height'] = `${estimatedHeight}px`;
        next = { ...next, dimensions: { ...next.dimensions, height: estimatedHeight }, style: nextStyle };
      }

      if (!staleIds.has(block.id) && !overflowEstimates.has(block.id)) return next;

      return {
        ...next,
        inlineStyle: renderInlineStyle(
          { x: next.position.x, y: next.position.y, width: next.dimensions.width, height: next.dimensions.height },
          next.style
        ),
      };
    });
    writePageFileAtomic(filePath, repairedPage);
  }

  // --fix only resolves stale-inline-style / stale-canvas-classes /
  // possible-text-overflow issues — any other issue (overlap,
  // out-of-bounds, scope, schema) still leaves the page invalid.
  const remainingIssues = didRepair
    ? issues.filter(i => i.kind !== 'stale-inline-style' && i.kind !== 'stale-canvas-classes' && i.kind !== 'possible-text-overflow')
    : issues;

  const repairedCount = didRepair ? staleIds.size + (fixCanvasClasses ? 1 : 0) + (fixOverflow ? overflowEstimates.size : 0) : 0;
  const repairSummary: string[] = [];
  if (didRepair && staleIds.size > 0) repairSummary.push(`stale inlineStyle on ${staleIds.size} block(s)`);
  if (fixCanvasClasses) repairSummary.push('canvas root chrome classes');
  if (fixOverflow) repairSummary.push(`possible text overflow on ${overflowEstimates.size} block(s)`);

  report(options, filePath, remainingIssues, repairedCount, repairSummary);
}

function report(
  options: ValidateOptions,
  filePath: string,
  remainingIssues: Issue[],
  repairedCount: number,
  repairSummary: string[]
): void {
  const valid = remainingIssues.length === 0;

  emitResult(!!options.json, { valid, path: filePath, repairedCount, repaired: repairSummary, issues: remainingIssues }, () => {
    if (repairedCount > 0) {
      console.log(`Repaired ${repairSummary.join(' and ')}: ${filePath}`);
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

  if (!valid) process.exitCode = EXIT.BAD_INPUT;
}

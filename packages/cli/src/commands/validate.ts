import { existsSync, readFileSync } from 'node:fs';
import { CANVAS, checkScope, getBlocks, makeCanvasRoot, pageSchema, type Block } from '../schema.js';
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
  kind: 'schema' | 'scope' | 'overlap' | 'out-of-bounds' | 'stale-inline-style';
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

  const didRepair = !!options.fix && staleIds.size > 0;
  if (didRepair) {
    const repairedPage: Block[] = parsed.data.map(block => {
      if (!staleIds.has(block.id)) return block;
      return {
        ...block,
        inlineStyle: renderInlineStyle(
          { x: block.position.x, y: block.position.y, width: block.dimensions.width, height: block.dimensions.height },
          block.style
        ),
      };
    });
    writePageFileAtomic(filePath, repairedPage);
  }

  // --fix only resolves stale-inline-style issues — any other issue
  // (overlap, out-of-bounds, scope, schema) still leaves the page invalid.
  const remainingIssues = didRepair ? issues.filter(i => i.kind !== 'stale-inline-style') : issues;

  report(options, filePath, remainingIssues, didRepair ? staleIds.size : 0);
}

function report(options: ValidateOptions, filePath: string, remainingIssues: Issue[], repairedCount: number): void {
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

  if (!valid) process.exitCode = EXIT.BAD_INPUT;
}

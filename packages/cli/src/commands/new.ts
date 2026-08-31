import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { makeCanvasRoot, type Block } from '../schema.js';
import { badInput, emitResult, findSiblingPageFiles, writePageFileAtomic, type BaseFlags } from '../cliRuntime.js';

export interface NewOptions extends BaseFlags {
  out?: string;
}

function readExisting(filePath: string): Block[] | null {
  if (!existsSync(filePath)) return null;
  try {
    return JSON.parse(readFileSync(filePath, 'utf8'));
  } catch (err) {
    badInput(
      `${filePath} already exists but is not valid JSON: ${(err as Error).message}`,
      'Delete or fix the file by hand, or pass --force to overwrite it.'
    );
  }
}

export function newCommand(slug: string, options: NewOptions): void {
  const outPath = resolve(options.out ?? `${slug}.page.json`);
  const fresh = [makeCanvasRoot()];
  const existing = readExisting(outPath);

  /* Purely informational — never blocks or changes exit codes. Lets an
     agent that's about to bootstrap a throwaway page notice a real one is
     already sitting right there instead of scattering *.page.json files
     across the working directory. */
  const siblings = findSiblingPageFiles(outPath);
  const note =
    siblings.length > 0
      ? `Other page file(s) already exist in this directory: ${siblings.join(', ')}. If you meant to edit one of those, use "pagectl add-block --page <file> ..." instead of creating a new page.`
      : undefined;

  if (existing) {
    const sameParams = JSON.stringify(existing) === JSON.stringify(fresh);

    if (sameParams) {
      emitResult(!!options.json, { status: 'no-op', slug, path: outPath, note }, () => {
        console.log(`Page "${slug}" already exists with identical params -> ${outPath} (no-op)`);
        if (note) console.log(`Note: ${note}`);
      });
      return;
    }

    if (!options.force) {
      badInput(
        `Page file already exists with different content: ${outPath}`,
        `It already has real content — if you meant to edit it, use "pagectl add-block --page ${outPath} ..." instead. To deliberately reset it to a blank canvas, pass --force.`
      );
    }
  }

  if (options.dryRun) {
    emitResult(!!options.json, { status: 'dry-run', slug, path: outPath, note }, () => {
      console.log(`[dry-run] Would create page "${slug}" -> ${outPath}`);
      if (note) console.log(`Note: ${note}`);
    });
    return;
  }

  writePageFileAtomic(outPath, fresh);

  emitResult(
    !!options.json,
    { status: existing ? 'overwritten' : 'created', slug, path: outPath, note },
    () => {
      console.log(`Created page "${slug}" -> ${outPath}`);
      if (note) console.log(`Note: ${note}`);
    }
  );
}

import { badInput, emitResult, loadPageFile, notFoundErr, writePageFileAtomic, type BaseFlags } from '../cliRuntime.js';

export interface ReorderBlockOptions extends BaseFlags {
  page?: string;
  id: string;
  before?: string;
  after?: string;
}

/* Changes array order only — matters for auto-flow's next placement and
   for DOM/z-order. Does not recompute existing positions; repositioning
   after a reorder is a separate, explicit update-block call. */
export function reorderBlockCommand(options: ReorderBlockOptions): void {
  if (!options.id) badInput('--id is required.', 'Pass --id <block id>.');

  if ((options.before && options.after) || (!options.before && !options.after)) {
    badInput('Pass exactly one of --before or --after.', 'e.g. --before intro or --after intro.');
  }

  const referenceId = (options.before ?? options.after)!;
  const { page, path } = loadPageFile(options.page);

  const sourceIndex = page.findIndex(b => b.id === options.id && b.id !== 'canvas');
  if (sourceIndex === -1) {
    notFoundErr(`Block "${options.id}" not found on this page.`, 'Check the id with "pagectl inspect --page <file>" and retry.');
  }

  const referenceIndex = page.findIndex(b => b.id === referenceId && b.id !== 'canvas');
  if (referenceIndex === -1) {
    notFoundErr(`Reference block "${referenceId}" not found on this page.`, 'Check the id with "pagectl inspect --page <file>" and retry.');
  }

  if (options.id === referenceId) {
    badInput('--id and the reference id must differ.', 'Pick a different reference block.');
  }

  const withoutSource = page.filter((_, i) => i !== sourceIndex);
  const sourceBlock = page[sourceIndex];
  const newReferenceIndex = withoutSource.findIndex(b => b.id === referenceId);
  const insertAt = options.before ? newReferenceIndex : newReferenceIndex + 1;

  const nextPage = [...withoutSource.slice(0, insertAt), sourceBlock, ...withoutSource.slice(insertAt)];
  const order = nextPage.filter(b => b.id !== 'canvas').map(b => b.id);

  if (options.dryRun) {
    emitResult(!!options.json, { status: 'dry-run', path, order }, () => console.log(`[dry-run] Would reorder -> ${order.join(', ')}`));
    return;
  }

  writePageFileAtomic(path, nextPage);

  emitResult(!!options.json, { status: 'reordered', path, order }, () => {
    console.log(`New order: ${order.join(', ')} -> ${path}`);
  });
}

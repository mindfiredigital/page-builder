import { badInput, emitResult, loadPageFile, notFoundErr, writePageFileAtomic, type BaseFlags } from '../cliRuntime.js';

export interface RemoveBlockOptions extends BaseFlags {
  page?: string;
  id: string;
}

/* No cascading/reflow of other blocks' auto-flow positions on removal —
   that would reintroduce silent position changes the agent didn't ask for.
   If removal leaves an ugly gap, that's a separate, explicit update-block
   or re-add decision. */
export function removeBlockCommand(options: RemoveBlockOptions): void {
  if (!options.id) badInput('--id is required.', 'Pass --id <block id>.');

  const { page, path } = loadPageFile(options.page);
  const index = page.findIndex(b => b.id === options.id && b.id !== 'canvas');
  if (index === -1) {
    notFoundErr(
      `Block "${options.id}" not found on this page.`,
      'Check the id with "pagectl inspect --page <file>" and retry.'
    );
  }

  const nextPage = page.filter((_, i) => i !== index);

  if (options.dryRun) {
    emitResult(!!options.json, { status: 'dry-run', id: options.id, path, remaining: nextPage.length - 1 }, () =>
      console.log(`[dry-run] Would remove "${options.id}"`)
    );
    return;
  }

  writePageFileAtomic(path, nextPage);

  emitResult(!!options.json, { status: 'removed', id: options.id, path, remaining: nextPage.length - 1 }, () => {
    console.log(`Removed "${options.id}" (${nextPage.length - 1} block(s) remaining) -> ${path}`);
  });
}

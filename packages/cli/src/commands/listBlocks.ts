import { BLOCKS, BLOCK_TYPES } from '../schema.js';
import { emitResult, type BaseFlags } from '../cliRuntime.js';

export function listBlocksCommand(options: BaseFlags): void {
  const data = BLOCK_TYPES.map(type => {
    const def = BLOCKS[type];
    return {
      type: def.type,
      label: def.label,
      defaultWidth: def.defaultWidth,
      defaultHeight: def.defaultHeight,
      baseClass: def.baseClass,
      requiresTextSpan: def.requiresTextSpan,
      defaultText: def.defaultText ?? null,
    };
  });

  emitResult(!!options.json, data, () => {
    for (const b of data) {
      console.log(`${b.type.padEnd(10)} ${b.defaultWidth}x${b.defaultHeight}  class=${b.baseClass}`);
    }
  });
}

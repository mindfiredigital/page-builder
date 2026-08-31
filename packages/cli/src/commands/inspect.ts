import { CANVAS, getBlocks } from '../schema.js';
import { emitResult, loadPageFile, type BaseFlags } from '../cliRuntime.js';
import { nextAutoFlowY } from '../layout.js';

export interface InspectOptions extends BaseFlags {
  page?: string;
}

export function inspectCommand(options: InspectOptions): void {
  const { page, path } = loadPageFile(options.page);
  const blocks = getBlocks(page);

  const data = {
    path,
    canvas: { width: CANVAS.width, height: CANVAS.height },
    nextAutoFlowY: nextAutoFlowY(page),
    blocks: blocks.map(b => ({
      id: b.id,
      type: b.type,
      x: b.position.x,
      y: b.position.y,
      width: b.dimensions.width,
      height: b.dimensions.height,
    })),
  };

  emitResult(!!options.json, data, () => {
    console.log(`Page: ${data.path}`);
    console.log(`Canvas: ${data.canvas.width}x${data.canvas.height}  next auto-flow y: ${data.nextAutoFlowY}`);
    for (const b of data.blocks) {
      console.log(`  ${b.id.padEnd(20)} ${b.type.padEnd(10)} (${b.x}, ${b.y}) ${b.width}x${b.height}`);
    }
    if (data.blocks.length === 0) console.log('  (no blocks)');
  });
}

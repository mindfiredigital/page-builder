// tsup bundles src/index.ts (and everything statically/dynamically imported
// from it) into a single dist/index.js. Files only ever referenced by a raw
// file path string at runtime (esbuild's `build({ entryPoints: [...] })`
// calls) aren't part of that graph, so they must be copied to dist by hand.
import { copyFileSync } from 'node:fs';

const copies = [['src/serve/libraryEntry.ts', 'dist/libraryEntry.ts']];

for (const [from, to] of copies) {
  copyFileSync(from, to);
  console.log(`Copied ${from} -> ${to}`);
}

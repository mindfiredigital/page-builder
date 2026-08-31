import { build } from 'esbuild';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface BundledLibrary {
  js: string;
  css: string;
}

let cached: BundledLibrary | null = null;

/* Bundles @mindfiredigital/page-builder-web-component into a single
   self-contained script/stylesheet the browser can load directly — no
   Playwright, no headless browser, just esbuild producing static assets
   this process then serves over plain HTTP. */
export async function bundleLibrary(): Promise<BundledLibrary> {
  if (cached) return cached;

  const entry = resolve(__dirname, 'libraryEntry.ts');

  const result = await build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: 'iife',
    platform: 'browser',
    target: 'es2019',
    outdir: resolve(__dirname, '.virtual-out'),
    logLevel: 'silent',
    /* web-component/core declare "sideEffects": false for tree-shaking
       consumers; we import purely for the customElements.define() side
       effect, so keep it despite that hint. */
    ignoreAnnotations: true,
  });

  let js = '';
  let css = '';
  for (const file of result.outputFiles ?? []) {
    if (file.path.endsWith('.css')) css += file.text;
    else js += file.text;
  }

  if (!js) {
    throw new Error('esbuild produced no JS output while bundling the library.');
  }

  cached = { js, css };
  return cached;
}

import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', '@mindfiredigital/page-builder-core'],
  inject: ['./react-shim.js'],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});

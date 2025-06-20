import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: [
    'react',
    'react-dom',
    // Also externalize the web-component, as it's a peer/external
    '@mindfiredigital/page-builder-web-component',
  ],
  injectStyle: true,
});

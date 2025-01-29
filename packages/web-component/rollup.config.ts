const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');
const postcss = require('rollup-plugin-postcss');
const { dts } = require('rollup-plugin-dts');

module.exports = [
  // Main build configuration
  {
    input: 'src/index.ts', // Entry point for the web component
    output: [
      {
        file: 'dist/index.esm.js', // ES Module format
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.iife.js', // IIFE format for browser
        format: 'iife',
        name: 'PageBuilder', // Global variable name
        sourcemap: true,
      },
    ],
    plugins: [
      resolve({ browser: true }), // Ensure we resolve browser-compatible modules
      commonjs(), // Convert CommonJS modules to ES modules
      postcss({
        extensions: ['.css'],
        extract: true,
        minimize: true,
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false, // Handled in separate step
      }),
      terser(), // Minify the JS for production
    ],
    // Only externalize dependencies for ESM, not for IIFE
    external: (id: any) => id.includes('@mindfiredigital/page-builder-core'),
  },
  // Type declaration generation
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

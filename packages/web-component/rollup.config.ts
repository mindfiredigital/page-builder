const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const terser = require('@rollup/plugin-terser');
const postcss = require('rollup-plugin-postcss');
const { dts } = require('rollup-plugin-dts');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');

module.exports = [
  // Main build configuration
  {
    input: 'src/index.ts', // Entry point for the web component
    output: [
      {
        file: 'dist/index.cjs.js', // CommonJS format
        format: 'cjs',
        exports: 'auto',
        sourcemap: true,
      },
      {
        file: 'dist/index.esm.js', // ES Module format
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.iife.js', // IIFE format for direct browser use
        format: 'iife',
        name: 'WebComponent', // Global variable name for the web component
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(), // Exclude peer dependencies if any
      resolve(), // Resolves Node modules
      commonjs(), // Converts CommonJS modules to ES modules
      postcss({
        extensions: ['.css'],
        extract: true, // Extracts CSS into a separate file
        minimize: true, // Minify CSS
      }),
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist',
        compilerOptions: {
          outDir: './dist',
        },
      }),
      terser(), // Minify JS
    ],
  },
  // Type declaration configuration
  {
    input: 'src/index.ts', // Entry point for type declarations
    output: [{ file: 'dist/index.d.ts', format: 'es' }], // Output the type declarations
    plugins: [
      dts(),
      {
        name: 'exclude-css',
        load(id: any) {
          if (id.endsWith('.css')) {
            return ''; // Exclude CSS files from the type declarations
          }
        },
      },
    ],
  },
];

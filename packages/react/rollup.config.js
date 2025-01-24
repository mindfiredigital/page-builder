const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const { babel } = require('@rollup/plugin-babel');
const terser = require('@rollup/plugin-terser');
const postcss = require('rollup-plugin-postcss');
const { dts } = require('rollup-plugin-dts');
const peerDepsExternal = require('rollup-plugin-peer-deps-external');

module.exports = [
  // Main build configuration
  {
    input: 'src/index.tsx', // Entry point for the React wrapper
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
    ],
    plugins: [
      peerDepsExternal(), // Exclude peer dependencies like react, react-dom
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
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/preset-react', '@babel/preset-env'],
        extensions: ['.js', '.jsx', '.ts', '.tsx'], // Include TS and TSX files
      }),
      terser(), // Minify JS
    ],
    external: ['react', 'react-dom'], // Ensure React and ReactDOM are treated as peer dependencies
  },
  // Type declaration configuration
  {
    input: 'src/index.tsx', // Entry point for type declarations
    output: [{ file: 'dist/index.d.ts', format: 'es' }], // Output the type declarations
    plugins: [
      dts(),
      {
        name: 'exclude-css',
        load(id) {
          if (id.endsWith('.css')) {
            return ''; // Exclude CSS files from the type declarations
          }
        },
      },
    ],
  },
];

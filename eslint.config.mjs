import tsParser from "@typescript-eslint/parser";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/*.d.ts",
      "**/documentation/**",
      "**/example/**",
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
      },
      globals: {
        ...globals.builtin,
      },
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "none",
          ignoreRestSiblings: false,
        },
      ],
      // Tracked but non-blocking for now — real usages exist (DOM/custom-element
      // bridging) that are individually judged justified rather than tightened.
      // Ratchet to "error" package-by-package as those are cleaned up.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // Mocking/spying legitimately needs `any` far more often than production
    // code does — don't fight tests over it.
    files: ["**/tests/**/*.{ts,tsx}", "**/*.test.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["packages/react/**/*.{ts,tsx}"],
    plugins: { "react-hooks": reactHooks },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
  {
    // Plain Node build/config scripts — run directly by Node (or a bundler's
    // config loader) outside the package's own module system, so they're
    // legitimately CommonJS regardless of what the package builds.
    files: [
      "**/rollup.config.js",
      "**/webpack.config.js",
      "**/script/*.js",
      ".github/*.js",
    ],
    languageOptions: {
      sourceType: "commonjs",
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];

/**
 * Real, importable exports of the design/component shapes that
 * @mindfiredigital/page-builder-web-component and
 * @mindfiredigital/page-builder-react need to consume.
 *
 * `types.d.ts` declares the canonical versions of these same shapes as
 * ambient globals (for bare-name use across this package's own source,
 * without imports). Ambient `declare global` types cannot be re-exported
 * through this package's `rollup-plugin-dts`-bundled `.d.ts` output — the
 * bundler needs a real module-scoped binding to resolve — so this file
 * mirrors the ones downstream packages actually need as genuine exports.
 *
 * If you change PageComponent/ComponentAttribute/BasicComponent's shape in
 * `types.d.ts`, mirror the change here too.
 */
export {};

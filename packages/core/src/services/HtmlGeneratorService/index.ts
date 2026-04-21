/* ─── HtmlGeneratorService — Public API ───────────────────────────────────────
   Barrel file. Import everything related to HTML generation from this single
   path so consumers never need to know the internal folder structure.

   Usage:
     import { StyleCollector, SvgStamper, ... } from './HtmlGeneratorService';
   ─────────────────────────────────────────────────────────────────────────── */
export { StyleCollector } from './StyleCollector';
export { SvgStamper } from './SvgStamper';
export { EditorChromeSanitizer } from './EditorChromeSanitizer';
export { HtmlShellBuilder } from './HtmlShellBuilder';

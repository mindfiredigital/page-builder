/* ─── HtmlGeneratorService — Public API ───────────────────────────────────────
   Barrel file. Import everything related to HTML generation from this single
   path so consumers never need to know the internal folder structure.

   Usage:
     import { StyleCollector, SvgStamper, ... } from './HtmlGeneratorService.js';
   ─────────────────────────────────────────────────────────────────────────── */
export { StyleCollector } from './StyleCollector.js';
export { SvgStamper } from './SvgStamper.js';
export { EditorChromeSanitizer } from './EditorChromeSanitizer.js';
export { HtmlShellBuilder } from './HtmlShellBuilder.js';

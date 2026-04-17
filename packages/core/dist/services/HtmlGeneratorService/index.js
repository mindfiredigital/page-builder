/* ─── HtmlGeneratorService — Public API ───────────────────────────────────────
   Barrel file. Import everything related to HTML generation from this single
   path so consumers never need to know the internal folder structure.

   Usage:
     import { StyleCollector, SvgStamper, ... } from './HtmlGeneratorService.js';
   ─────────────────────────────────────────────────────────────────────────── */
export {
  EDITOR_CLASSES_TO_REMOVE,
  EDITOR_NODES_SELECTOR,
  SVG_ACCESSIBILITY_SELECTOR,
  EDITOR_ATTRS_TO_STRIP,
  CSS_PROPERTIES_TO_EXCLUDE,
  CSS_CLASSES_TO_EXCLUDE,
  SVG_CHILD_TAGS,
  SVG_STYLE_PROPERTIES,
} from './Constants.js';
export { StyleCollector } from './StyleCollector.js';
export { SvgStamper } from './SvgStamper.js';
export { EditorChromeSanitizer } from './EditorChromeSanitizer.js';
export { HtmlShellBuilder } from './HtmlShellBuilder.js';

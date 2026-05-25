/* ─── EditorClassesToRemove ───────────────────────────────────────────────────
   CSS class names injected by the editor UI that must be stripped from the
   cloned DOM before generating the preview HTML output.
   ─────────────────────────────────────────────────────────────────────────── */
export const EDITOR_CLASSES_TO_REMOVE = [
  'component-controls',
  'delete-icon',
  'component-label',
  'column-label',
  'resizers',
  'resizer',
  'upload-btn',
  'component-resizer',
  'drop-preview',
  'edit-link-form',
  'edit-link',
  'selected',
] as const;

/* ─── EditorNodesSelector ─────────────────────────────────────────────────────
   Combined CSS selector that targets all editor-only DOM nodes to be removed
   from the clone (controls, overlays, inputs, row-management buttons, etc.).
   ─────────────────────────────────────────────────────────────────────────── */
export const EDITOR_NODES_SELECTOR = [
  '.component-controls',
  '.delete-icon',
  '.component-label',
  '.column-label',
  '.resizers',
  '.resizer',
  '.drop-preview',
  '.upload-btn',
  '.edit-link',
  '.edit-link-form',
  '.cell-controls',
  '.insert-row-button',
  '.add-row-button',
  '.add-multiple-rows-button',
  '.table-btn-container',
  '.drop-preview.visible',
  'input:not([type="radio"]):not(.rt-checklist-checkbox)',
  // Rich text editor chrome — controls, popovers, file pickers
  '.rt-block-controls',
  '.rt-add-popover',
  'input[type="file"]',
  // Canvas scroll spacer (absolute-mode layout aid, not real content)
  '#canvas-scroll-spacer',
].join(', ');

/* ─── SvgAccessibilitySelector ────────────────────────────────────────────────
   Targets SVG <title> and <desc> nodes added for editor accessibility that
   should not appear in the exported HTML output.
   ─────────────────────────────────────────────────────────────────────────── */
export const SVG_ACCESSIBILITY_SELECTOR = 'svg title, svg desc';

/* ─── EditorAttrsToStrip ──────────────────────────────────────────────────────
   HTML attributes set by the editor for interactivity that must be removed
   so the static preview does not inherit edit-mode behaviour.
   ─────────────────────────────────────────────────────────────────────────── */
export const EDITOR_ATTRS_TO_STRIP = ['contenteditable', 'draggable'] as const;

/* ─── CssPropertiesToExclude ──────────────────────────────────────────────────
   Computed CSS properties that are layout-context-dependent and must not be
   copied verbatim into the preview stylesheet (position, sizing, logical props).
   ─────────────────────────────────────────────────────────────────────────── */
export const CSS_PROPERTIES_TO_EXCLUDE = [
  'left',
  'top',
  'right',
  'bottom',
  'position',
  'margin-left',
  'margin-right',
  'width',
  'height',
  'min-width',
  'max-width',
  'min-height',
  'max-height',
  'cursor',
  'resize',
  'inline-size',
  'block-size',
  'min-inline-size',
  'min-block-size',
  'max-inline-size',
  'max-block-size',
] as const;

/* ─── CssClassesToExclude ─────────────────────────────────────────────────────
   Class names whose elements should be skipped entirely during computed-style
   collection — they are editor chrome and must not pollute the output CSS.
   ─────────────────────────────────────────────────────────────────────────── */
export const CSS_CLASSES_TO_EXCLUDE = [
  'component-controls',
  'delete-icon',
  'component-label',
  'resizers',
  'resizer',
  'upload-btn',
  'edit-link-form',
  'edit-link',
] as const;

/* ─── SvgChildTags ────────────────────────────────────────────────────────────
   SVG child element tag names that receive special fill/stroke-only style
   treatment instead of the full computed-property dump used for HTML elements.
   ─────────────────────────────────────────────────────────────────────────── */
export const SVG_CHILD_TAGS = ['path', 'circle', 'rect', 'polygon'] as const;

/* ─── SvgStyleProperties ──────────────────────────────────────────────────────
   The subset of CSS properties extracted for SVG child elements — only visual
   paint properties, never layout or box-model properties.
   ─────────────────────────────────────────────────────────────────────────── */
export const SVG_STYLE_PROPERTIES = [
  'fill',
  'stroke',
  'stroke-width',
  'opacity',
  'fill-opacity',
  'stroke-opacity',
] as const;

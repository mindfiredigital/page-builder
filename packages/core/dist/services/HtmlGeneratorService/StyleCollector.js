import { Canvas } from '../../canvas/Canvas.js';
import { CSS_CLASSES_TO_EXCLUDE, CSS_PROPERTIES_TO_EXCLUDE, SVG_CHILD_TAGS, SVG_STYLE_PROPERTIES, } from '../../constants/index.js';
/* ─── StyleCollector ──────────────────────────────────────────────────────────
   Responsible for two tasks:
     1. Harvesting all <style> sheets already present in <head> so they can be
        embedded verbatim inside the exported HTML.
     2. Walking every element in the canvas and generating a self-contained
        stylesheet from their live computed styles.
   ─────────────────────────────────────────────────────────────────────────── */
export class StyleCollector {
    constructor(styleElement) {
        this.styleElement = styleElement;
    }
    /* ─── CollectHeadStyles ─────────────────────────────────────────────────────
       Reads every <style> tag in <head> except the one managed by this class,
       concatenates non-empty text content, and returns the combined string.
       ─────────────────────────────────────────────────────────────────────────── */
    collectHeadStyles() {
        const sheets = [];
        document
            .querySelectorAll('head style')
            .forEach(styleEl => {
            var _a;
            if (styleEl === this.styleElement)
                return;
            const text = (_a = styleEl.textContent) !== null && _a !== void 0 ? _a : '';
            if (text.trim())
                sheets.push(text);
        });
        return sheets.join('\n');
    }
    /* ─── GenerateCSS ───────────────────────────────────────────────────────────
       Walks the entire canvas element tree and builds a stylesheet by reading
       each element's computed styles. SVG children get paint-only properties;
       inline elements get vertical-align forced to bottom to preserve the editor
       alignment; all other elements get the full computed property dump minus
       the excluded layout properties.
       ─────────────────────────────────────────────────────────────────────────── */
    generateCSS() {
        const canvasElement = document.getElementById('canvas');
        if (!canvasElement)
            return '';
        const backgroundColor = window
            .getComputedStyle(canvasElement)
            .getPropertyValue('background-color');
        const styles = [];
        const processedSelectors = new Set();
        /* Calculate the lowest edge of absolute-positioned content so the
           preview canvas min-height covers everything (the scroll spacer is
           stripped from the exported HTML, so absolute children would otherwise
           not push the canvas height). */
        let contentBottom = 0;
        if (Canvas.layoutMode === 'absolute') {
            canvasElement
                .querySelectorAll(':scope > .editable-component')
                .forEach(el => {
                const bottom = (parseFloat(el.style.top) || 0) + el.offsetHeight;
                if (bottom > contentBottom)
                    contentBottom = bottom;
            });
        }
        styles.push(this.buildBaseCSS(backgroundColor, contentBottom));
        canvasElement.querySelectorAll('*').forEach((component, index) => {
            if (CSS_CLASSES_TO_EXCLUDE.some(cls => component.classList.contains(cls)))
                return;
            const computedStyles = window.getComputedStyle(component);
            const componentStyles = [];
            if (this.isSVGElement(component)) {
                this.handleSVGElement(component, componentStyles, computedStyles, index, styles, processedSelectors);
                return;
            }
            /* If this element lives inside a custom component whose outer wrapper
               has a user-set style.color (applied via the sidebar), propagate that
               color to every descendant so the sidebar choice is always honoured.
               Without this, a React-rendered inner element's own style.color (from
               the component's store default) would win due to higher specificity. */
            const ancestorColor = this.findCustomAncestorColor(component, canvasElement);
            this.collectComputedStyles(computedStyles, componentStyles, component, ancestorColor);
            this.applyInlineVerticalAlign(computedStyles, componentStyles);
            const selector = this.generateUniqueSelector(component);
            if (!processedSelectors.has(selector) && componentStyles.length > 0) {
                processedSelectors.add(selector);
                styles.push(`${selector} {\n  ${componentStyles.join('\n  ')}\n}`);
            }
        });
        return styles.join('\n');
    }
    /* ─── ApplyCSS ──────────────────────────────────────────────────────────────
       Writes a CSS string into the managed <style> element so it is immediately
       applied to the live editor canvas without a full page reload.
       ─────────────────────────────────────────────────────────────────────────── */
    applyCSS(css) {
        this.styleElement.textContent = css;
    }
    /* ─── BuildBaseCSS ──────────────────────────────────────────────────────────
       Returns the foundational reset + canvas CSS block. The output differs
       between grid layout mode (overflow:hidden, flex body) and absolute/print
       mode (block canvas, min-height 100vh).
       ─────────────────────────────────────────────────────────────────────────── */
    buildBaseCSS(backgroundColor, contentBottom = 0) {
        if (Canvas.layoutMode === 'grid') {
            return `
      body, html {
        margin: 0; padding: 0; width: 100%; height: 100%;
        box-sizing: border-box; display: flex; overflow: hidden;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      #canvas {
        position: relative; width: 100%; flex-grow: 1; min-width: 0;
        background-color: ${backgroundColor}; margin: 0; overflow: auto;
        box-sizing: border-box;
      }
      #canvas.grid-layout-active { display: block; }
      .container-grid-active { display: block; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 3px; }
      ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      .table-component { border-collapse: collapse; box-sizing: border-box; }
      /* Strip editor visual indicators (dashed border, selection outline, hover glow)
         from the preview. User-set borders are applied via element-specific rules
         generated from inline styles, which have higher specificity than this rule. */
      .editable-component { border: none; outline: none; box-shadow: none; }
      /* .container-component[data-depth="N"] rules in main.css have specificity 0,1,1
         (one class + one attribute selector), which beats the 0,1,0 rule above.
         This rule matches that specificity so later-cascade wins for containers too. */
      .container-component[data-depth] { border: none; outline: none; }
      `;
        }
        /* 75px top + 75px bottom padding; ensure the canvas covers all content */
        const canvasMinHeight = Math.max(1123, contentBottom + 150);
        return `
      body, html {
        margin: 0; padding: 0; width: 100%; height: auto; box-sizing: border-box; background-color: #f8fafc;
        font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        display: block; overflow: auto;
      }
      #canvas.preview-printable {
        background-color: ${backgroundColor}; overflow: visible;
        min-height: ${canvasMinHeight}px; padding-bottom: 75px;
      }
      table { border-collapse: collapse; }
      /* Strip editor visual indicators. User-set borders are applied via element-specific
         rules generated from inline styles, which have higher specificity than this rule. */
      .editable-component { border: none; outline: none; box-shadow: none; }
      .container-component[data-depth] { border: none; outline: none; }
      `;
    }
    /* ─── FindCustomAncestorColor ──────────────────────────────────────────────
       Walks up from the given element to the canvas root. If any ancestor is a
       custom element (hyphenated tag name — e.g. react-component-customtext) AND
       has an explicit style.color set by the sidebar, returns that color string.
       Returns an empty string when no such ancestor exists.
  
       This is needed because when the user sets a color on the outer custom-element
       wrapper via the sidebar, the React-rendered inner elements still carry their
       own style.color (from the component store default). That inner color has higher
       selector specificity and would otherwise override the user's choice in the
       preview. Propagating the ancestor color with !important fixes this.
       ─────────────────────────────────────────────────────────────────────────── */
    findCustomAncestorColor(element, canvas) {
        let ancestor = element.parentElement;
        while (ancestor && ancestor !== canvas) {
            if (ancestor.tagName.toLowerCase().includes('-') &&
                ancestor.style.color) {
                return ancestor.style.color;
            }
            ancestor = ancestor.parentElement;
        }
        return '';
    }
    collectComputedStyles(computedStyles, out, element, ancestorColor) {
        /* If the element has an explicit inline color, skip 'color' from the
           computed pass — we'll emit it with !important below so it always beats
           any conflicting rule that may appear in the embeddedStyles block. */
        const hasInlineColor = !!(element === null || element === void 0 ? void 0 : element.style.color);
        /* When a custom-component ancestor has a user-set color (ancestorColor),
           use that color for this element instead of its own React-rendered color.
           This ensures the sidebar color choice propagates into all inner elements. */
        const effectiveColor = ancestorColor || (hasInlineColor ? element.style.color : '');
        for (let i = 0; i < computedStyles.length; i++) {
            const prop = computedStyles[i];
            const value = computedStyles.getPropertyValue(prop);
            /* Skip properties whose computed values are polluted by editor chrome */
            if (StyleCollector.INLINE_ONLY_PROPS.has(prop))
                continue;
            /* Handled separately with !important via effectiveColor below */
            if (prop === 'color' && effectiveColor)
                continue;
            if (Canvas.layoutMode === 'grid') {
                if (CSS_PROPERTIES_TO_EXCLUDE.includes(prop))
                    continue;
            }
            else {
                if (prop === 'resize')
                    continue;
            }
            if (value &&
                value !== 'initial' &&
                value !== 'auto' &&
                value !== 'none' &&
                value !== '') {
                out.push(`${prop}: ${value};`);
            }
        }
        /* Append user-set decorative styles read from inline styles only */
        if (element) {
            this.collectInlineDecorativeStyles(element, out);
            /* Emit the effective color with !important so it always wins:
               - effectiveColor comes from ancestorColor when a sidebar-colored custom
                 element ancestor is present (propagates the user's choice to inner elements)
               - otherwise effectiveColor is the element's own inline style.color */
            if (effectiveColor) {
                out.push(`color: ${effectiveColor} !important;`);
            }
        }
    }
    /* ─── CollectInlineDecorativeStyles ────────────────────────────────────────
       Reads border and box-shadow values exclusively from the element's inline
       style attribute (i.e. what the user explicitly set via the sidebar).
       If a property is not in the inline style it is omitted, which lets the
       lower-specificity buildBaseCSS rule (.editable-component { border: none })
       act as the safe default — keeping the preview clean for un-bordered elements
       while still showing the correct value for elements the user styled.
       ─────────────────────────────────────────────────────────────────────────── */
    collectInlineDecorativeStyles(element, out) {
        const s = element.style;
        /* Border — shorthand takes priority; fall back to longhand properties */
        if (s.border) {
            out.push(`border: ${s.border};`);
        }
        else {
            if (s.borderWidth)
                out.push(`border-width: ${s.borderWidth};`);
            if (s.borderStyle)
                out.push(`border-style: ${s.borderStyle};`);
            if (s.borderColor)
                out.push(`border-color: ${s.borderColor};`);
            /* Per-side overrides (future-proofing for per-side sidebar controls) */
            ['Top', 'Right', 'Bottom', 'Left'].forEach(side => {
                const sl = side.toLowerCase();
                const w = s[`border${side}Width`];
                const st = s[`border${side}Style`];
                const c = s[`border${side}Color`];
                if (w)
                    out.push(`border-${sl}-width: ${w};`);
                if (st)
                    out.push(`border-${sl}-style: ${st};`);
                if (c)
                    out.push(`border-${sl}-color: ${c};`);
            });
        }
        /* Box-shadow — sidebar has no control yet, but read inline if ever set */
        if (s.boxShadow)
            out.push(`box-shadow: ${s.boxShadow};`);
    }
    /* ─── ApplyInlineVerticalAlign ──────────────────────────────────────────────
       For inline / inline-block / inline-flex elements, replaces whatever
       computed vertical-align value was collected with 'bottom' so that sibling
       components (e.g. a header next to a table) keep their bottom edges aligned
       in the preview exactly as they appear in the editor.
       ─────────────────────────────────────────────────────────────────────────── */
    applyInlineVerticalAlign(computedStyles, componentStyles) {
        const display = computedStyles.getPropertyValue('display');
        const isInline = display === 'inline' ||
            display === 'inline-block' ||
            display === 'inline-flex';
        if (!isInline)
            return;
        const vaIdx = componentStyles.findIndex(s => s.startsWith('vertical-align:'));
        if (vaIdx !== -1)
            componentStyles.splice(vaIdx, 1);
        componentStyles.push('vertical-align: bottom;');
    }
    /* ─── IsSVGElement ──────────────────────────────────────────────────────────
       Returns true when the element is an SVGElement or is a recognised SVG
       child tag nested inside an <svg> — both receive different style treatment.
       ─────────────────────────────────────────────────────────────────────────── */
    isSVGElement(component) {
        return (component instanceof SVGElement ||
            (!!component.closest('svg') &&
                SVG_CHILD_TAGS.includes(component.tagName.toLowerCase())));
    }
    /* ─── HandleSVGElement ──────────────────────────────────────────────────────
       Routes SVG elements to either the child-tag handler (paint props only) or
       the generic SVG handler (full computed styles), then pushes the resulting
       rule into the styles array.
       ─────────────────────────────────────────────────────────────────────────── */
    handleSVGElement(component, componentStyles, computedStyles, index, styles, processedSelectors) {
        const isSVGChild = SVG_CHILD_TAGS.includes(component.tagName.toLowerCase());
        if (isSVGChild) {
            SVG_STYLE_PROPERTIES.forEach(prop => {
                const value = computedStyles.getPropertyValue(prop);
                if (value && value !== 'none' && value !== '' && value !== 'initial') {
                    componentStyles.push(`${prop}: ${value} !important;`);
                }
            });
            if (componentStyles.length > 0) {
                styles.push(`${this.generateSVGSpecificSelector(component, index)} {\n  ${componentStyles.join('\n  ')}\n}`);
            }
            return;
        }
        /* Generic SVG element — full computed dump, resize excluded */
        for (let i = 0; i < computedStyles.length; i++) {
            const prop = computedStyles[i];
            const value = computedStyles.getPropertyValue(prop);
            if (prop === 'resize')
                continue;
            if (value &&
                value !== 'initial' &&
                value !== 'auto' &&
                value !== 'none' &&
                value !== '') {
                componentStyles.push(`${prop}: ${value};`);
            }
        }
        const selector = this.generateUniqueSelector(component);
        if (!processedSelectors.has(selector) && componentStyles.length > 0) {
            processedSelectors.add(selector);
            styles.push(`${selector} {\n  ${componentStyles.join('\n  ')}\n}`);
        }
    }
    /* ─── GenerateSVGSpecificSelector ───────────────────────────────────────────
       Builds a specific CSS selector for an SVG child element by climbing to its
       parent container and parent <svg>, then appending an nth-of-type combinator
       for the element itself to guarantee uniqueness.
       ─────────────────────────────────────────────────────────────────────────── */
    generateSVGSpecificSelector(element, index) {
        const parentSVG = element.closest('svg');
        const parentContainer = parentSVG === null || parentSVG === void 0 ? void 0 : parentSVG.parentElement;
        let selector = '';
        if (parentContainer) {
            if (parentContainer.id) {
                selector += `#${parentContainer.id} `;
            }
            else if (parentContainer.className) {
                const cleanClasses = parentContainer.className
                    .toString()
                    .split(' ')
                    .filter(cls => !cls.includes('component-') &&
                    !cls.includes('delete-') &&
                    !cls.includes('resizer'))
                    .join('.');
                if (cleanClasses)
                    selector += `.${cleanClasses} `;
            }
        }
        if (parentSVG) {
            selector += parentSVG.className.baseVal
                ? `svg.${parentSVG.className.baseVal.split(' ').join('.')} `
                : 'svg ';
        }
        const parent = element.parentElement;
        if (parent) {
            const siblings = Array.from(parent.children).filter(c => c.tagName === element.tagName);
            selector += `${element.tagName.toLowerCase()}:nth-of-type(${siblings.indexOf(element) + 1})`;
        }
        else {
            selector += element.tagName.toLowerCase();
        }
        return selector || `${element.tagName.toLowerCase()}-${index}`;
    }
    /* ─── GenerateUniqueSelector ────────────────────────────────────────────────
       Walks up the DOM from the given element to the canvas root, building a
       depth-first selector path. Uses IDs as anchors where available and appends
       nth-of-type when multiple siblings share the same tag, ensuring each rule
       targets exactly one element.
       ─────────────────────────────────────────────────────────────────────────── */
    generateUniqueSelector(element) {
        var _a;
        if (element.id)
            return `#${element.id}`;
        const selectorPath = [];
        let currentElement = element;
        while (currentElement && currentElement.tagName.toLowerCase() !== 'body') {
            let selector = currentElement.tagName.toLowerCase();
            const cleanClasses = Array.from(currentElement.classList).filter(cls => ![
                'component-controls',
                'delete-icon',
                'component-label',
                'column-label',
                'resizers',
                'resizer',
                'upload-btn',
                'edit-link-form',
                'edit-link',
                'component-resizer',
                'drop-preview',
            ].includes(cls));
            if (cleanClasses.length > 0)
                selector += `.${cleanClasses.join('.')}`;
            const parent = currentElement.parentElement;
            if (parent) {
                const siblings = Array.from(parent.children).filter(c => c.tagName === currentElement.tagName &&
                    !CSS_CLASSES_TO_EXCLUDE.some(cls => c.classList.contains(cls)));
                if (siblings.length > 1)
                    selector += `:nth-of-type(${siblings.indexOf(currentElement) + 1})`;
            }
            selectorPath.unshift(selector);
            if ((_a = currentElement.parentElement) === null || _a === void 0 ? void 0 : _a.id) {
                selectorPath.unshift(`#${currentElement.parentElement.id}`);
                break;
            }
            currentElement = currentElement.parentElement;
        }
        return `#canvas > ${selectorPath.join(' > ')}`;
    }
}
/* ─── CollectComputedStyles ─────────────────────────────────────────────────
   Iterates the full computed style list for a non-SVG element, skipping
   properties in the exclusion list and empty/auto/none values.

   Border paint properties (width/style/color), outline, and box-shadow are
   intentionally excluded from the computed pass — the editor injects its own
   dashed-border and selection/hover glow into the live DOM, so reading them
   from getComputedStyle() would pollute the preview with editor chrome.
   Instead, these properties are sourced exclusively from the element's inline
   style (user-set values) via collectInlineDecorativeStyles().
   ─────────────────────────────────────────────────────────────────────────── */
/* Properties that must come from inline styles, not computed styles.
   Computed values for these include editor-injected chrome (dashed border,
   selection outline, hover glow) that must never appear in the preview. */
StyleCollector.INLINE_ONLY_PROPS = new Set([
    /* Border paint — width / style / color per side */
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
    /* Border image */
    'border-image-source',
    'border-image-slice',
    'border-image-width',
    'border-image-outset',
    'border-image-repeat',
    /* Outline — now used for editor selection/hover indicators */
    'outline',
    'outline-width',
    'outline-style',
    'outline-color',
    'outline-offset',
    /* Box-shadow — selection glow would leak into the preview if captured */
    'box-shadow',
]);

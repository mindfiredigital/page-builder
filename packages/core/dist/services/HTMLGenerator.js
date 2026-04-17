import { Canvas } from '../canvas/Canvas.js';
// ─── Constants ────────────────────────────────────────────────────────────────
const EDITOR_CLASSES_TO_REMOVE = [
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
];
const EDITOR_NODES_SELECTOR = [
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
  '.add-row-button',
  '.add-multiple-rows-button',
  '.table-btn-container',
  '.drop-preview.visible',
  'input:not([type="radio"])',
].join(', ');
const SVG_ACCESSIBILITY_SELECTOR = 'svg title, svg desc';
const EDITOR_ATTRS_TO_STRIP = ['contenteditable', 'draggable'];
// ─── HTMLGenerator ────────────────────────────────────────────────────────────
export class HTMLGenerator {
  constructor(canvas) {
    this.canvas = canvas;
    this.styleElement = document.createElement('style');
    document.head.appendChild(this.styleElement);
  }
  // ─── Public API ─────────────────────────────────────────────────────────────
  generateHTML() {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) {
      console.warn(
        '[HTMLGenerator] Canvas element not found — returning shell.'
      );
      return this.buildHTMLShell('', '');
    }
    const embeddedStyles = this.collectHeadStyles();
    const svgRecords = this.stampSVGDimensions(canvasElement);
    const clone = canvasElement.cloneNode(true);
    this.stripEditorChrome(clone);
    this.restoreSVGStamps(svgRecords);
    return this.buildHTMLShell(clone.innerHTML, embeddedStyles);
  }
  // ─── Phase 1 — collect all head <style> sheets ───────────────────────────────
  collectHeadStyles() {
    const sheets = [];
    document.querySelectorAll('head style').forEach(styleEl => {
      var _a;
      if (styleEl === this.styleElement) return;
      const text =
        (_a = styleEl.textContent) !== null && _a !== void 0 ? _a : '';
      if (text.trim()) sheets.push(text);
    });
    return sheets.join('\n');
  }
  // ─── Phase 5 — stamp SVG dimensions ─────────────────────────────────────────
  stampSVGDimensions(canvas) {
    const records = [];
    canvas.querySelectorAll('svg').forEach(svg => {
      var _a;
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return;
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      const prevWidth = svg.getAttribute('width');
      const prevHeight = svg.getAttribute('height');
      const prevViewBox = svg.getAttribute('viewBox');
      const prevStyle =
        (_a = svg.getAttribute('style')) !== null && _a !== void 0 ? _a : '';
      const addedViewBox = !prevViewBox && w > 0 && h > 0;
      svg.setAttribute('width', String(w));
      svg.setAttribute('height', String(h));
      if (addedViewBox) svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const computed = window.getComputedStyle(svg);
      const disp = computed.getPropertyValue('display');
      const styleExtras = [`width: ${w}px`, `height: ${h}px`, `flex-shrink: 0`];
      if (disp && disp !== 'inline') styleExtras.push(`display: ${disp}`);
      const base = prevStyle
        ? prevStyle.trimEnd().replace(/;?\s*$/, ';') + ' '
        : '';
      svg.setAttribute('style', base + styleExtras.join('; ') + ';');
      records.push({
        el: svg,
        prevWidth,
        prevHeight,
        prevViewBox,
        prevStyle,
        addedViewBox,
      });
    });
    return records;
  }
  restoreSVGStamps(records) {
    records.forEach(
      ({ el, prevWidth, prevHeight, prevViewBox, prevStyle, addedViewBox }) => {
        prevWidth !== null
          ? el.setAttribute('width', prevWidth)
          : el.removeAttribute('width');
        prevHeight !== null
          ? el.setAttribute('height', prevHeight)
          : el.removeAttribute('height');
        if (addedViewBox) el.removeAttribute('viewBox');
        else if (prevViewBox !== null) el.setAttribute('viewBox', prevViewBox);
        if (prevStyle) el.setAttribute('style', prevStyle);
        else el.removeAttribute('style');
      }
    );
  }
  // ─── Phase 7 — strip editor chrome ──────────────────────────────────────────
  stripEditorChrome(root) {
    root
      .querySelectorAll(SVG_ACCESSIBILITY_SELECTOR)
      .forEach(el => el.remove());
    root.querySelectorAll('[class*="MuiRating-label"]').forEach(labelSpan => {
      labelSpan
        .querySelectorAll('input[type="radio"]')
        .forEach(input => input.remove());
      Array.from(labelSpan.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.remove();
      });
    });
    root
      .querySelectorAll('[class*="MuiRating-visuallyHidden"]')
      .forEach(el => el.remove());
    this.stripNodeRecursive(root);
  }
  stripNodeRecursive(el) {
    EDITOR_ATTRS_TO_STRIP.forEach(attr => el.removeAttribute(attr));
    EDITOR_CLASSES_TO_REMOVE.forEach(cls => el.classList.remove(cls));
    el.querySelectorAll(EDITOR_NODES_SELECTOR).forEach(node => node.remove());
    Array.from(el.children).forEach(child => {
      this.stripNodeRecursive(child);
    });
  }
  // ─── Phase 9 — HTML shell ────────────────────────────────────────────────────
  buildHTMLShell(bodyContent, embeddedStyles) {
    const layoutClass =
      Canvas.layoutMode === 'grid' ? 'grid-layout-active' : 'preview-printable';
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Builder</title>
        <style>
      /* Preserve inline element bottom alignment from editor */
      #canvas [style*="display: inline"],
      #canvas [style*="display: inline-block"] {
        vertical-align: bottom;
      }
    </style>
    <style>
${embeddedStyles}
    </style>
    <style>
${this.generateCSS()}
    </style>
  </head>
  <body>
    <div id="canvas" class="${layoutClass}">
${bodyContent}
    </div>
  </body>
</html>`;
  }
  // ─── CSS — Doc 23's approach (computed styles per element) ───────────────────
  generateCSS() {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) return '';
    const backgroundColor = window
      .getComputedStyle(canvasElement)
      .getPropertyValue('background-color');
    const styles = [];
    const processedSelectors = new Set();
    Canvas.layoutMode === 'grid'
      ? styles.push(`
      body, html {
        margin: 0; padding: 0; width: 100%; height: 100%;
        box-sizing: border-box; display: flex; overflow: hidden;
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
      .editable-component { border: none !important; box-shadow: none !important; }
      `)
      : styles.push(`
      body, html {
        margin: 0; padding: 0; width: 100%; height: 100%; box-sizing: border-box; background-color: #f8fafc;
      }
      #canvas.home {
        position: relative; display: block; width: 100%; min-height: 100vh;
        background-color: ${backgroundColor}; margin: 0; overflow: visible;
      }
      table { border-collapse: collapse; }
      .editable-component { border: none !important; box-shadow: none !important; }
      `);
    const classesToExclude = [
      'component-controls',
      'delete-icon',
      'component-label',
      'resizers',
      'resizer',
      'upload-btn',
      'edit-link-form',
      'edit-link',
    ];
    // ✅ From Doc 23: exclude positioning props for grid, keep for absolute
    const propertiesToExclude = [
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
    ];
    const elements = canvasElement.querySelectorAll('*');
    elements.forEach((component, index) => {
      if (classesToExclude.some(cls => component.classList.contains(cls)))
        return;
      const computedStyles = window.getComputedStyle(component);
      const componentStyles = [];
      if (
        component instanceof SVGElement ||
        (component.closest('svg') &&
          ['path', 'circle', 'rect', 'polygon'].includes(
            component.tagName.toLowerCase()
          ))
      ) {
        this.handleSVGElement(
          component,
          componentStyles,
          computedStyles,
          index,
          styles,
          processedSelectors
        );
        return;
      }
      for (let i = 0; i < computedStyles.length; i++) {
        const prop = computedStyles[i];
        const value = computedStyles.getPropertyValue(prop);
        if (Canvas.layoutMode === 'grid') {
          if (prop === 'resize' || propertiesToExclude.includes(prop)) continue;
        } else {
          if (prop === 'resize') continue;
        }
        if (
          value &&
          value !== 'initial' &&
          value !== 'auto' &&
          value !== 'none' &&
          value !== ''
        ) {
          componentStyles.push(`${prop}: ${value};`);
        }
      }
      const selector = this.generateUniqueSelector(component);
      if (!processedSelectors.has(selector) && componentStyles.length > 0) {
        processedSelectors.add(selector);
        styles.push(`${selector} {\n  ${componentStyles.join('\n  ')}\n}`);
      }
      // Inside the elements.forEach loop, after computing componentStyles:
      const display = computedStyles.getPropertyValue('display');
      const isInline =
        display === 'inline' ||
        display === 'inline-block' ||
        display === 'inline-flex';
      if (isInline) {
        // Remove any computed vertical-align and replace with bottom
        const vaIdx = componentStyles.findIndex(s =>
          s.startsWith('vertical-align:')
        );
        if (vaIdx !== -1) componentStyles.splice(vaIdx, 1);
        componentStyles.push('vertical-align: bottom;');
      }
    });
    return styles.join('\n');
  }
  handleSVGElement(
    component,
    componentStyles,
    computedStyles,
    index,
    styles,
    processedSelectors
  ) {
    const isSVGChild = ['path', 'circle', 'rect', 'polygon'].includes(
      component.tagName.toLowerCase()
    );
    if (isSVGChild) {
      const specificSelector = this.generateSVGSpecificSelector(
        component,
        index
      );
      const svgProperties = [
        'fill',
        'stroke',
        'stroke-width',
        'opacity',
        'fill-opacity',
        'stroke-opacity',
      ];
      svgProperties.forEach(prop => {
        const value = computedStyles.getPropertyValue(prop);
        if (value && value !== 'none' && value !== '' && value !== 'initial') {
          componentStyles.push(`${prop}: ${value} !important;`);
        }
      });
      if (componentStyles.length > 0) {
        styles.push(
          `${specificSelector} {\n  ${componentStyles.join('\n  ')}\n}`
        );
      }
    } else {
      for (let i = 0; i < computedStyles.length; i++) {
        const prop = computedStyles[i];
        const value = computedStyles.getPropertyValue(prop);
        if (prop === 'resize') continue;
        if (
          value &&
          value !== 'initial' &&
          value !== 'auto' &&
          value !== 'none' &&
          value !== ''
        ) {
          componentStyles.push(`${prop}: ${value};`);
        }
      }
      const selector = this.generateUniqueSelector(component);
      if (!processedSelectors.has(selector) && componentStyles.length > 0) {
        processedSelectors.add(selector);
        styles.push(`${selector} {\n  ${componentStyles.join('\n  ')}\n}`);
      }
    }
  }
  generateSVGSpecificSelector(element, index) {
    const parentSVG = element.closest('svg');
    const parentContainer =
      parentSVG === null || parentSVG === void 0
        ? void 0
        : parentSVG.parentElement;
    let selector = '';
    if (parentContainer) {
      if (parentContainer.id) {
        selector += `#${parentContainer.id} `;
      } else if (parentContainer.className) {
        const cleanClasses = parentContainer.className
          .toString()
          .split(' ')
          .filter(
            cls =>
              !cls.includes('component-') &&
              !cls.includes('delete-') &&
              !cls.includes('resizer')
          )
          .join('.');
        if (cleanClasses) selector += `.${cleanClasses} `;
      }
    }
    if (parentSVG) {
      selector += parentSVG.className.baseVal
        ? `svg.${parentSVG.className.baseVal.split(' ').join('.')} `
        : 'svg ';
    }
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        c => c.tagName === element.tagName
      );
      selector += `${element.tagName.toLowerCase()}:nth-of-type(${siblings.indexOf(element) + 1})`;
    } else {
      selector += element.tagName.toLowerCase();
    }
    return selector || `${element.tagName.toLowerCase()}-${index}`;
  }
  generateUniqueSelector(element) {
    var _a;
    if (element.id) return `#${element.id}`;
    const selectorPath = [];
    let currentElement = element;
    while (currentElement && currentElement.tagName.toLowerCase() !== 'body') {
      let selector = currentElement.tagName.toLowerCase();
      const cleanClasses = Array.from(currentElement.classList).filter(
        cls =>
          ![
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
          ].includes(cls)
      );
      if (cleanClasses.length > 0) selector += `.${cleanClasses.join('.')}`;
      const parent = currentElement.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          c => c.tagName === currentElement.tagName
        );
        if (siblings.length > 1)
          selector += `:nth-of-type(${siblings.indexOf(currentElement) + 1})`;
      }
      selectorPath.unshift(selector);
      if (
        (_a = currentElement.parentElement) === null || _a === void 0
          ? void 0
          : _a.id
      ) {
        selectorPath.unshift(`#${currentElement.parentElement.id}`);
        break;
      }
      currentElement = currentElement.parentElement;
    }
    return `#canvas > ${selectorPath.join(' > ')}`;
  }
  applyCSS(css) {
    this.styleElement.textContent = css;
  }
}

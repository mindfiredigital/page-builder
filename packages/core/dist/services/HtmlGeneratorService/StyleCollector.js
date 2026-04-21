import { Canvas } from '../../canvas/Canvas.js';
import {
  CSS_CLASSES_TO_EXCLUDE,
  CSS_PROPERTIES_TO_EXCLUDE,
  SVG_CHILD_TAGS,
  SVG_STYLE_PROPERTIES,
} from '../../constants.js';
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
    document.querySelectorAll('head style').forEach(styleEl => {
      var _a;
      if (styleEl === this.styleElement) return;
      const text =
        (_a = styleEl.textContent) !== null && _a !== void 0 ? _a : '';
      if (text.trim()) sheets.push(text);
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
    if (!canvasElement) return '';
    const backgroundColor = window
      .getComputedStyle(canvasElement)
      .getPropertyValue('background-color');
    const styles = [];
    const processedSelectors = new Set();
    styles.push(this.buildBaseCSS(backgroundColor));
    canvasElement.querySelectorAll('*').forEach((component, index) => {
      if (CSS_CLASSES_TO_EXCLUDE.some(cls => component.classList.contains(cls)))
        return;
      const computedStyles = window.getComputedStyle(component);
      const componentStyles = [];
      if (this.isSVGElement(component)) {
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
      this.collectComputedStyles(computedStyles, componentStyles);
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
  buildBaseCSS(backgroundColor) {
    if (Canvas.layoutMode === 'grid') {
      return `
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
      `;
    }
    return `
      body, html {
        margin: 0; padding: 0; width: 100%; height: 100%; box-sizing: border-box; background-color: #f8fafc;
      }
      #canvas.home {
        position: relative; display: block; width: 100%; min-height: 100vh;
        background-color: ${backgroundColor}; margin: 0; overflow: visible;
      }
      table { border-collapse: collapse; }
      .editable-component { border: none !important; box-shadow: none !important; }
      `;
  }
  /* ─── CollectComputedStyles ─────────────────────────────────────────────────
       Iterates the full computed style list for a non-SVG element, skipping
       properties in the exclusion list and empty/auto/none values.
       ─────────────────────────────────────────────────────────────────────────── */
  collectComputedStyles(computedStyles, out) {
    for (let i = 0; i < computedStyles.length; i++) {
      const prop = computedStyles[i];
      const value = computedStyles.getPropertyValue(prop);
      if (Canvas.layoutMode === 'grid') {
        if (CSS_PROPERTIES_TO_EXCLUDE.includes(prop)) continue;
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
        out.push(`${prop}: ${value};`);
      }
    }
  }
  /* ─── ApplyInlineVerticalAlign ──────────────────────────────────────────────
       For inline / inline-block / inline-flex elements, replaces whatever
       computed vertical-align value was collected with 'bottom' so that sibling
       components (e.g. a header next to a table) keep their bottom edges aligned
       in the preview exactly as they appear in the editor.
       ─────────────────────────────────────────────────────────────────────────── */
  applyInlineVerticalAlign(computedStyles, componentStyles) {
    const display = computedStyles.getPropertyValue('display');
    const isInline =
      display === 'inline' ||
      display === 'inline-block' ||
      display === 'inline-flex';
    if (!isInline) return;
    const vaIdx = componentStyles.findIndex(s =>
      s.startsWith('vertical-align:')
    );
    if (vaIdx !== -1) componentStyles.splice(vaIdx, 1);
    componentStyles.push('vertical-align: bottom;');
  }
  /* ─── IsSVGElement ──────────────────────────────────────────────────────────
       Returns true when the element is an SVGElement or is a recognised SVG
       child tag nested inside an <svg> — both receive different style treatment.
       ─────────────────────────────────────────────────────────────────────────── */
  isSVGElement(component) {
    return (
      component instanceof SVGElement ||
      (!!component.closest('svg') &&
        SVG_CHILD_TAGS.includes(component.tagName.toLowerCase()))
    );
  }
  /* ─── HandleSVGElement ──────────────────────────────────────────────────────
       Routes SVG elements to either the child-tag handler (paint props only) or
       the generic SVG handler (full computed styles), then pushes the resulting
       rule into the styles array.
       ─────────────────────────────────────────────────────────────────────────── */
  handleSVGElement(
    component,
    componentStyles,
    computedStyles,
    index,
    styles,
    processedSelectors
  ) {
    const isSVGChild = SVG_CHILD_TAGS.includes(component.tagName.toLowerCase());
    if (isSVGChild) {
      SVG_STYLE_PROPERTIES.forEach(prop => {
        const value = computedStyles.getPropertyValue(prop);
        if (value && value !== 'none' && value !== '' && value !== 'initial') {
          componentStyles.push(`${prop}: ${value} !important;`);
        }
      });
      if (componentStyles.length > 0) {
        styles.push(
          `${this.generateSVGSpecificSelector(component, index)} {\n  ${componentStyles.join('\n  ')}\n}`
        );
      }
      return;
    }
    /* Generic SVG element — full computed dump, resize excluded */
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
  /* ─── GenerateSVGSpecificSelector ───────────────────────────────────────────
       Builds a specific CSS selector for an SVG child element by climbing to its
       parent container and parent <svg>, then appending an nth-of-type combinator
       for the element itself to guarantee uniqueness.
       ─────────────────────────────────────────────────────────────────────────── */
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
  /* ─── GenerateUniqueSelector ────────────────────────────────────────────────
       Walks up the DOM from the given element to the canvas root, building a
       depth-first selector path. Uses IDs as anchors where available and appends
       nth-of-type when multiple siblings share the same tag, ensuring each rule
       targets exactly one element.
       ─────────────────────────────────────────────────────────────────────────── */
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
}

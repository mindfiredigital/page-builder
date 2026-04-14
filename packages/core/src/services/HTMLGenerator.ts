import { Canvas } from '../canvas/Canvas';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SVGRecord {
  el: SVGSVGElement;
  prevWidth: string | null;
  prevHeight: string | null;
  prevViewBox: string | null;
  prevStyle: string;
  addedViewBox: boolean;
}

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
] as const;

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
const EDITOR_ATTRS_TO_STRIP = ['contenteditable', 'draggable'] as const;

// ─── HTMLGenerator ────────────────────────────────────────────────────────────

export class HTMLGenerator {
  private canvas: Canvas;
  private readonly styleElement: HTMLStyleElement;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.styleElement = document.createElement('style');
    document.head.appendChild(this.styleElement);
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  generateHTML(): string {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) {
      console.warn(
        '[HTMLGenerator] Canvas element not found — returning shell.'
      );
      return this.buildHTMLShell('', '');
    }

    const embeddedStyles = this.collectHeadStyles();
    const svgRecords = this.stampSVGDimensions(canvasElement);
    const clone = canvasElement.cloneNode(true) as HTMLElement;

    this.stripEditorChrome(clone);
    this.restoreSVGStamps(svgRecords);

    return this.buildHTMLShell(clone.innerHTML, embeddedStyles);
  }

  // ─── Phase 1 — collect all head <style> sheets ───────────────────────────────

  private collectHeadStyles(): string {
    const sheets: string[] = [];
    document
      .querySelectorAll<HTMLStyleElement>('head style')
      .forEach(styleEl => {
        if (styleEl === this.styleElement) return;
        const text = styleEl.textContent ?? '';
        if (text.trim()) sheets.push(text);
      });
    return sheets.join('\n');
  }

  // ─── Phase 5 — stamp SVG dimensions ─────────────────────────────────────────

  private stampSVGDimensions(canvas: HTMLElement): SVGRecord[] {
    const records: SVGRecord[] = [];

    canvas.querySelectorAll<SVGSVGElement>('svg').forEach(svg => {
      const rect = svg.getBoundingClientRect();
      if (rect.width === 0) return;

      const w = Math.round(rect.width);
      const h = Math.round(rect.height);

      const prevWidth = svg.getAttribute('width');
      const prevHeight = svg.getAttribute('height');
      const prevViewBox = svg.getAttribute('viewBox');
      const prevStyle = svg.getAttribute('style') ?? '';
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

  private restoreSVGStamps(records: SVGRecord[]): void {
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

  private stripEditorChrome(root: HTMLElement): void {
    root
      .querySelectorAll(SVG_ACCESSIBILITY_SELECTOR)
      .forEach(el => el.remove());

    root
      .querySelectorAll<HTMLElement>('[class*="MuiRating-label"]')
      .forEach(labelSpan => {
        labelSpan
          .querySelectorAll('input[type="radio"]')
          .forEach(input => input.remove());
        Array.from(labelSpan.childNodes).forEach(node => {
          if (node.nodeType === Node.TEXT_NODE) node.remove();
        });
      });

    root
      .querySelectorAll<HTMLElement>('[class*="MuiRating-visuallyHidden"]')
      .forEach(el => el.remove());

    this.stripNodeRecursive(root);
  }

  private stripNodeRecursive(el: HTMLElement): void {
    EDITOR_ATTRS_TO_STRIP.forEach(attr => el.removeAttribute(attr));
    EDITOR_CLASSES_TO_REMOVE.forEach(cls => el.classList.remove(cls));
    el.querySelectorAll(EDITOR_NODES_SELECTOR).forEach(node => node.remove());
    Array.from(el.children).forEach(child => {
      this.stripNodeRecursive(child as HTMLElement);
    });
  }

  // ─── Phase 9 — HTML shell ────────────────────────────────────────────────────

  private buildHTMLShell(bodyContent: string, embeddedStyles: string): string {
    const layoutClass =
      Canvas.layoutMode === 'grid' ? 'grid-layout-active' : 'home';

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page Builder</title>
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

  generateCSS(): string {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) return '';

    const backgroundColor = window
      .getComputedStyle(canvasElement)
      .getPropertyValue('background-color');

    const styles: string[] = [];
    const processedSelectors = new Set<string>();

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
        margin: 0; padding: 0; width: 100%; height: 100%; box-sizing: border-box;
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
      const componentStyles: string[] = [];

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
    });

    return styles.join('\n');
  }

  private handleSVGElement(
    component: Element,
    componentStyles: string[],
    computedStyles: CSSStyleDeclaration,
    index: number,
    styles: string[],
    processedSelectors: Set<string>
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

  private generateSVGSpecificSelector(element: Element, index: number): string {
    const parentSVG = element.closest('svg');
    const parentContainer = parentSVG?.parentElement;
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

  private generateUniqueSelector(element: Element): string {
    if (element.id) return `#${element.id}`;

    const selectorPath: string[] = [];
    let currentElement: Element | null = element;

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
          c => c.tagName === currentElement!.tagName
        );
        if (siblings.length > 1)
          selector += `:nth-of-type(${siblings.indexOf(currentElement) + 1})`;
      }

      selectorPath.unshift(selector);

      if (currentElement.parentElement?.id) {
        selectorPath.unshift(`#${currentElement.parentElement.id}`);
        break;
      }
      currentElement = currentElement.parentElement;
    }

    return `#canvas > ${selectorPath.join(' > ')}`;
  }

  applyCSS(css: string): void {
    this.styleElement.textContent = css;
  }
}

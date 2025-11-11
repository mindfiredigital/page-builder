import { Canvas } from '../canvas/Canvas';

export class HTMLGenerator {
  private canvas: Canvas;
  private styleElement: HTMLStyleElement;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
    this.styleElement = document.createElement('style');
    document.head.appendChild(this.styleElement);
  }

  generateHTML(): string {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) {
      console.warn('Canvas element not found!');
      return this.getBaseHTML();
    }

    const cleanCanvas = canvasElement.cloneNode(true) as HTMLElement;
    this.cleanupElements(cleanCanvas);
    return this.getBaseHTML(cleanCanvas.innerHTML);
  }

  private getBaseHTML(bodyContent: string = 'children'): string {
    return `<!DOCTYPE html>
    <html>
      <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Page Builder</title>
          <style>
            ${this.generateCSS()}
          </style>
      </head>
      <body>
          <div id="canvas"  class=${Canvas.layoutMode === 'grid' ? 'grid-layout-active' : 'home'}>
          ${bodyContent}
          </div>
      </body>
    </html>`;
  }
  private cleanupElements(element: HTMLElement) {
    const attributesToRemove = ['contenteditable', 'draggable'];
    const classesToRemove = [
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

    Array.from(element.children).forEach(child => {
      const childElement = child as HTMLElement;

      attributesToRemove.forEach(attr => {
        childElement.removeAttribute(attr);
      });

      const elementsToRemove = childElement.querySelectorAll(
        '.component-controls, .delete-icon, .component-label, .column-label, .resizers, .resizer, .drop-preview, .upload-btn, .edit-link, .edit-link-form, input,.cell-controls,.add-row-button,.add-multiple-rows-button,.table-btn-container, .drop-preview.visible'
      );
      classesToRemove.forEach(classToRemove => {
        childElement.classList.remove(classToRemove);
      });
      elementsToRemove.forEach(el => el.remove());

      if (childElement.children.length > 0) {
        this.cleanupElements(childElement);
      }
    });
  }

  generateCSS(): string {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) return '';
    const backgroundColor = canvasElement
      ? window
          .getComputedStyle(canvasElement)
          .getPropertyValue('background-color')
      : 'rgb(255, 255, 255)';
    const styles: string[] = [];
    const processedSelectors = new Set<string>();
    Canvas.layoutMode === 'grid'
      ? styles.push(`
      body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display:flex;
        overflow: hidden;
      }
      #canvas {
        position: relative;
        width: 100%;
        flex-grow: 1;
        min-width: 0;
        background-color: ${backgroundColor};
        margin: 0;
        overflow: auto;
        box-sizing: border-box;
      }
      #canvas.grid-layout-active {
        display: block;
      }

      .container-grid-active {
        display: block;
      }

      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      ::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 3px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }
      .table-componet {
        border-collapse: collapse ;
        box-sizing: border-box;
      }
      .editable-component{
        border:none !important;
        box-shadow:none !important;
      }

      `)
      : styles.push(`
      body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
      }
        #canvas.home {
      position: relative;
      display: block;
      width: 100%;
      min-height: 100vh;
      background-color: ${backgroundColor};
      margin: 0;
      overflow: visible;
  }

      table {
          border-collapse: collapse ;

      }
          .editable-component{
          border:none !important;
          box-shadow:none !important;
          }

      `);

    const elements = canvasElement.querySelectorAll('*');

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

    elements.forEach((component, index) => {
      // Skip excluded elements
      if (classesToExclude.some(cls => component.classList.contains(cls))) {
        return;
      }

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
          if (prop === 'resize' || propertiesToExclude.includes(prop)) {
            continue;
          }
        } else {
          if (prop === 'resize') {
            continue;
          }
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

        styles.push(`
        ${selector} {
          ${componentStyles.join('\n  ')}
        }`);
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
    const isSVGChild =
      component.tagName.toLowerCase() === 'path' ||
      component.tagName.toLowerCase() === 'circle' ||
      component.tagName.toLowerCase() === 'rect' ||
      component.tagName.toLowerCase() === 'polygon';

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
        styles.push(`
        ${specificSelector} {
          ${componentStyles.join('\n  ')}
        }`);
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

        styles.push(`
        ${selector} {
          ${componentStyles.join('\n  ')}
        }`);
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
        if (cleanClasses) {
          selector += `.${cleanClasses} `;
        }
      }
    }

    if (parentSVG) {
      if (parentSVG.className.baseVal) {
        selector += `svg.${parentSVG.className.baseVal.split(' ').join('.')} `;
      } else {
        selector += 'svg ';
      }
    }

    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        child => child.tagName === element.tagName
      );
      const elementIndex = siblings.indexOf(element);
      selector += `${element.tagName.toLowerCase()}:nth-of-type(${elementIndex + 1})`;
    } else {
      selector += `${element.tagName.toLowerCase()}`;
    }

    return selector || `${element.tagName.toLowerCase()}-${index}`;
  }

  private generateUniqueSelector(element: Element): string {
    // If the element has an ID, that is the most unique selector
    if (element.id) {
      return `#${element.id}`;
    }

    const selectorPath: string[] = [];
    let currentElement: Element | null = element;

    while (currentElement && currentElement.tagName.toLowerCase() !== 'body') {
      let selector = currentElement.tagName.toLowerCase();

      // Add clean classes to the selector
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
      if (cleanClasses.length > 0) {
        selector += `.${cleanClasses.join('.')}`;
      }

      // Add nth-of-type to differentiate siblings
      const parent = currentElement.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          child => child.tagName === currentElement!.tagName
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(currentElement) + 1;
          selector += `:nth-of-type(${index})`;
        }
      }

      selectorPath.unshift(selector);

      // Stop if we hit a parent with an ID
      if (currentElement.parentElement && currentElement.parentElement.id) {
        selectorPath.unshift(`#${currentElement.parentElement.id}`);
        break;
      }

      currentElement = currentElement.parentElement;
    }

    // Ensure the selector starts from the canvas
    const finalSelector = `#canvas > ${selectorPath.join(' > ')}`;

    return finalSelector;
  }

  applyCSS(css: string) {
    this.styleElement.textContent = css;
  }
}

export class HTMLGenerator {
  constructor(canvas) {
    this.canvas = canvas;
    this.styleElement = document.createElement('style');
    document.head.appendChild(this.styleElement);
  }
  generateHTML() {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) {
      console.warn('Canvas element not found!');
      return this.getBaseHTML();
    }
    const cleanCanvas = canvasElement.cloneNode(true);
    this.cleanupElements(cleanCanvas);
    // console.log(cleanCanvas, 'clean');
    return this.getBaseHTML(cleanCanvas.innerHTML);
  }
  getBaseHTML(bodyContent = 'children') {
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
            <div id="canvas" class="home">
            ${bodyContent}
            </div>
        </body>
      </html>`;
  }
  cleanupElements(element) {
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
      const childElement = child;
      // Remove specified attributes
      attributesToRemove.forEach(attr => {
        childElement.removeAttribute(attr);
      });
      // Remove specified classes but keep editable-component
      classesToRemove.forEach(classToRemove => {
        childElement.classList.remove(classToRemove);
      });
      // DON'T remove positioning styles - this was your mistake
      // The absolute positioning is needed for preview to match canvas
      // Remove control elements
      const elementsToRemove = childElement.querySelectorAll(
        '.component-controls, .delete-icon, .component-label, .column-label, .resizers, .resizer, .drop-preview, .upload-btn, .edit-link, .edit-link-form, input'
      );
      elementsToRemove.forEach(el => el.remove());
      if (childElement.children.length > 0) {
        this.cleanupElements(childElement);
      }
    });
  }
  generateCSS() {
    const canvasElement = document.getElementById('canvas');
    if (!canvasElement) return '';
    const backgroundColor = canvasElement
      ? window
          .getComputedStyle(canvasElement)
          .getPropertyValue('background-color')
      : 'rgb(255, 255, 255)';
    const styles = [];
    const processedSelectors = new Set();
    styles.push(`
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
    elements.forEach((component, index) => {
      // Skip excluded elements
      if (classesToExclude.some(cls => component.classList.contains(cls))) {
        return;
      }
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
        // console.log(component, 'compoenent');
        if (prop === 'resize') {
          continue;
        }
        // Your original condition to filter out unwanted values
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
      // console.log(selector, componentStyles, 'selector');
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
  handleSVGElement(
    component,
    componentStyles,
    computedStyles,
    index,
    styles,
    processedSelectors
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
      if (
        componentStyles.length > 0 &&
        !processedSelectors.has(specificSelector)
      ) {
        processedSelectors.add(specificSelector);
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
      const selector = this.generateUniqueSelector(component, index);
      if (!processedSelectors.has(selector) && componentStyles.length > 0) {
        processedSelectors.add(selector);
        styles.push(`
        ${selector} {
          ${componentStyles.join('\n  ')}
        }`);
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
      // Use parent container context
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
  generateUniqueSelector(element, index) {
    if (element.id) {
      return `#${element.id}`;
    }
    // if (element instanceof SVGElement) {
    //   const classAttributeValue = element.getAttribute('class');
    //   if (classAttributeValue) {
    //     return `.${classAttributeValue.toString().split(' ').join('.')}`;
    //   }
    // }
    // if (element.className) {
    //   return `.${element.className.toString().split(' ').join('.')}`;
    // }
    // // Create a tag-based selector with index for uniqueness
    // const parent = element.parentElement;
    // if (parent) {
    //   const siblings = Array.from(parent.children);
    //   const index = siblings.indexOf(element);
    //   console.log('no class /tag/parent', element.tagName.toLowerCase());
    //   return `${element.tagName.toLowerCase()}:nth-child(${index + 1})`;
    // }
    if (element.className) {
      const cleanClasses = element.className
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
        // Make it more specific by adding index to avoid conflicts
        return index !== undefined
          ? `.${cleanClasses}:nth-of-type(${index + 1})`
          : `.${cleanClasses}`;
      }
    }
    // Create a tag-based selector with index for uniqueness
    const parent = element.parentElement;
    if (parent) {
      const siblings = Array.from(parent.children);
      const elementIndex = siblings.indexOf(element);
      return `${element.tagName.toLowerCase()}:nth-child(${elementIndex + 1})`;
    }
    console.log('no class /tag', element.tagName.toLowerCase(), element);
    return element.tagName.toLowerCase();
  }
  applyCSS(css) {
    this.styleElement.textContent = css;
  }
}

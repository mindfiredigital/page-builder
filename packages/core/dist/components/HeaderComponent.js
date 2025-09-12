import { Canvas } from '../canvas/Canvas.js';
import { ModalComponent } from './ModalManager.js';
export class HeaderComponent {
  constructor() {
    this.modalComponent = new ModalComponent();
  }
  create(level = 1, text = 'Header', headerAttributeConfig) {
    HeaderComponent.headerAttributeConfig = headerAttributeConfig || [];
    const element = document.createElement(`h${level}`);
    element.innerText = text;
    element.classList.add('header-component');
    return element;
  }
  seedFormulaValues(values) {
    const allHeaders = document.querySelectorAll('.header-component');
    allHeaders.forEach(header => {
      const controlsElement = header.querySelector('.component-controls');
      const key = header.getAttribute('data-attribute-key');
      if (key && values.hasOwnProperty(key)) {
        header.textContent = values[key];
        header.style.color = '#000000';
      }
      if (controlsElement) {
        header.appendChild(controlsElement);
      }
    });
    Canvas.dispatchDesignChange();
  }
  updateInputValues(values) {
    const allHeaders = document.querySelectorAll('.header-component');
    allHeaders.forEach(header => {
      const controlsElement = header.querySelector('.component-controls');
      const key = header.getAttribute('data-attribute-key');
      const type = header.getAttribute('data-attribute-type');
      if (key && values.hasOwnProperty(key) && type === 'Input') {
        header.textContent = values[key];
      }
      if (controlsElement) {
        header.appendChild(controlsElement);
      }
    });
    Canvas.dispatchDesignChange();
  }
  updateHeaderContent(headerElement, attribute) {
    const controlsElement = headerElement.querySelector('.component-controls');
    headerElement.setAttribute('data-attribute-key', attribute.key);
    headerElement.setAttribute('data-attribute-type', attribute.type);
    if (attribute.type === 'Formula') {
      headerElement.textContent = `${attribute.title}`;
      headerElement.style.color = 'rgb(188 191 198)';
      headerElement.style.fontWeight = '500';
    } else if (attribute.type === 'Constant' || attribute.type === 'Input') {
      headerElement.textContent = `${attribute.value}`;
    }
    if (controlsElement) {
      headerElement.appendChild(controlsElement);
    }
    Canvas === null || Canvas === void 0
      ? void 0
      : Canvas.dispatchDesignChange();
  }
  static restore(container) {
    const closestHeader = container.closest('.header-component');
    if (closestHeader) {
      const attributeKey = closestHeader.getAttribute('data-attribute-key');
      const attributeType = closestHeader.getAttribute('data-attribute-type');
      if (attributeKey) {
        const attribute = HeaderComponent.headerAttributeConfig.find(
          attr => attr.key === attributeKey
        );
        if (attribute) {
          const controlsElement = closestHeader.querySelector(
            '.component-controls'
          );
          if (
            attribute.default_value &&
            (attributeType === 'Formula' || attributeType === 'Input')
          ) {
            closestHeader.textContent = `${attribute.default_value}`;
            closestHeader.style.color = '#000000';
          } else if (attributeType === 'Formula') {
            closestHeader.textContent = `${attribute.title}`;
            closestHeader.style.color = 'rgb(188 191 198)';
            closestHeader.style.fontWeight = '500';
          }
          if (controlsElement) {
            closestHeader.appendChild(controlsElement);
          }
        }
      }
    }
  }
}
HeaderComponent.headerAttributeConfig = [];

var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
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
  handleHeaderClick(headerComponent) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (
        !this.modalComponent ||
        ((_a = HeaderComponent.headerAttributeConfig) === null || _a === void 0
          ? void 0
          : _a.length) === 0
      ) {
        console.warn(
          'Modal component or header attribute config not available'
        );
        return;
      }
      try {
        const result = yield this.modalComponent.show(
          HeaderComponent.headerAttributeConfig
        );
        if (result) {
          const selectedAttribute = this.findSelectedAttribute(result);
          if (selectedAttribute) {
            this.updateHeaderContent(headerComponent, selectedAttribute);
          }
        }
      } catch (error) {
        console.error('Error handling header component click:', error);
      }
    });
  }
  findSelectedAttribute(result) {
    for (const attr of HeaderComponent.headerAttributeConfig) {
      if (
        result.hasOwnProperty(attr.key) &&
        result[attr.key] !== undefined &&
        result[attr.key] !== ''
      ) {
        return attr;
      }
    }
    return null;
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

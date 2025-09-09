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
export class TextComponent {
  constructor(text = 'Sample Text') {
    this.text = text;
    this.modalComponent = new ModalComponent();
  }
  create(textAttributeConfig) {
    TextComponent.textAttributeConfig = textAttributeConfig || [];
    const element = document.createElement('div');
    element.innerText = this.text;
    element.contentEditable = 'true';
    element.classList.add('text-component');
    return element;
  }
  setText(newText) {
    this.text = newText;
  }
  seedFormulaValues(values) {
    const allTexts = document.querySelectorAll('.text-component');
    allTexts.forEach(text => {
      const controlsElement = text.querySelector('.component-controls');
      const key = text.getAttribute('data-attribute-key');
      if (key && values.hasOwnProperty(key)) {
        text.textContent = values[key];
        text.style.color = '#000000';
      }
      if (controlsElement) {
        text.appendChild(controlsElement);
      }
    });
    Canvas.dispatchDesignChange();
  }
  updateInputValues(values) {
    const allTexts = document.querySelectorAll('.text-component');
    allTexts.forEach(text => {
      const controlsElement = text.querySelector('.component-controls');
      const key = text.getAttribute('data-attribute-key');
      const type = text.getAttribute('data-attribute-type');
      if (key && values.hasOwnProperty(key) && type === 'Input') {
        text.textContent = values[key];
      }
      if (controlsElement) {
        text.appendChild(controlsElement);
      }
    });
    Canvas.dispatchDesignChange();
  }
  handleTextClick(textComponent) {
    return __awaiter(this, void 0, void 0, function* () {
      var _a;
      if (
        !this.modalComponent ||
        ((_a = TextComponent.textAttributeConfig) === null || _a === void 0
          ? void 0
          : _a.length) === 0
      ) {
        console.warn('Modal component or text attribute config not available');
        return;
      }
      try {
        const result = yield this.modalComponent.show(
          TextComponent.textAttributeConfig
        );
        if (result) {
          const selectedAttribute = this.findSelectedAttribute(result);
          if (selectedAttribute) {
            this.updateTextContent(textComponent, selectedAttribute);
          }
        }
      } catch (error) {
        console.error('Error handling text component click:', error);
      }
    });
  }
  findSelectedAttribute(result) {
    for (const attr of TextComponent.textAttributeConfig) {
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
  updateTextContent(textElement, attribute) {
    const controlsElement = textElement.querySelector('.component-controls');
    textElement.setAttribute('data-attribute-key', attribute.key);
    textElement.setAttribute('data-attribute-type', attribute.type);
    if (attribute.type === 'Formula') {
      textElement.textContent = `${attribute.title}`;
      textElement.style.fontSize = '10px';
      textElement.style.color = 'rgb(188 191 198)';
      textElement.style.fontWeight = '500';
    } else if (attribute.type === 'Constant' || attribute.type === 'Input') {
      textElement.textContent = `${attribute.value}`;
    }
    if (controlsElement) {
      textElement.appendChild(controlsElement);
    }
    Canvas === null || Canvas === void 0
      ? void 0
      : Canvas.dispatchDesignChange();
  }
}
TextComponent.textAttributeConfig = [];

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

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
    element.classList.add('text-component');
    const textSpan = document.createElement('span');
    textSpan.innerText = this.text;
    textSpan.contentEditable = 'true';
    textSpan.classList.add('component-text-content');
    element.appendChild(textSpan);
    textSpan.addEventListener('click', event => {
      event.stopPropagation();
      const parentHeader = textSpan.closest('.text-component');
      if (parentHeader) {
        parentHeader.click();
      }
    });
    return element;
  }
  setText(newText) {
    this.text = newText;
  }
  seedFormulaValues(values) {
    const allTexts = document.querySelectorAll('.text-component');
    allTexts.forEach(text => {
      const controlsElement = text.querySelector('.component-controls');
      const labelElement = text.querySelector('.component-label');
      const textSpan = text.querySelector('.component-text-content');
      const key = text.getAttribute('data-attribute-key');
      if (textSpan && key && values.hasOwnProperty(key)) {
        textSpan.textContent = values[key];
        text.style.color = '#000000';
      }
      if (controlsElement) {
        text.appendChild(controlsElement);
      }
      if (labelElement) {
        text.appendChild(labelElement);
      }
    });
    Canvas.dispatchDesignChange();
  }
  updateInputValues(values) {
    const allTexts = document.querySelectorAll('.text-component');
    allTexts.forEach(text => {
      const controlsElement = text.querySelector('.component-controls');
      const labelElement = text.querySelector('.component-label');
      const textSpan = text.querySelector('.component-text-content');
      const key = text.getAttribute('data-attribute-key');
      const type = text.getAttribute('data-attribute-type');
      if (textSpan && key && values.hasOwnProperty(key) && type === 'Input') {
        textSpan.textContent = values[key];
      }
      if (controlsElement) {
        text.appendChild(controlsElement);
      }
      if (labelElement) {
        text.appendChild(labelElement);
      }
    });
    Canvas.dispatchDesignChange();
  }
  updateTextContent(textElement, attribute) {
    const controlsElement = textElement.querySelector('.component-controls');
    const labelElement = textElement.querySelector('.component-label');
    const textSpan = textElement.querySelector('.component-text-content');
    textElement.setAttribute('data-attribute-key', attribute.key);
    textElement.setAttribute('data-attribute-type', attribute.type);
    if (attribute.type === 'Formula' && textSpan) {
      textSpan.textContent = `${attribute.title}`;
      textElement.style.fontSize = '10px';
      textElement.style.color = 'rgb(188 191 198)';
      textElement.style.fontWeight = '500';
    } else if (
      (attribute.type === 'Constant' || attribute.type === 'Input') &&
      textSpan
    ) {
      textSpan.textContent = `${attribute.value}`;
    }
    if (controlsElement) {
      textElement.appendChild(controlsElement);
    }
    if (labelElement) {
      textElement.appendChild(labelElement);
    }
    Canvas === null || Canvas === void 0
      ? void 0
      : Canvas.dispatchDesignChange();
  }
  static restore(container) {
    const closestTextComponent = container.closest('.text-component');
    const textSpan = closestTextComponent.querySelector(
      '.component-text-content'
    );
    if (closestTextComponent && textSpan) {
      const attributeKey =
        closestTextComponent.getAttribute('data-attribute-key');
      const attributeType = closestTextComponent.getAttribute(
        'data-attribute-type'
      );
      if (attributeKey) {
        const attribute = TextComponent.textAttributeConfig.find(
          attr => attr.key === attributeKey
        );
        if (attribute) {
          const controlsElement = closestTextComponent.querySelector(
            '.component-controls'
          );
          const labelElement =
            closestTextComponent.querySelector('.component-label');
          if (
            attribute.default_value &&
            (attributeType === 'Formula' || attributeType === 'Input')
          ) {
            textSpan.textContent = `${attribute.default_value}`;
            closestTextComponent.style.color = '#000000';
          } else if (attributeType === 'Formula') {
            textSpan.textContent = `${attribute.title}`;
            closestTextComponent.style.fontSize = '10px';
            closestTextComponent.style.color = 'rgb(188 191 198)';
            closestTextComponent.style.fontWeight = '500';
          }
          if (controlsElement) {
            closestTextComponent.appendChild(controlsElement);
          }
          if (labelElement) {
            closestTextComponent.appendChild(labelElement);
          }
        }
      }
    }
  }
}
TextComponent.textAttributeConfig = [];

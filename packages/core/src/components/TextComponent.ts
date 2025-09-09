import { Canvas } from '../canvas/Canvas';
import { ModalComponent } from './ModalManager';

export class TextComponent {
  private text: string;
  private static textAttributeConfig: ComponentAttribute[] = [];
  private modalComponent: ModalComponent;

  constructor(text: string = 'Sample Text') {
    this.text = text;
    this.modalComponent = new ModalComponent();
  }

  create(textAttributeConfig?: ComponentAttribute[] | undefined): HTMLElement {
    TextComponent.textAttributeConfig = textAttributeConfig || [];

    const element = document.createElement('div');
    element.innerText = this.text;
    element.contentEditable = 'true';
    element.classList.add('text-component');
    return element;
  }

  setText(newText: string): void {
    this.text = newText;
  }

  seedFormulaValues(values: Record<string, any>) {
    const allTexts = document.querySelectorAll('.text-component');
    allTexts.forEach(text => {
      const controlsElement = text.querySelector('.component-controls');

      const key = text.getAttribute('data-attribute-key');
      if (key && values.hasOwnProperty(key)) {
        text.textContent = values[key];
        (text as HTMLElement).style.color = '#000000';
      }
      if (controlsElement) {
        text.appendChild(controlsElement);
      }
    });
    Canvas.dispatchDesignChange();
  }
  updateInputValues(values: Record<string, any>) {
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

  async handleTextClick(textComponent: HTMLElement): Promise<void> {
    if (
      !this.modalComponent ||
      TextComponent.textAttributeConfig?.length === 0
    ) {
      console.warn('Modal component or text attribute config not available');
      return;
    }

    try {
      const result = await this.modalComponent.show(
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
  }
  private findSelectedAttribute(
    result: Record<string, any>
  ): ComponentAttribute | null {
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
  private updateTextContent(
    textElement: HTMLElement,
    attribute: ComponentAttribute
  ): void {
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
    Canvas?.dispatchDesignChange();
  }
}

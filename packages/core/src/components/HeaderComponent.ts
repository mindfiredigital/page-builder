import { Canvas } from '../canvas/Canvas';
import { ModalComponent } from './ModalManager';

export class HeaderComponent {
  private static headerAttributeConfig: ComponentAttribute[] = [];
  private modalComponent: ModalComponent;

  constructor() {
    this.modalComponent = new ModalComponent();
  }

  create(
    level: number = 1,
    text: string = 'Header',
    headerAttributeConfig?: ComponentAttribute[] | undefined
  ): HTMLElement {
    HeaderComponent.headerAttributeConfig = headerAttributeConfig || [];
    const element = document.createElement(`h${level}`);
    element.innerText = text;
    element.classList.add('header-component');
    return element;
  }

  seedFormulaValues(values: Record<string, any>) {
    const allHeaders = document.querySelectorAll('.header-component');
    allHeaders.forEach(header => {
      const controlsElement = header.querySelector('.component-controls');

      const key = header.getAttribute('data-attribute-key');
      if (key && values.hasOwnProperty(key)) {
        header.textContent = values[key];
        (header as HTMLElement).style.color = '#000000';
      }
      if (controlsElement) {
        header.appendChild(controlsElement);
      }
    });
    Canvas.dispatchDesignChange();
  }

  updateInputValues(values: Record<string, any>) {
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
  async handleHeaderClick(headerComponent: HTMLElement): Promise<void> {
    if (
      !this.modalComponent ||
      HeaderComponent.headerAttributeConfig?.length === 0
    ) {
      console.warn('Modal component or header attribute config not available');
      return;
    }

    try {
      const result = await this.modalComponent.show(
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
  }

  private findSelectedAttribute(
    result: Record<string, any>
  ): ComponentAttribute | null {
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

  private updateHeaderContent(
    headerElement: HTMLElement,
    attribute: ComponentAttribute
  ): void {
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
    Canvas?.dispatchDesignChange();
  }
  static restore(container: HTMLElement): void {
    const closestHeader = container.closest('.header-component') as HTMLElement;
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

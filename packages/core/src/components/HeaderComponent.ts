import { Canvas } from '../canvas/Canvas';
import { ModalComponent } from './ModalManager';

export class HeaderComponent {
  static headerAttributeConfig: ComponentAttribute[] = [];
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
    element.classList.add('header-component');

    // Create a new span for the editable text content
    const textSpan = document.createElement('span');
    textSpan.innerText = text;
    textSpan.contentEditable = 'true';
    textSpan.classList.add('component-text-content');
    element.appendChild(textSpan);

    textSpan.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
      const parentHeader = textSpan.closest('.header-component');
      if (parentHeader) {
        (parentHeader as HTMLElement).click();
      }
    });

    return element;
  }

  seedFormulaValues(values: Record<string, any>) {
    const allHeaders = document.querySelectorAll('.header-component');

    allHeaders.forEach(header => {
      const controlsElement = header.querySelector('.component-controls');
      const labelElement = header.querySelector('.component-label');
      const headerText = header.querySelector('.component-text-content');

      const key = header.getAttribute('data-attribute-key');
      if (headerText && key && values.hasOwnProperty(key)) {
        headerText.textContent = values[key];
        (header as HTMLElement).style.color = '#000000';
      }
      if (controlsElement) {
        header.appendChild(controlsElement);
      }
      if (labelElement) {
        header.appendChild(labelElement);
      }
    });
    Canvas.dispatchDesignChange();
  }

  updateInputValues(values: Record<string, any>) {
    const allHeaders = document.querySelectorAll('.header-component');

    allHeaders.forEach(header => {
      const controlsElement = header.querySelector('.component-controls');
      const labelElement = header.querySelector('.component-label');
      const headerText = header.querySelector('.component-text-content');

      const key = header.getAttribute('data-attribute-key');
      const type = header.getAttribute('data-attribute-type');

      if (headerText && key && values.hasOwnProperty(key) && type === 'Input') {
        headerText.textContent = values[key];
      }
      if (controlsElement) {
        header.appendChild(controlsElement);
      }
      if (labelElement) {
        header.appendChild(labelElement);
      }
    });

    Canvas.dispatchDesignChange();
  }

  updateHeaderContent(
    headerElement: HTMLElement,
    attribute: ComponentAttribute
  ): void {
    const controlsElement = headerElement.querySelector('.component-controls');
    const labelElement = headerElement.querySelector('.component-label');
    const headerText = headerElement.querySelector('.component-text-content');

    headerElement.setAttribute('data-attribute-key', attribute.key);
    headerElement.setAttribute('data-attribute-type', attribute.type);

    if (attribute.type === 'Formula' && headerText) {
      headerText.textContent = `${attribute.title}`;
      headerElement.style.color = 'rgb(188 191 198)';
      headerElement.style.fontWeight = '500';
    } else if (
      (attribute.type === 'Constant' || attribute.type === 'Input') &&
      headerText
    ) {
      headerText.textContent = `${attribute.value}`;
    }
    if (controlsElement) {
      headerElement.appendChild(controlsElement);
    }
    if (labelElement) {
      headerElement.appendChild(labelElement);
    }
    Canvas?.dispatchDesignChange();
  }
  static restore(container: HTMLElement): void {
    const closestHeader = container.closest('.header-component') as HTMLElement;
    const headerText = closestHeader.querySelector(
      '.component-text-content'
    ) as HTMLElement;
    headerText.addEventListener('click', (event: MouseEvent) => {
      event.stopPropagation();
      const parentHeader = headerText.closest('.header-component');
      if (parentHeader) {
        (parentHeader as HTMLElement).click();
      }
    });

    if (closestHeader && headerText) {
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
          const labelElement = closestHeader.querySelector('.component-label');

          if (
            attribute.default_value &&
            (attributeType === 'Formula' || attributeType === 'Input')
          ) {
            headerText.textContent = `${attribute.default_value}`;
            closestHeader.style.color = '#000000';
          } else if (attributeType === 'Formula') {
            headerText.textContent = `${attribute.title}`;
            closestHeader.style.color = 'rgb(188 191 198)';
            closestHeader.style.fontWeight = '500';
          }
          if (controlsElement) {
            closestHeader.appendChild(controlsElement);
          }
          if (labelElement) {
            closestHeader.appendChild(labelElement);
          }
        }
      }
    }
  }
}

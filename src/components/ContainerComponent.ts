import { Canvas } from '../canvas/Canvas';

export class ContainerComponent {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('container-component');
    this.element.setAttribute('draggable', 'true');
    this.element.addEventListener('dragover', event => event.preventDefault());
    this.element.addEventListener('drop', this.onDrop.bind(this));
  }

  create(): HTMLElement {
    this.element.innerHTML = 'Drop items here';
    return this.element;
  }

  private onDrop(event: DragEvent) {
    event.preventDefault();
    const componentType = event.dataTransfer?.getData('component-type');
    console.log(`Dropped inside container, component type: ${componentType}`);
    if (componentType) {
      // Use Canvas's static createComponent method to create and add a component inside this container
      const component = Canvas.createComponent(componentType);
      if (component) {
        this.element.appendChild(component);
      }
    }
  }
}

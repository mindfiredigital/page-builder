import { Canvas } from '../canvas/Canvas.js';
export class ContainerComponent {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('container-component');
    this.element.setAttribute('draggable', 'true');
    this.element.addEventListener('dragover', event => event.preventDefault());
    this.element.addEventListener('drop', this.onDrop.bind(this));
  }
  create() {
    this.element.innerHTML = 'Drop items here';
    return this.element;
  }
  onDrop(event) {
    var _a;
    event.preventDefault();
    const componentType =
      (_a = event.dataTransfer) === null || _a === void 0
        ? void 0
        : _a.getData('component-type');
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

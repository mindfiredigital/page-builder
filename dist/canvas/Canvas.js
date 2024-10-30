import { DragDropManager } from './DragDropManager.js';
import {
  ButtonComponent,
  HeaderComponent,
  ImageComponent,
  TextComponent,
  ContainerComponent,
} from '../components/index.js';
export class Canvas {
  constructor() {
    this.components = [];
    this.canvasElement = document.getElementById('canvas');
    this.sidebarElement = document.getElementById('sidebar');
    this.canvasElement.addEventListener('drop', this.onDrop.bind(this));
    this.canvasElement.addEventListener('dragover', event =>
      event.preventDefault()
    );
  }
  init() {
    const dragDropManager = new DragDropManager(
      this.canvasElement,
      this.sidebarElement
    );
    dragDropManager.enable();
  }
  onDrop(event) {
    var _a;
    event.preventDefault();
    if (event.target.classList.contains('container-component')) {
      return; // Exit if the drop is inside a container
    }
    const componentType =
      (_a = event.dataTransfer) === null || _a === void 0
        ? void 0
        : _a.getData('component-type');
    console.log(`Dropped component type: ${componentType}`);
    if (componentType) {
      const component = Canvas.createComponent(componentType); // Static method call
      if (component) {
        this.components.push(component);
        this.canvasElement.appendChild(component);
      }
    }
  }
  // Static method to create components, allowing it to be used by ContainerComponent as well
  static createComponent(type) {
    const componentFactoryFunction = Canvas.componentFactory[type];
    if (!componentFactoryFunction) {
      console.warn(`Unknown component type: ${type}`);
      return null;
    }
    const element = componentFactoryFunction();
    if (element) {
      // Make the element editable and focusable
      element.classList.add('editable-component');
      element.setAttribute('contenteditable', 'true');
    }
    return element;
  }
  exportLayout() {
    return this.components.map(component => {
      return {
        type: component.className,
        content: component.innerHTML,
      };
    });
  }
}
// Map of component types to their creation functions
Canvas.componentFactory = {
  button: () => new ButtonComponent().create('Click Me'),
  header: () => new HeaderComponent().create(1, 'Editable Header'),
  image: () => new ImageComponent().create('https://via.placeholder.com/150'),
  text: () => new TextComponent().create(),
  container: () => new ContainerComponent().create(),
};

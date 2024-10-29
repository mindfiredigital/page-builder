import { DragDropManager } from './DragDropManager';
import {
  ButtonComponent,
  HeaderComponent,
  ImageComponent,
  TextComponent,
  ContainerComponent,
} from '../components/index';

export class Canvas {
  private components: HTMLElement[] = [];
  private canvasElement: HTMLElement;
  private sidebarElement: HTMLElement;

  // Map of component types to their creation functions
  private static componentFactory: { [key: string]: () => HTMLElement | null } =
    {
      button: () => new ButtonComponent().create('Click Me'),
      header: () => new HeaderComponent().create(1, 'Editable Header'),
      image: () =>
        new ImageComponent().create('https://via.placeholder.com/150'),
      text: () => new TextComponent().create(),
      container: () => new ContainerComponent().create(),
    };

  constructor() {
    this.canvasElement = document.getElementById('canvas')!;
    this.sidebarElement = document.getElementById('sidebar')!;
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

  onDrop(event: DragEvent) {
    event.preventDefault();
    const componentType = event.dataTransfer?.getData('component-type');
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
  static createComponent(type: string): HTMLElement | null {
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

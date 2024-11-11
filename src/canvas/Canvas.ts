import { DragDropManager } from './DragDropManager';
import {
  ButtonComponent,
  HeaderComponent,
  ImageComponent,
  TextComponent,
  ContainerComponent,
} from '../components/index';
import { HistoryManager } from '../services/HistoryManager';
import { JSONStorage } from '../services/JSONStorage';

export class Canvas {
  private static components: HTMLElement[] = [];
  private static canvasElement: HTMLElement;
  private static sidebarElement: HTMLElement;

  public static historyManager: HistoryManager; //accessible outside the Canvas class.
  private static jsonStorage: JSONStorage;

  private static componentFactory: { [key: string]: () => HTMLElement | null } =
    {
      button: () => new ButtonComponent().create('Click Me'),
      header: () => new HeaderComponent().create(1, 'Editable Header'),
      image: () =>
        new ImageComponent().create('https://via.placeholder.com/150'),
      text: () => new TextComponent().create(),
      container: () => new ContainerComponent().create(),
    };

  static init() {
    Canvas.canvasElement = document.getElementById('canvas')!;
    Canvas.sidebarElement = document.getElementById('sidebar')!;
    Canvas.canvasElement.addEventListener('drop', Canvas.onDrop.bind(Canvas));
    Canvas.canvasElement.addEventListener('dragover', event =>
      event.preventDefault()
    );

    // Initialize the HistoryManager with this canvas
    Canvas.historyManager = new HistoryManager(Canvas.canvasElement); // Pass the canvas element here
    Canvas.jsonStorage = new JSONStorage();

    const dragDropManager = new DragDropManager(
      Canvas.canvasElement,
      Canvas.sidebarElement
    );
    dragDropManager.enable();

    // Load existing layout from local storage and render, if any
    const savedState = Canvas.jsonStorage.load();
    if (savedState) {
      Canvas.restoreState(savedState);
    }
  }

  // Method to clear the canvas and remove all components
  static clearCanvas() {
    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];
    Canvas.historyManager.captureState(); // Capture cleared state for undo functionality if needed
  }

  // Get current state of the canvas for undo/redo
  static getState() {
    return Canvas.components.map(component => {
      const baseType = component.classList[0]
        .split(/\d/)[0]
        .replace('-component', '');
      return {
        type: baseType,
        content: component.innerHTML,
        position: { x: component.offsetLeft, y: component.offsetTop },
      };
    });
  }

  // Restore the state of the canvas (for undo/redo purposes)
  static restoreState(state: any) {
    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];

    state.forEach((componentData: any) => {
      const component = Canvas.createComponent(componentData.type);
      if (component) {
        component.innerHTML = componentData.content;
        component.style.left = `${componentData.position.x}px`;
        component.style.top = `${componentData.position.y}px`;
        Canvas.addDraggableListeners(component);
        Canvas.canvasElement.appendChild(component);
        Canvas.components.push(component);
      }
    });
  }

  static onDrop(event: DragEvent) {
    event.preventDefault();
    if (
      (event.target as HTMLElement).classList.contains('container-component')
    ) {
      return;
    }

    const componentType = event.dataTransfer?.getData('component-type');
    console.log(`Dropped component type: ${componentType}`);
    if (componentType) {
      const component = Canvas.createComponent(componentType);
      if (component) {
        // Add unique class name
        const uniqueClass = Canvas.generateUniqueClass(componentType);
        component.classList.add(uniqueClass);

        component.style.position = 'absolute';

        // Set component's initial position based on the drop location
        component.style.left = `${event.offsetX}px`;
        component.style.top = `${event.offsetY}px`;
        // Create label for showing class name on hover
        const label = document.createElement('span');
        label.className = 'component-label';
        label.textContent = uniqueClass;
        component.appendChild(label);

        Canvas.components.push(component);
        Canvas.canvasElement.appendChild(component);
        Canvas.addDraggableListeners(component); // Add drag functionality

        //On adding new component to the canvas it captures the current state.
        Canvas.historyManager.captureState();
      }
    }
  }

  static createComponent(type: string): HTMLElement | null {
    const componentFactoryFunction = Canvas.componentFactory[type];
    if (!componentFactoryFunction) {
      console.warn(`Unknown component type: ${type}`);
      return null;
    }

    const element = componentFactoryFunction();
    if (element) {
      element.classList.add('editable-component');
      // Conditionally set contenteditable attribute
      if (type === 'image') {
        element.setAttribute('contenteditable', 'false'); // Image should not be editable
      } else {
        element.setAttribute('contenteditable', 'true'); // Other components are editable
      }
    }

    return element;
  }

  static generateUniqueClass(type: string): string {
    // Get all components of the given type on the canvas, including those loaded from storage
    const existingClasses = Canvas.components.map(
      component => component.className.split(' ')[0]
    );

    // Filter for components of the same type (e.g., 'button', 'header') and count them
    const existingCount = existingClasses.filter(className =>
      className.startsWith(type)
    ).length;

    // Generate the next unique class based on the count
    return `${type}${existingCount + 1}`;
  }

  // Enable drag functionality for components on canvas
  static addDraggableListeners(element: HTMLElement) {
    element.setAttribute('draggable', 'true');
    let offsetX = 0,
      offsetY = 0;

    element.addEventListener('dragstart', (event: DragEvent) => {
      if (event.dataTransfer) {
        offsetX = event.offsetX;
        offsetY = event.offsetY;
        event.dataTransfer.effectAllowed = 'move';
      }
    });

    element.addEventListener('dragend', (event: DragEvent) => {
      event.preventDefault();
      element.style.left = `${event.pageX - offsetX}px`;
      element.style.top = `${event.pageY - offsetY}px`;
      Canvas.historyManager.captureState(); // Capture state after repositioning
    });
  }
  // Unused for now, remove it later
  static exportLayout() {
    return Canvas.components.map(component => {
      return {
        type: component.className,
        content: component.innerHTML,
      };
    });
  }
}

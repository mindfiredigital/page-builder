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
import { ComponentControlsManager } from './ComponentControls';
import { CustomizationSidebar } from '../sidebar/CustomizationSidebar';

export class Canvas {
  private static components: HTMLElement[] = [];
  private static canvasElement: HTMLElement;
  private static sidebarElement: HTMLElement;
  private static controlsManager: ComponentControlsManager;
  // Initialize CustomizationSidebar

  public static historyManager: HistoryManager; //accessible outside the Canvas class.
  private static jsonStorage: JSONStorage;

  // Add getters and setters for components to make it accessible outside the canvas class
  public static getComponents(): HTMLElement[] {
    return Canvas.components;
  }

  public static setComponents(components: HTMLElement[]): void {
    Canvas.components = components;
  }

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
    Canvas.canvasElement.addEventListener('click', (event: MouseEvent) => {
      const component = event.target as HTMLElement;
      console.log('this is component id ', component.id);
      if (component) {
        CustomizationSidebar.showSidebar(component.id);
      }
    });
    // Set canvas to relative positioning
    Canvas.canvasElement.style.position = 'relative';

    // Initialize the HistoryManager with this canvas, jsonStorage and ComponentControlsManager
    Canvas.historyManager = new HistoryManager(Canvas.canvasElement); // Pass the canvas element here
    Canvas.jsonStorage = new JSONStorage();
    Canvas.controlsManager = new ComponentControlsManager(Canvas);

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

  /**
   * Generates the current state of the canvas for undo/redo purposes.
   * Maps each component into a structured object containing:
   * Type, content, position, dimensions, style, and classes.
   * @returns The array of component objects.
   */
  static getState() {
    return Canvas.components.map(component => {
      const baseType = component.classList[0]
        .split(/\d/)[0]
        .replace('-component', '');
      return {
        type: baseType,
        content: component.innerHTML,
        position: {
          x: component.offsetLeft,
          y: component.offsetTop,
        },
        // Capture dimensions explicitly
        dimensions: {
          width: component.offsetWidth,
          height: component.offsetHeight,
        },
        // Capture all relevant styles to preserve appearance
        style: {
          position: component.style.position,
          left: component.style.left,
          top: component.style.top,
          width: component.style.width,
          height: component.style.height,
        },
        // Capture class names to preserve styling
        classes: Array.from(component.classList),
      };
    });
  }

  /**
   * Restores the canvas to a previous state.
   * This functions helps for undoing and redoing purpose
   * Clears the canvas. Iterates through the state and recreates components using createComponent().
   * Then restores their position, content, styles, and classes.
   * Re-adds them to the canvasElement and components array.
   * Note: we might need to extend or move it to separate file when there is management of css for each component in future
   */
  static restoreState(state: any) {
    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];

    state.forEach((componentData: any) => {
      const component = Canvas.createComponent(componentData.type);
      if (component) {
        // Restore full content
        component.innerHTML = componentData.content;

        // Restore styles and positioning
        component.style.position = componentData.style.position;
        component.style.left = componentData.style.left;
        component.style.top = componentData.style.top;

        // Explicitly set width and height if defined
        if (componentData.style.width) {
          component.style.width = componentData.style.width;
        }
        if (componentData.style.height) {
          component.style.height = componentData.style.height;
        }

        // Restore original classes
        componentData.classes.forEach((cls: string) => {
          component.classList.add(cls);
        });

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
        if (componentType === 'image') {
          component.setAttribute('id', uniqueClass); // Explicitly set the ID
        }
        component.id = uniqueClass;
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
      //Add control for each component
      Canvas.controlsManager.addControlButtons(element);
    }

    return element;
  }

  static generateUniqueClass(
    type: string,
    isContainerComponent: boolean = false,
    containerClass: string | null = null
  ): string {
    if (isContainerComponent && containerClass) {
      // Handle container components
      const containerElement = Canvas.components.find(component =>
        component.classList.contains(containerClass)
      );

      if (!containerElement) {
        console.warn(`Container with ID ${containerClass} not found.`);
        return `${containerClass}-${type}1`;
      }

      const containerComponents = Array.from(
        containerElement.children
      ) as HTMLElement[];
      const typePattern = new RegExp(`${containerClass}-${type}(\\d+)`);

      // Find the highest existing number for this type in the container
      let maxNumber = 0;
      containerComponents.forEach(component => {
        component.classList.forEach(className => {
          const match = className.match(typePattern);
          if (match) {
            const number = parseInt(match[1]);
            maxNumber = Math.max(maxNumber, number);
          }
        });
      });

      return `${containerClass}-${type}${maxNumber + 1}`;
    } else {
      // Handle regular components
      const typePattern = new RegExp(`${type}(\\d+)`);
      let maxNumber = 0;

      // Find the highest existing number for this type across all components
      Canvas.components.forEach(component => {
        component.classList.forEach(className => {
          const match = className.match(typePattern);
          if (match) {
            const number = parseInt(match[1]);
            maxNumber = Math.max(maxNumber, number);
          }
        });
      });

      return `${type}${maxNumber + 1}`;
    }
  }

  /**
   * Adds drag-and-drop behavior to a component.
   * Makes the component draggable (draggable="true").
   * On dragstart:
   * -Captures initial positions and dimensions.
   * -Locks dimensions to prevent resizing during the drag.
   * On dragend:
   * -Calculates new positions based on the drag delta.
   * -Ensures the component stays within canvas boundaries then Resets dimensions and captures the new state.
   *
   */
  static addDraggableListeners(element: HTMLElement) {
    element.setAttribute('draggable', 'true');
    element.style.cursor = 'grab';

    let dragStartX = 0;
    let dragStartY = 0;
    let elementStartX = 0;
    let elementStartY = 0;

    element.addEventListener('dragstart', (event: DragEvent) => {
      if (event.dataTransfer) {
        // Capture starting positions
        const canvasRect = Canvas.canvasElement.getBoundingClientRect();
        const rect = element.getBoundingClientRect();

        // Capture starting coordinates
        dragStartX = event.clientX;
        dragStartY = event.clientY;

        // Current element position relative to canvas
        elementStartX = rect.left - canvasRect.left;
        elementStartY = rect.top - canvasRect.top;

        event.dataTransfer.effectAllowed = 'move';
        element.style.cursor = 'grabbing';
      }
    });

    element.addEventListener('dragend', (event: DragEvent) => {
      event.preventDefault();
      // const canvasRect = Canvas.canvasElement.getBoundingClientRect();

      // Calculate movement delta
      const deltaX = event.clientX - dragStartX;
      const deltaY = event.clientY - dragStartY;

      // Calculate new position
      let newX = elementStartX + deltaX;
      let newY = elementStartY + deltaY;

      // Constrain within canvas boundaries
      const maxX = Canvas.canvasElement.offsetWidth - element.offsetWidth;
      const maxY = Canvas.canvasElement.offsetHeight - element.offsetHeight;

      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      // Set new position
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;

      // Reset cursor
      element.style.cursor = 'grab';

      // Capture the state after dragging
      Canvas.historyManager.captureState();
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

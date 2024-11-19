import { DragDropManager } from './DragDropManager.js';
import {
  ButtonComponent,
  HeaderComponent,
  ImageComponent,
  TextComponent,
  ContainerComponent,
} from '../components/index.js';
import { HistoryManager } from '../services/HistoryManager.js';
import { JSONStorage } from '../services/JSONStorage.js';
import { ComponentControlsManager } from './ComponentControls.js';
export class Canvas {
  // Add getters and setters for components to make it accessible outside the canvas class
  static getComponents() {
    return Canvas.components;
  }
  static setComponents(components) {
    Canvas.components = components;
  }
  static init() {
    Canvas.canvasElement = document.getElementById('canvas');
    Canvas.sidebarElement = document.getElementById('sidebar');
    Canvas.canvasElement.addEventListener('drop', Canvas.onDrop.bind(Canvas));
    Canvas.canvasElement.addEventListener('dragover', event =>
      event.preventDefault()
    );
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
  static restoreState(state) {
    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];
    state.forEach(componentData => {
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
  static onDrop(event) {
    var _a;
    event.preventDefault();
    if (event.target.classList.contains('container-component')) {
      return;
    }
    const componentType =
      (_a = event.dataTransfer) === null || _a === void 0
        ? void 0
        : _a.getData('component-type');
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
  static createComponent(type) {
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
    type,
    isContainerComponent = false,
    containerClass = null
  ) {
    if (isContainerComponent && containerClass) {
      // Handle container components
      const containerElement = Canvas.components.find(component =>
        component.classList.contains(containerClass)
      );
      if (!containerElement) {
        console.warn(`Container with ID ${containerClass} not found.`);
        return `${containerClass}-${type}1`;
      }
      const containerComponents = Array.from(containerElement.children);
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
  static addDraggableListeners(element) {
    element.setAttribute('draggable', 'true');
    element.style.cursor = 'grab';
    let offsetX = 0,
      offsetY = 0;
    element.addEventListener('dragstart', event => {
      if (event.dataTransfer) {
        offsetX = event.offsetX;
        offsetY = event.offsetY;
        event.dataTransfer.effectAllowed = 'move';
        element.style.cursor = 'grabbing';
      }
    });
    element.addEventListener('dragend', event => {
      event.preventDefault();
      const canvasRect = Canvas.canvasElement.getBoundingClientRect();
      let newX = event.pageX - offsetX;
      let newY = event.pageY - offsetY;
      // Ensure the component stays within canvas boundaries
      if (newX < 0) newX = 0;
      if (newY < 0) newY = 0;
      if (newX + element.offsetWidth > canvasRect.width)
        newX = canvasRect.width - element.offsetWidth;
      if (newY + element.offsetHeight > canvasRect.height)
        newY = canvasRect.height - element.offsetHeight;
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
      element.style.cursor = 'grab'; // Reset cursor to 'grab' after dragging ends
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
Canvas.components = [];
Canvas.componentFactory = {
  button: () => new ButtonComponent().create('Click Me'),
  header: () => new HeaderComponent().create(1, 'Editable Header'),
  image: () => new ImageComponent().create('https://via.placeholder.com/150'),
  text: () => new TextComponent().create(),
  container: () => new ContainerComponent().create(),
};

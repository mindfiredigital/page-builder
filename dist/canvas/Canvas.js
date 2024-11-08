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
export class Canvas {
  constructor() {
    this.components = [];
    this.componentCounters = {};
    this.canvasElement = document.getElementById('canvas');
    this.sidebarElement = document.getElementById('sidebar');
    this.canvasElement.addEventListener('drop', this.onDrop.bind(this));
    this.canvasElement.addEventListener('dragover', event =>
      event.preventDefault()
    );
    // Initialize the HistoryManager with this canvas
    this.historyManager = new HistoryManager(this);
    this.jsonStorage = new JSONStorage();
  }
  // Get the current state of the canvas (for undo/redo purposes)
  getState() {
    return this.components.map(component => {
      const baseType = component.classList[0]
        .split(/\d/)[0]
        .replace('-component', ''); //Removing the number and suffix
      return {
        type: baseType, // Store only the base type
        content: component.innerHTML,
      };
    });
  }
  // Restore the state of the canvas (for undo/redo purposes)
  restoreState(state) {
    this.canvasElement.innerHTML = '';
    this.components = [];
    state.forEach(componentData => {
      const component = Canvas.createComponent(componentData.type); // Only pass the base type
      if (component) {
        component.innerHTML = componentData.content;
        this.canvasElement.appendChild(component);
        this.components.push(component);
      }
    });
  }
  init() {
    const dragDropManager = new DragDropManager(
      this.canvasElement,
      this.sidebarElement
    );
    dragDropManager.enable();
    // Load existing layout from local storage and render, if any
    const savedState = this.jsonStorage.load();
    if (savedState) {
      this.restoreState(savedState);
    }
  }
  onDrop(event) {
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
        const uniqueClass = this.generateUniqueClass(componentType);
        component.classList.add(uniqueClass);
        // Create label for showing class name on hover
        const label = document.createElement('span');
        label.className = 'component-label';
        label.textContent = uniqueClass;
        component.appendChild(label);
        this.components.push(component);
        this.canvasElement.appendChild(component);
        //On adding new component to the canvas it captures the current state.
        this.historyManager.captureState();
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
    }
    return element;
  }
  generateUniqueClass(type) {
    // Get all components of the given type on the canvas, including those loaded from storage
    const existingClasses = this.components.map(
      component => component.className.split(' ')[0]
    );
    // Filter for components of the same type (e.g., 'button', 'header') and count them
    const existingCount = existingClasses.filter(className =>
      className.startsWith(type)
    ).length;
    // Generate the next unique class based on the count
    return `${type}${existingCount + 1}`;
  }
  //Unused for now, remove it later
  exportLayout() {
    return this.components.map(component => {
      return {
        type: component.className,
        content: component.innerHTML,
      };
    });
  }
}
Canvas.componentFactory = {
  button: () => new ButtonComponent().create('Click Me'),
  header: () => new HeaderComponent().create(1, 'Editable Header'),
  image: () => new ImageComponent().create('https://via.placeholder.com/150'),
  text: () => new TextComponent().create(),
  container: () => new ContainerComponent().create(),
};

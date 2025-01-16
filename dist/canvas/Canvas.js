import { DragDropManager } from './DragDropManager.js';
import { DeleteElementHandler } from './DeleteElement.js';
import { UserPortfolioTemplate } from './../templates/UserPortfolioTemplate.js';
import { LandingPageTemplate } from './../templates/LandingPageTemplate.js';
import {
  ButtonComponent,
  HeaderComponent,
  ImageComponent,
  TextComponent,
  ContainerComponent,
  TwoColumnContainer,
  ThreeColumnContainer,
} from '../components/index.js';
import { HistoryManager } from '../services/HistoryManager.js';
import { JSONStorage } from '../services/JSONStorage.js';
import { ComponentControlsManager } from './ComponentControls.js';
import { CustomizationSidebar } from '../sidebar/CustomizationSidebar.js';
import { MultiColumnContainer } from '../services/MultiColumnContainer.js';
import { GridManager } from './GridManager.js';
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
    Canvas.canvasElement.addEventListener('click', event => {
      const component = event.target;
      console.log('this is my component,', component);
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
    //Initialize grid manager and initialize drop-view
    Canvas.gridManager = new GridManager();
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
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
    // Reinitialize the drop-preview after clearing the canvas
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
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
      // Capture the image src for image components
      const imageSrc = component.querySelector('img')
        ? component.querySelector('img').src
        : null;
      // Capture all inline styles
      // Enhanced style capturing
      const computedStyles = window.getComputedStyle(component);
      const styles = {};
      // Capture all potentially relevant CSS properties
      const stylesToCapture = [
        'position',
        'top',
        'left',
        'right',
        'bottom',
        'width',
        'height',
        'min-width',
        'min-height',
        'max-width',
        'max-height',
        'margin',
        'padding',
        'background-color',
        'background-image',
        'border',
        'border-radius',
        'transform',
        'opacity',
        'z-index',
        'display',
        'flex-direction',
        'justify-content',
        'align-items',
        'flex-wrap',
        'font-size',
        'font-weight',
        'color',
        'text-align',
        'line-height',
      ];
      stylesToCapture.forEach(prop => {
        styles[prop] = computedStyles.getPropertyValue(prop);
      });
      // Capture data attributes
      const dataAttributes = {};
      Array.from(component.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .forEach(attr => {
          dataAttributes[attr.name] = attr.value;
        });
      return {
        id: component.id,
        type: baseType,
        content: component.innerHTML,
        position: {
          x: component.offsetLeft,
          y: component.offsetTop,
        },
        dimensions: {
          width: component.offsetWidth,
          height: component.offsetHeight,
        },
        style: styles, // Store all styles dynamically
        inlineStyle: component.getAttribute('style') || '',
        classes: Array.from(component.classList),
        dataAttributes: dataAttributes,
        imageSrc: imageSrc, // Store the image source if it's an image component
      };
    });
  }
  static restoreState(state) {
    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];
    state.forEach(componentData => {
      const component = Canvas.createComponent(componentData.type);
      if (component) {
        // Restore full content
        component.innerHTML = componentData.content;
        // Restore classes
        component.className = ''; // Clear existing classes
        componentData.classes.forEach(cls => {
          component.classList.add(cls);
        });
        // Restore inline styles
        if (componentData.inlineStyle) {
          component.setAttribute('style', componentData.inlineStyle);
        }
        // Restore computed styles
        if (componentData.computedStyle) {
          Object.keys(componentData.computedStyle).forEach(prop => {
            component.style.setProperty(
              prop,
              componentData.computedStyle[prop]
            );
          });
        }
        // Restore data attributes
        if (componentData.dataAttributes) {
          Object.entries(componentData.dataAttributes).forEach(
            ([key, value]) => {
              component.setAttribute(key, value);
            }
          );
        }
        // Add control buttons and listeners
        Canvas.controlsManager.addControlButtons(component);
        Canvas.addDraggableListeners(component);
        // Component-specific restoration
        if (component.classList.contains('container-component')) {
          ContainerComponent.restoreContainer(component);
        }
        // column-specific restoration
        if (
          component.classList.contains('twoCol-component') ||
          component.classList.contains('threeCol-component')
        ) {
          MultiColumnContainer.restoreColumn(component);
        }
        if (componentData.type === 'image') {
          ImageComponent.restoreImageUpload(component, componentData.imageSrc);
        }
        // Append to the canvas and add to the components array
        Canvas.canvasElement.appendChild(component);
        Canvas.components.push(component);
      }
    });
    // Reinitialize the drop-preview after restoring the state
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
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
    if (!componentType) {
      return;
    }
    const { gridX, gridY } = this.gridManager.mousePositionAtGridCorner(
      event,
      Canvas.canvasElement
    );
    const component = Canvas.createComponent(componentType);
    if (component) {
      // Add unique class name
      const uniqueClass = Canvas.generateUniqueClass(componentType);
      component.id = uniqueClass;
      component.classList.add(uniqueClass);
      component.style.position = 'absolute';
      if (
        componentType === 'container' ||
        componentType === 'twoCol' ||
        componentType === 'threeCol'
      ) {
        // Specific logic for containers
        component.style.top = `${event.offsetY}px`;
      } else {
        // Position the component at the snapped grid corner
        component.style.position = 'absolute';
        component.style.left = `${gridX}px`;
        component.style.top = `${gridY}px`;
      }
      // Create label for showing class name on hover
      const label = document.createElement('span');
      label.className = 'component-label';
      label.textContent = uniqueClass;
      component.appendChild(label);
      Canvas.components.push(component);
      Canvas.canvasElement.appendChild(component);
      Canvas.addDraggableListeners(component); // Add drag functionality
      CustomizationSidebar.updateLayersView();
      //On adding new component to the canvas it captures the current state.
      Canvas.historyManager.captureState();
    }
  }
  // Reorder components in the Canvas model (in the components array)
  static reorderComponent(fromIndex, toIndex) {
    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= this.components.length ||
      toIndex >= this.components.length
    ) {
      console.error('Invalid indices for reordering');
      return;
    }
    const [movedComponent] = this.components.splice(fromIndex, 1);
    this.components.splice(toIndex, 0, movedComponent);
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
      canvasContainer.innerHTML = '';
      this.components.forEach(component => {
        canvasContainer.appendChild(component);
      });
    }
    this.historyManager.captureState();
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
      if (type != 'container') {
        element.classList.add('component-resizer');
      }
      const uniqueClass = Canvas.generateUniqueClass(type);
      element.setAttribute('id', uniqueClass);
      // Conditionally set contenteditable attribute
      if (type === 'image') {
        element.setAttribute('contenteditable', 'false'); // Image should not be editable
      } else {
        element.setAttribute('contenteditable', 'true'); // Other components are editable
      }
      //Add control for each component
      Canvas.controlsManager.addControlButtons(element);
      CustomizationSidebar.updateLayersView();
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
      let containerElement = Canvas.components.find(component =>
        component.classList.contains(containerClass)
      );
      if (!containerElement) {
        // If container is not found in Canvas.components, try searching in the whole document
        containerElement = document.querySelector(`.${containerClass}`);
        if (!containerElement) {
          console.warn(`Container with class ${containerClass} not found.`);
          return `${containerClass}-${type}1`; // Default fallback name if no container found
        }
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
    let dragStartX = 0;
    let dragStartY = 0;
    let elementStartX = 0;
    let elementStartY = 0;
    element.addEventListener('dragstart', event => {
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
    element.addEventListener('dragend', event => {
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
Canvas.components = [];
Canvas.componentFactory = {
  button: () => new ButtonComponent().create(),
  header: () => new HeaderComponent().create(),
  image: () => new ImageComponent().create('https://via.placeholder.com/150'),
  text: () => new TextComponent().create(),
  container: () => new ContainerComponent().create(),
  twoCol: () => new TwoColumnContainer().create(),
  threeCol: () => new ThreeColumnContainer().create(),
  portfolio: () => new UserPortfolioTemplate().create(),
  landingpage: () => new LandingPageTemplate().create(),
};
const canvas = document.getElementById('canvas');
// Instantiate the DeleteElementHandler
const deleteElementHandler = new DeleteElementHandler();
if (canvas) {
  // Attach click event listener to canvas elements
  canvas.addEventListener('click', event => {
    const target = event.target;
    if (target !== canvas) {
      deleteElementHandler.selectElement(target);
    }
  });
}

import { DragDropManager } from './DragDropManager.js';
import { DeleteElementHandler } from './DeleteElement.js';
import { LandingPageTemplate } from './../templates/LandingPageTemplate.js';
import {
  ButtonComponent,
  HeaderComponent,
  ImageComponent,
  VideoComponent,
  TextComponent,
  ContainerComponent,
  TwoColumnContainer,
  ThreeColumnContainer,
  TableComponent,
  LinkComponent,
} from '../components/index.js';
import { HistoryManager } from '../services/HistoryManager.js';
import { JSONStorage } from '../services/JSONStorage.js';
import { ComponentControlsManager } from './ComponentControls.js';
import { CustomizationSidebar } from '../sidebar/CustomizationSidebar.js';
import { MultiColumnContainer } from '../services/MultiColumnContainer.js';
import { GridManager } from './GridManager.js';
export class Canvas {
  static getComponents() {
    return Canvas.components;
  }
  static setComponents(components) {
    Canvas.components = components;
  }
  static init(initialData = null, editable) {
    this.editable = editable;
    Canvas.canvasElement = document.getElementById('canvas');
    Canvas.sidebarElement = document.getElementById('sidebar');
    Canvas.canvasElement.addEventListener('drop', Canvas.onDrop.bind(Canvas));
    Canvas.canvasElement.addEventListener('dragover', event =>
      event.preventDefault()
    );
    Canvas.canvasElement.addEventListener('click', event => {
      const component = event.target;
      if (component) {
        CustomizationSidebar.showSidebar(component.id);
      }
    });
    Canvas.canvasElement.style.position = 'relative';
    Canvas.historyManager = new HistoryManager(Canvas.canvasElement);
    Canvas.jsonStorage = new JSONStorage();
    Canvas.controlsManager = new ComponentControlsManager(Canvas);
    Canvas.gridManager = new GridManager();
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
    const dragDropManager = new DragDropManager(
      Canvas.canvasElement,
      Canvas.sidebarElement
    );
    dragDropManager.enable();
    if (initialData) {
      console.log('Canvas: Restoring state from initialData prop.');
      Canvas.restoreState(initialData);
    } else {
      const savedState = Canvas.jsonStorage.load();
      if (savedState) {
        console.log('Canvas: Restoring state from localStorage.');
        Canvas.restoreState(savedState);
      }
    }
  }
  /**
   * Dispatches a custom event indicating that the canvas design has changed.
   * The event detail contains the current design state.
   */
  static dispatchDesignChange() {
    if (Canvas.canvasElement && this.editable) {
      const currentDesign = Canvas.getState();
      const event = new CustomEvent('design-change', {
        detail: currentDesign,
        bubbles: true,
        composed: true,
      });
      Canvas.canvasElement.dispatchEvent(event);
      console.log('Canvas: Dispatched design-change event');
    }
  }
  static clearCanvas() {
    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];
    Canvas.historyManager.captureState();
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
    Canvas.gridManager.initializeDropPreview(Canvas.canvasElement);
    Canvas.dispatchDesignChange();
  }
  static getState() {
    return Canvas.components.map(component => {
      const baseType = component.classList[0]
        .split(/\d/)[0]
        .replace('-component', '');
      const imageElement = component.querySelector('img');
      const imageSrc = imageElement ? imageElement.src : null;
      const videoElement = component.querySelector('video');
      const videoSrc = videoElement ? videoElement.src : null;
      const computedStyles = window.getComputedStyle(component);
      const styles = {};
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
      const dataAttributes = {};
      Array.from(component.attributes)
        .filter(attr => attr.name.startsWith('data-'))
        .forEach(attr => {
          dataAttributes[attr.name] = attr.value;
        });
      let componentProps = {};
      if (component.classList.contains('custom-component')) {
        const propsJson = component.getAttribute('data-component-props');
        if (propsJson) {
          try {
            componentProps = JSON.parse(propsJson);
          } catch (e) {
            console.error('Error parsing data-component-props:', e);
          }
        }
      }
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
        style: styles,
        inlineStyle: component.getAttribute('style') || '',
        classes: Array.from(component.classList),
        dataAttributes: dataAttributes,
        imageSrc: imageSrc,
        videoSrc: videoSrc,
        props: componentProps,
      };
    });
  }
  static restoreState(state) {
    Canvas.canvasElement.innerHTML = '';
    Canvas.components = [];
    state.forEach(componentData => {
      const customSettings =
        componentData.dataAttributes['data-custom-settings'] || null;
      const component = Canvas.createComponent(
        componentData.type,
        customSettings
      );
      if (component) {
        if (!componentData.classes.includes('custom-component')) {
          component.innerHTML = componentData.content;
        }
        component.className = '';
        componentData.classes.forEach(cls => {
          component.classList.add(cls);
        });
        if (componentData.type === 'video' && componentData.videoSrc) {
          const videoElement = component.querySelector('video');
          const uploadText = component.querySelector('.upload-text');
          videoElement.src = componentData.videoSrc;
          videoElement.style.display = 'block';
          uploadText.style.display = 'none';
        }
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
        if (componentData.type === 'table') {
          TableComponent.restore(component);
        }
        if (componentData.type === 'link') {
          LinkComponent.restore(component);
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
    var _a, _b;
    event.preventDefault();
    if (event.target.classList.contains('container-component')) {
      return;
    }
    const componentType =
      (_a = event.dataTransfer) === null || _a === void 0
        ? void 0
        : _a.getData('component-type');
    let customSettings =
      (_b = event.dataTransfer) === null || _b === void 0
        ? void 0
        : _b.getData('custom-settings');
    if (!componentType) {
      return;
    }
    if (!customSettings || customSettings.trim() === '') {
      const draggableElement = document.querySelector(
        `[data-component="${componentType}"]`
      );
      if (draggableElement) {
        if (window.customComponents && window.customComponents[componentType]) {
          const componentConfig = window.customComponents[componentType];
          if (componentConfig.settings) {
            customSettings = JSON.stringify(componentConfig.settings);
          }
        }
      }
    }
    const { gridX, gridY } = this.gridManager.mousePositionAtGridCorner(
      event,
      Canvas.canvasElement
    );
    const component = Canvas.createComponent(componentType, customSettings);
    if (component) {
      const uniqueClass = Canvas.generateUniqueClass(componentType);
      component.id = uniqueClass;
      component.classList.add(uniqueClass);
      component.style.position = 'absolute';
      if (
        componentType === 'container' ||
        componentType === 'twoCol' ||
        componentType === 'threeCol'
      ) {
        component.style.top = `${event.offsetY}px`;
      } else {
        component.style.position = 'absolute';
        component.style.left = `${gridX}px`;
        component.style.top = `${gridY}px`;
      }
      Canvas.components.push(component);
      Canvas.canvasElement.appendChild(component);
      Canvas.addDraggableListeners(component);
      Canvas.historyManager.captureState();
    }
    Canvas.dispatchDesignChange();
  }
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
    Canvas.dispatchDesignChange();
  }
  static createComponent(type, customSettings = null) {
    let element = null;
    const componentFactoryFunction = Canvas.componentFactory[type];
    if (componentFactoryFunction) {
      element = componentFactoryFunction();
    } else {
      const tagNameElement = document.querySelector(
        `[data-component='${type}']`
      );
      const tagName =
        tagNameElement === null || tagNameElement === void 0
          ? void 0
          : tagNameElement.getAttribute('data-tag-name');
      if (tagName) {
        element = document.createElement(tagName);
        element.classList.add(`${type}-component`, 'custom-component');
        element.setAttribute('data-component-type', type);
      } else {
        return null;
      }
    }
    if (element) {
      const resizeObserver = new ResizeObserver(entries => {
        Canvas.dispatchDesignChange();
      });
      resizeObserver.observe(element);
      element.classList.add('editable-component');
      if (type != 'container') {
        element.classList.add('component-resizer');
      }
      const uniqueClass = Canvas.generateUniqueClass(type);
      element.setAttribute('id', uniqueClass);
      // Conditionally set contenteditable attribute
      if (type === 'image') {
        element.setAttribute('contenteditable', 'false');
      } else {
        element.setAttribute('contenteditable', 'true');
        element.addEventListener('input', () => {
          Canvas.historyManager.captureState();
        });
      }
      // Create label for showing class name on hover
      const label = document.createElement('span');
      label.className = 'component-label';
      label.textContent = uniqueClass;
      element.appendChild(label);
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
      let containerElement = Canvas.components.find(component =>
        component.classList.contains(containerClass)
      );
      if (!containerElement) {
        containerElement = document.querySelector(`.${containerClass}`);
        if (!containerElement) {
          return `${containerClass}-${type}1`;
        }
      }
      const containerComponents = Array.from(containerElement.children);
      const typePattern = new RegExp(`${containerClass}-${type}(\\d+)`);
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
      const typePattern = new RegExp(`${type}(\\d+)`);
      let maxNumber = 0;
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
        const canvasRect = Canvas.canvasElement.getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        elementStartX = rect.left - canvasRect.left;
        elementStartY = rect.top - canvasRect.top;
        event.dataTransfer.effectAllowed = 'move';
        element.style.cursor = 'grabbing';
      }
    });
    element.addEventListener('dragend', event => {
      event.preventDefault();
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
      Canvas.dispatchDesignChange();
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
  image: () => new ImageComponent().create(),
  video: () =>
    new VideoComponent(() => Canvas.historyManager.captureState()).create(),
  table: () => new TableComponent().create(2, 2),
  text: () => new TextComponent().create(),
  container: () => new ContainerComponent().create(),
  twoCol: () => new TwoColumnContainer().create(),
  threeCol: () => new ThreeColumnContainer().create(),
  landingpage: () => new LandingPageTemplate().create(),
  link: () => new LinkComponent().create(),
};
const canvas = document.getElementById('canvas');
const deleteElementHandler = new DeleteElementHandler();
if (canvas) {
  canvas.addEventListener('click', event => {
    const target = event.target;
    if (target !== canvas) {
      deleteElementHandler.selectElement(target);
    }
  });
}

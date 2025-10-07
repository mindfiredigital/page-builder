import { Canvas } from '../canvas/Canvas.js';
import { ImageComponent } from './ImageComponent.js';
export class ContainerComponent {
  constructor() {
    this.MINIMUM_SIZE = 20;
    this.originalWidth = 0;
    this.originalHeight = 0;
    this.originalX = 0;
    this.originalY = 0;
    this.originalMouseX = 0;
    this.originalMouseY = 0;
    this.currentResizer = null;
    this.resize = e => {
      if (!this.currentResizer) return;
      const deltaX = e.pageX - this.originalMouseX;
      const deltaY = e.pageY - this.originalMouseY;
      if (this.currentResizer.classList.contains('bottom-right')) {
        const width = this.originalWidth + deltaX;
        const height = this.originalHeight + deltaY;
        if (width > this.MINIMUM_SIZE) {
          this.element.style.width = `${width}px`;
        }
        if (height > this.MINIMUM_SIZE) {
          this.element.style.height = `${height}px`;
        }
      } else if (this.currentResizer.classList.contains('bottom-left')) {
        const height = this.originalHeight + deltaY;
        const width = this.originalWidth - deltaX;
        if (height > this.MINIMUM_SIZE) {
          this.element.style.height = `${height}px`;
        }
        if (width > this.MINIMUM_SIZE) {
          this.element.style.width = `${width}px`;
          this.element.style.left = `${this.originalX + deltaX}px`;
        }
      } else if (this.currentResizer.classList.contains('top-right')) {
        const width = this.originalWidth + deltaX;
        const height = this.originalHeight - deltaY;
        if (width > this.MINIMUM_SIZE) {
          this.element.style.width = `${width}px`;
        }
        if (height > this.MINIMUM_SIZE) {
          this.element.style.height = `${height}px`;
          this.element.style.top = `${this.originalY + deltaY}px`;
        }
      } else if (this.currentResizer.classList.contains('top-left')) {
        const width = this.originalWidth - deltaX;
        const height = this.originalHeight - deltaY;
        if (width > this.MINIMUM_SIZE) {
          this.element.style.width = `${width}px`;
          this.element.style.left = `${this.originalX + deltaX}px`;
        }
        if (height > this.MINIMUM_SIZE) {
          this.element.style.height = `${height}px`;
          this.element.style.top = `${this.originalY + deltaY}px`;
        }
      }
    };
    /**
     * On mouse up event the resizing stops and captures the state
     * Which will help keep tracking of state for undo/redo purpose
     */
    this.stopResize = () => {
      window.removeEventListener('mousemove', this.resize);
      window.removeEventListener('mouseup', this.stopResize);
      this.currentResizer = null;
      //capture each resized state
      Canvas.historyManager.captureState();
    };
    this.element = document.createElement('div');
    this.element.classList.add('container-component');
    this.element.setAttribute('draggable', 'true');
    // Initialize resizers container
    this.resizers = document.createElement('div');
    this.resizers.classList.add('resizers');
    this.element.appendChild(this.resizers);
    // Add resizer handles
    this.addResizeHandles();
    // Add styles
    this.addStyles();
    // Add event listeners
    this.initializeEventListeners();
  }
  addResizeHandles() {
    const positions = [
      { class: 'top-left', cursor: 'nwse-resize' },
      { class: 'top-right', cursor: 'nesw-resize' },
      { class: 'bottom-left', cursor: 'nesw-resize' },
      { class: 'bottom-right', cursor: 'nwse-resize' },
    ];
    positions.forEach(position => {
      const resizer = document.createElement('div');
      resizer.classList.add('resizer', position.class);
      resizer.addEventListener('mousedown', e => this.initResize(e, resizer));
      this.resizers.appendChild(resizer);
    });
  }
  initResize(e, resizer) {
    e.preventDefault();
    this.currentResizer = resizer;
    // Store original dimensions and positions
    this.originalWidth = parseFloat(
      getComputedStyle(this.element).getPropertyValue('width')
    );
    this.originalHeight = parseFloat(
      getComputedStyle(this.element).getPropertyValue('height')
    );
    this.originalX = this.element.getBoundingClientRect().left;
    this.originalY = this.element.getBoundingClientRect().top;
    this.originalMouseX = e.pageX;
    this.originalMouseY = e.pageY;
    // Add resize events
    window.addEventListener('mousemove', this.resize);
    window.addEventListener('mouseup', this.stopResize);
  }
  initializeEventListeners() {
    this.element.addEventListener('dragstart', this.onDragStart.bind(this));
    this.element.addEventListener('drop', this.onDrop.bind(this));
    this.element.addEventListener('dragover', event => event.preventDefault());
    this.element.addEventListener('mouseover', this.onMouseOver.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }
  onDragStart(event) {
    event.stopPropagation();
  }
  makeDraggable(element) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let offsetX = 0;
    let offsetY = 0;
    const onMouseDown = event => {
      event.preventDefault();
      event.stopPropagation();
      isDragging = true;
      // Calculate initial positions
      startX = event.clientX;
      startY = event.clientY;
      const rect = element.getBoundingClientRect();
      offsetX = rect.left;
      offsetY = rect.top;
      // Add event listeners for dragging
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    };
    const onMouseMove = event => {
      if (!isDragging) return;
      // Calculate the new position
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;
      // Update the element's position using CSS transform
      element.style.transform = `translate(${offsetX + deltaX}px, ${offsetY + deltaY}px)`;
    };
    const onMouseUp = () => {
      isDragging = false;
      // Remove event listeners to stop dragging
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    // Attach the mousedown event to the element
    element.addEventListener('mousedown', onMouseDown);
  }
  onDrop(event) {
    var _a;
    event.preventDefault();
    event.stopPropagation();
    const componentType =
      (_a = event.dataTransfer) === null || _a === void 0
        ? void 0
        : _a.getData('component-type');
    if (!componentType) return;
    const component = Canvas.createComponent(componentType);
    if (!component) return;
    const containerClass = this.element.classList[2];
    const uniqueClass = Canvas.generateUniqueClass(
      componentType,
      true,
      containerClass
    );
    component.classList.add(uniqueClass);
    const label = document.createElement('span');
    label.className = 'component-label';
    label.textContent = uniqueClass;
    label.setAttribute('contenteditable', 'false');
    component.id = uniqueClass;
    label.style.display = 'none';
    component.appendChild(label);
    component.addEventListener('mouseenter', e => this.showLabel(e, component));
    component.addEventListener('mouseleave', e => this.hideLabel(e, component));
    this.element.appendChild(component);
    // Apply draggable functionality to the new component
    this.makeDraggable(component);
    // Capture state for undo/redo
    Canvas.historyManager.captureState();
  }
  showLabel(event, component) {
    event.stopPropagation();
    const label = component.querySelector('.component-label');
    if (label) {
      label.style.display = 'block';
    }
  }
  hideLabel(event, component) {
    event.stopPropagation();
    const label = component.querySelector('.component-label');
    if (label) {
      label.style.display = 'none';
    }
  }
  onMouseOver(event) {
    event.stopPropagation();
    const elements = document.querySelectorAll('.container-highlight');
    // Loop through each element and remove the class
    elements.forEach(element => {
      element.classList.remove('container-highlight');
    });
    if (event.target === this.element) {
      this.element.classList.add('container-highlight');
    }
  }
  onMouseLeave(event) {
    if (event.target === this.element) {
      this.element.classList.remove('container-highlight');
    }
  }
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .container-component {
        position: relative !important;
        display: flex;
        min-width: 100px;
        min-height: 100px;
        cursor: grab;
        border: 1px solid #ddd;
      }

      .resizer {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: white;
        border: 2px solid #4286f4;
        position: absolute;
      }

      .resizer.top-left {
        left: -5px;
        top: -5px;
        cursor: nwse-resize;
      }

      .resizer.top-right {
        right: -5px;
        top: -5px;
        cursor: nesw-resize;
      }

      .resizer.bottom-left {
        left: -5px;
        bottom: -5px;
        cursor: nesw-resize;
      }

      .resizer.bottom-right {
        right: -5px;
        bottom: -5px;
        cursor: nwse-resize;
      }
    `;
    document.head.appendChild(style);
  }
  create() {
    return this.element;
  }
  static restoreResizer(element) {
    // Remove any existing resizers
    const oldResizers = element.querySelector('.resizers');
    if (oldResizers) {
      oldResizers.remove();
    }
    // Create new resizers container
    const resizersDiv = document.createElement('div');
    resizersDiv.classList.add('resizers');
    // Create temporary container instance to bind event listeners
    const container = new ContainerComponent();
    container.element = element;
    container.resizers = resizersDiv;
    // Add resize handles
    container.addResizeHandles();
    // Add new resizers to the element
    element.appendChild(resizersDiv);
  }
  static restoreContainer(container, editable) {
    // Restore resizer functionality
    if (editable !== false) {
      ContainerComponent.restoreResizer(container);
    }
    // Create a temporary instance of ContainerComponent to reuse its methods
    const containerInstance = new ContainerComponent();
    containerInstance.element = container;
    if (editable !== false) {
      container.addEventListener(
        'drop',
        containerInstance.onDrop.bind(containerInstance)
      );
      container.addEventListener('dragover', event => event.preventDefault());
    } else {
      container.classList.remove('editable-component');
      container.removeAttribute('draggable');
    }
    // Reapply controls to child components inside the container
    const containerChildren = container.querySelectorAll('.editable-component');
    containerChildren.forEach(child => {
      var _a;
      // Add control buttons and draggable listeners
      if (editable !== false) {
        Canvas.controlsManager.addControlButtons(child);
        Canvas.addDraggableListeners(child);
        // Bind the showLabel and hideLabel methods
        child.addEventListener('mouseenter', event =>
          containerInstance.showLabel(event, child)
        );
        child.addEventListener('mouseleave', event =>
          containerInstance.hideLabel(event, child)
        );
      } else {
        const targetElements = child.querySelectorAll(`[contenteditable]`);
        if (targetElements.length > 0) {
          targetElements.forEach(element => {
            element.removeAttribute('contenteditable');
          });
        }
        child.classList.remove('editable-component');
        child.classList.remove('component-resizer');
        child.removeAttribute('draggable');
        child.removeAttribute('contenteditable');
      }
      // If the child is an image component, restore the image upload feature
      if (child.classList.contains('image-component')) {
        const imageSrc =
          ((_a = child.querySelector('img')) === null || _a === void 0
            ? void 0
            : _a.getAttribute('src')) || ''; // Get the saved image source
        ImageComponent.restoreImageUpload(child, imageSrc, editable);
      }
      // If the child is itself a container, restore it recursively
      if (child.classList.contains('container-component')) {
        this.restoreContainer(child);
      }
    });
  }
}

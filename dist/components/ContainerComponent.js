import { Canvas } from '../canvas/Canvas.js';
export class ContainerComponent {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('container-component');
    this.element.setAttribute('draggable', 'true');
    // Add drag event listeners
    this.element.addEventListener('dragover', event => event.preventDefault());
    this.element.addEventListener('drop', this.onDrop.bind(this));
    // Add hover and focus event listeners
    this.element.addEventListener('mouseover', this.onHover.bind(this));
    this.element.addEventListener('focus', this.onFocus.bind(this));
    this.element.addEventListener('mouseleave', this.onBlur.bind(this));
    this.element.addEventListener('blur', this.onBlur.bind(this));
  }
  create() {
    return this.element;
  }
  onDrop(event) {
    var _a;
    event.preventDefault();
    event.stopPropagation();
    const componentType =
      (_a = event.dataTransfer) === null || _a === void 0
        ? void 0
        : _a.getData('component-type');
    console.log(`Dropped inside container, component type: ${componentType}`);
    if (componentType) {
      const component = Canvas.createComponent(componentType);
      if (component) {
        // Attach hover/focus styles to child components
        component.classList.add('editable-component');
        component.addEventListener('mouseover', this.onHover.bind(this));
        component.addEventListener('focus', this.onFocus.bind(this));
        component.addEventListener('mouseleave', this.onBlur.bind(this));
        component.addEventListener('blur', this.onBlur.bind(this));
        this.element.appendChild(component);
      }
    }
  }
  onHover(event) {
    event.stopPropagation(); // Prevent hover effect from propagating up
    event.currentTarget.classList.add('hover-active');
  }
  onFocus(event) {
    event.stopPropagation(); // Prevent focus effect from propagating up
    event.currentTarget.classList.add('focus-active');
  }
  onBlur(event) {
    event.currentTarget.classList.remove('hover-active', 'focus-active');
  }
}

import { Canvas } from '../canvas/Canvas.js';
export class ContainerComponent {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('container-component');
    this.element.setAttribute('draggable', 'true');
    // Add drag and drop event listeners
    this.element.addEventListener('dragover', event => event.preventDefault());
    this.element.addEventListener('drop', this.onDrop.bind(this));
    // Add hover effects for the container itself only
    this.element.addEventListener('mouseenter', this.onHover.bind(this));
    this.element.addEventListener('mouseleave', this.onBlur.bind(this));
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
    if (componentType) {
      const component = Canvas.createComponent(componentType);
      if (component) {
        // Add unique label to each component
        const uniqueClass = Canvas.generateUniqueClass(componentType);
        component.classList.add(uniqueClass);
        const label = document.createElement('span');
        label.className = 'component-label';
        label.textContent = uniqueClass;
        label.style.display = 'none'; // Hide label by default
        component.appendChild(label);
        // Add individual hover/focus event listeners to the child component
        component.addEventListener('mouseenter', e =>
          this.showLabel(e, component)
        );
        component.addEventListener('mouseleave', e =>
          this.hideLabel(e, component)
        );
        this.element.appendChild(component);
      }
    }
  }
  showLabel(event, component) {
    event.stopPropagation(); // Prevent event from reaching the container
    const label = component.querySelector('.component-label');
    if (label) {
      label.style.display = 'block'; // Show label on component hover
    }
    component.classList.add('hover-active'); // Add hover style to the component
  }
  hideLabel(event, component) {
    event.stopPropagation(); // Prevent event from reaching the container
    const label = component.querySelector('.component-label');
    if (label) {
      label.style.display = 'none'; // Hide label on component leave
    }
    component.classList.remove('hover-active'); // Remove hover style from component
  }
  onHover(event) {
    if (event.target === this.element) {
      // Only add hover style if directly on the container
      this.element.classList.add('hover-active');
    }
  }
  onBlur(event) {
    if (event.target === this.element) {
      // Only remove hover style if directly on the container
      this.element.classList.remove('hover-active');
    }
  }
}

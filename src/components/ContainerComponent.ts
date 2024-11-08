import { Canvas } from '../canvas/Canvas';

export class ContainerComponent {
  private element: HTMLElement;

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

  create(): HTMLElement {
    return this.element;
  }

  private onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const componentType = event.dataTransfer?.getData('component-type');
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

  private showLabel(event: MouseEvent, component: HTMLElement) {
    event.stopPropagation(); // Prevent event from reaching the container
    const label = component.querySelector('.component-label') as HTMLElement;
    if (label) {
      label.style.display = 'block'; // Show label on component hover
    }
    component.classList.add('hover-active'); // Add hover style to the component
  }

  private hideLabel(event: MouseEvent, component: HTMLElement) {
    event.stopPropagation(); // Prevent event from reaching the container
    const label = component.querySelector('.component-label') as HTMLElement;
    if (label) {
      label.style.display = 'none'; // Hide label on component leave
    }
    component.classList.remove('hover-active'); // Remove hover style from component
  }

  private onHover(event: MouseEvent) {
    if (event.target === this.element) {
      // Only add hover style if directly on the container
      this.element.classList.add('hover-active');
    }
  }

  private onBlur(event: MouseEvent) {
    if (event.target === this.element) {
      // Only remove hover style if directly on the container
      this.element.classList.remove('hover-active');
    }
  }
}

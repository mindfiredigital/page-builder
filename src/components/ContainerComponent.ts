import { Canvas } from '../canvas/Canvas';

export class ContainerComponent {
  private element: HTMLElement;

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

  create(): HTMLElement {
    return this.element;
  }

  private onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const componentType = event.dataTransfer?.getData('component-type');
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

  private onHover(event: MouseEvent) {
    event.stopPropagation(); // Prevent hover effect from propagating up
    (event.currentTarget as HTMLElement).classList.add('hover-active');
  }

  private onFocus(event: FocusEvent) {
    event.stopPropagation(); // Prevent focus effect from propagating up
    (event.currentTarget as HTMLElement).classList.add('focus-active');
  }

  private onBlur(event: Event) {
    (event.currentTarget as HTMLElement).classList.remove(
      'hover-active',
      'focus-active'
    );
  }
}

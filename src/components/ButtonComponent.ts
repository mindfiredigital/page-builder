import { Canvas } from '../canvas/Canvas';
export class ButtonComponent {
  private element: HTMLElement;
  private resizers: HTMLElement;
  private readonly MINIMUM_SIZE = 20;
  private originalWidth: number = 0;
  private originalHeight: number = 0;
  private originalX: number = 0;
  private originalY: number = 0;
  private originalMouseX: number = 0;
  private originalMouseY: number = 0;
  private currentResizer: HTMLElement | null = null;

  constructor() {
    this.element = document.createElement('button');
    this.element.innerText = 'Click Me'; // Default button text
    this.element.classList.add('button-component');

    // Apply default styles
    this.addStyles();

    // Initialize resizers container
    this.resizers = document.createElement('div');
    this.resizers.classList.add('resizers');
    this.element.appendChild(this.resizers);

    // Add resizer handles
    this.addResizeHandles();

    // Add event listeners
    this.initializeEventListeners();
  }

  private addResizeHandles(): void {
    const positions = [
      { class: 'top-left', cursor: 'nwse-resize' },
      { class: 'top-right', cursor: 'nesw-resize' },
      { class: 'bottom-left', cursor: 'nesw-resize' },
      { class: 'bottom-right', cursor: 'nwse-resize' },
    ];

    positions.forEach(position => {
      const resizer = document.createElement('div');
      resizer.classList.add('resizer', position.class);
      resizer.style.cursor = position.cursor;
      resizer.addEventListener('mousedown', e => this.initResize(e, resizer));
      this.resizers.appendChild(resizer);
    });
  }

  private initResize(e: MouseEvent, resizer: HTMLElement): void {
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

  private resize = (e: MouseEvent): void => {
    if (!this.currentResizer) return;

    const deltaX = e.pageX - this.originalMouseX;
    const deltaY = e.pageY - this.originalMouseY;

    if (this.currentResizer.classList.contains('bottom-right')) {
      // Resize bottom-right corner
      const width = this.originalWidth + deltaX;
      const height = this.originalHeight + deltaY;

      if (width > this.MINIMUM_SIZE) {
        this.element.style.width = `${width}px`;
      }
      if (height > this.MINIMUM_SIZE) {
        this.element.style.height = `${height}px`;
      }
    } else if (this.currentResizer.classList.contains('bottom-left')) {
      // Resize bottom-left corner
      const width = this.originalWidth - deltaX;
      const height = this.originalHeight + deltaY;

      if (width > this.MINIMUM_SIZE) {
        this.element.style.width = `${width}px`;
        this.element.style.left = `${this.originalX + deltaX}px`;
      }
      if (height > this.MINIMUM_SIZE) {
        this.element.style.height = `${height}px`;
      }
    } else if (this.currentResizer.classList.contains('top-right')) {
      // Resize top-right corner
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
      // Resize top-left corner
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

  private stopResize = (): void => {
    window.removeEventListener('mousemove', this.resize);
    window.removeEventListener('mouseup', this.stopResize);
    this.currentResizer = null;

    // Capture state for undo/redo
    Canvas.historyManager.captureState();
  };

  private initializeEventListeners(): void {
    this.element.addEventListener('mouseover', this.onMouseOver.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  private onMouseOver(event: MouseEvent): void {
    event.stopPropagation();
    this.element.classList.add('button-highlight');
  }

  private onMouseLeave(event: MouseEvent): void {
    event.stopPropagation();
    this.element.classList.remove('button-highlight');
  }

  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .button-component {
        padding: 10px 20px;
        font-size: 14px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        display: inline-block;
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
        top: -5px;
        left: -5px;
      }

      .resizer.top-right {
        top: -5px;
        right: -5px;
      }

      .resizer.bottom-left {
        bottom: -5px;
        left: -5px;
      }

      .resizer.bottom-right {
        bottom: -5px;
        right: -5px;
      }
    `;
    document.head.appendChild(style);
  }

  public create(): HTMLElement {
    return this.element;
  }
}

export class HeaderComponent {
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

  constructor(level: number = 1, text: string = 'Header') {
    this.element = document.createElement(`h${level}`);
    this.element.innerText = text;
    this.element.classList.add('header-component');

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

  private stopResize = (): void => {
    window.removeEventListener('mousemove', this.resize);
    window.removeEventListener('mouseup', this.stopResize);
    this.currentResizer = null;

    // Capture state for undo/redo
    // Canvas.historyManager.captureState();
  };

  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .header-component {
        position: relative;
        display: inline-block;
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

  private initializeEventListeners(): void {
    // Add any additional event listeners if needed
  }

  public create(): HTMLElement {
    return this.element;
  }
}

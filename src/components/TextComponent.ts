export class TextComponent {
  private text: string;
  private readonly MINIMUM_SIZE = 20;
  private element: HTMLElement;
  private resizers: HTMLElement;
  private originalWidth: number = 0;
  private originalHeight: number = 0;
  private originalX: number = 0;
  private originalY: number = 0;
  private originalMouseX: number = 0;
  private originalMouseY: number = 0;
  private currentResizer: HTMLElement | null = null;

  constructor(text: string = 'Sample Text') {
    this.text = text;

    this.element = document.createElement('div');
    this.element.innerText = this.text;
    this.element.contentEditable = 'true';
    this.element.classList.add('text-component');
    this.element.style.position = 'relative';
    this.element.style.minWidth = `${this.MINIMUM_SIZE}px`;
    this.element.style.minHeight = `${this.MINIMUM_SIZE}px`;
    this.element.style.border = '1px solid #ddd';
    this.element.style.padding = '5px';
    this.element.style.resize = 'none';

    this.resizers = document.createElement('div');
    this.resizers.classList.add('resizers');
    this.element.appendChild(this.resizers);

    this.addResizeHandles();
    this.addStyles();
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
  };

  private initializeEventListeners(): void {
    this.element.addEventListener('mouseover', this.onMouseOver.bind(this));
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
  }

  private onMouseOver(event: MouseEvent) {
    event.stopPropagation();
    this.element.classList.add('text-highlight');
  }

  private onMouseLeave(event: MouseEvent): void {
    this.element.classList.remove('text-highlight');
  }

  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
      .text-component {
        position: relative;
        display: inline-block;
        padding: 10px;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
        font-family: Arial, sans-serif;
        font-size: 14px;
      }

      .resizers {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        pointer-events: none;
      }

      .resizer {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: white;
        border: 2px solid #4286f4;
        position: absolute;
        pointer-events: all;
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

      .text-highlight {
        border-color: #4286f4;
      }
    `;
    document.head.appendChild(style);
  }

  public create(): HTMLElement {
    return this.element;
  }

  public setText(newText: string): void {
    this.text = newText;
    this.element.innerText = newText;
  }
}

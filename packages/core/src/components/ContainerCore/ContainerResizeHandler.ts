import { Canvas } from '../../canvas/Canvas';
import { MINIMUM_SIZE, RESIZER_POSITIONS } from './ContainerTypes';

/* Manages corner-handle resizing for a container element */
export class ContainerResizeHandler {
  private element: HTMLElement;
  private resizersEl: HTMLElement;

  /* Snapshot values captured when a resize gesture begins */
  private originalWidth: number = 0;
  private originalHeight: number = 0;
  private originalX: number = 0;
  private originalY: number = 0;
  private originalMouseX: number = 0;
  private originalMouseY: number = 0;

  /* The corner handle currently being dragged */
  private currentResizer: HTMLElement | null = null;

  constructor(element: HTMLElement, resizersEl: HTMLElement) {
    this.element = element;
    this.resizersEl = resizersEl;
  }

  /* Appends four corner handles and binds mousedown on each */
  public addResizeHandles(): void {
    RESIZER_POSITIONS.forEach(position => {
      const resizer = document.createElement('div');
      resizer.classList.add('resizer', position.class);

      /* Each handle starts a resize on mousedown */
      resizer.addEventListener('mousedown', e => this.initResize(e, resizer));

      this.resizersEl.appendChild(resizer);
    });
  }

  /* Captures baseline measurements and registers global move/up listeners */
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

  /* Recalculates dimensions based on which corner is being dragged */
  private resize = (e: MouseEvent): void => {
    if (!this.currentResizer) return;

    const deltaX = e.pageX - this.originalMouseX;
    const deltaY = e.pageY - this.originalMouseY;

    if (this.currentResizer.classList.contains('bottom-right')) {
      const width = this.originalWidth + deltaX;
      const height = this.originalHeight + deltaY;

      if (width > MINIMUM_SIZE) this.element.style.width = `${width}px`;
      if (height > MINIMUM_SIZE) this.element.style.height = `${height}px`;
    } else if (this.currentResizer.classList.contains('bottom-left')) {
      const height = this.originalHeight + deltaY;
      const width = this.originalWidth - deltaX;

      if (height > MINIMUM_SIZE) this.element.style.height = `${height}px`;
      if (width > MINIMUM_SIZE) {
        this.element.style.width = `${width}px`;
        this.element.style.left = `${this.originalX + deltaX}px`;
      }
    } else if (this.currentResizer.classList.contains('top-right')) {
      const width = this.originalWidth + deltaX;
      const height = this.originalHeight - deltaY;

      if (width > MINIMUM_SIZE) this.element.style.width = `${width}px`;
      if (height > MINIMUM_SIZE) {
        this.element.style.height = `${height}px`;
        this.element.style.top = `${this.originalY + deltaY}px`;
      }
    } else if (this.currentResizer.classList.contains('top-left')) {
      const width = this.originalWidth - deltaX;
      const height = this.originalHeight - deltaY;

      if (width > MINIMUM_SIZE) {
        this.element.style.width = `${width}px`;
        this.element.style.left = `${this.originalX + deltaX}px`;
      }
      if (height > MINIMUM_SIZE) {
        this.element.style.height = `${height}px`;
        this.element.style.top = `${this.originalY + deltaY}px`;
      }
    }
  };

  /* Cleans up global listeners and snapshots state for undo/redo */
  private stopResize = (): void => {
    window.removeEventListener('mousemove', this.resize);
    window.removeEventListener('mouseup', this.stopResize);
    this.currentResizer = null;

    /* Snapshot taken so undo/redo can roll back each resize step */
    Canvas.historyManager.captureState();
  };
}

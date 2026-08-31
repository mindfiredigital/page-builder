import { CanvasSharedState } from './CanvasSharedState';
import { CanvasEventDispatcher } from './CanvasEventDispatcher';

const MINIMUM_SIZE = 30;

const HANDLE_POSITIONS: Array<{ cls: string; cursor: string }> = [
  { cls: 'n', cursor: 'n-resize' },
  { cls: 'ne', cursor: 'ne-resize' },
  { cls: 'e', cursor: 'e-resize' },
  { cls: 'se', cursor: 'se-resize' },
  { cls: 's', cursor: 's-resize' },
  { cls: 'sw', cursor: 'sw-resize' },
  { cls: 'w', cursor: 'w-resize' },
  { cls: 'nw', cursor: 'nw-resize' },
];

/* 8-direction resize handler for canvas components in absolute layout mode */
export class CanvasResizeHandler {
  /* True while any resize gesture is active — checked by the ResizeObserver
     in CanvasComponentFactory to avoid clamping during user-driven resizes */
  static isResizing = false;

  private element: HTMLElement;
  private originalWidth = 0;
  private originalHeight = 0;
  private originalLeft = 0;
  private originalTop = 0;
  private originalMouseX = 0;
  private originalMouseY = 0;
  private currentHandle: string | null = null;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  /* Removes stale handles then creates fresh ones with live event listeners */
  static restore(element: HTMLElement): void {
    element.querySelector('.canvas-resizers')?.remove();
    new CanvasResizeHandler(element).addResizeHandles();
  }

  addResizeHandles(): void {
    const wrapper = document.createElement('div');
    wrapper.classList.add('canvas-resizers');
    wrapper.setAttribute('contenteditable', 'false');

    HANDLE_POSITIONS.forEach(({ cls, cursor }) => {
      const handle = document.createElement('div');
      handle.classList.add('canvas-resizer', cls);
      handle.style.cursor = cursor;
      handle.setAttribute('contenteditable', 'false');
      handle.setAttribute('draggable', 'false');

      handle.addEventListener('mousedown', (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        /* Disable HTML5 drag while resize is in progress */
        this.element.setAttribute('draggable', 'false');
        this.initResize(e, cls);
      });

      /* Prevent the browser's native drag gesture on the handle itself */
      handle.addEventListener('dragstart', (e: DragEvent) =>
        e.preventDefault()
      );

      wrapper.appendChild(handle);
    });

    this.element.appendChild(wrapper);
  }

  private initResize(e: MouseEvent, handleCls: string): void {
    CanvasResizeHandler.isResizing = true;
    this.currentHandle = handleCls;
    this.originalWidth = this.element.offsetWidth;
    this.originalHeight = this.element.offsetHeight;
    this.originalLeft = parseFloat(this.element.style.left) || 0;
    this.originalTop = parseFloat(this.element.style.top) || 0;
    this.originalMouseX = e.clientX;
    this.originalMouseY = e.clientY;

    window.addEventListener('mousemove', this.resize);
    window.addEventListener('mouseup', this.stopResize);
  }

  private resize = (e: MouseEvent): void => {
    if (!this.currentHandle) return;

    const dx = e.clientX - this.originalMouseX;
    const dy = e.clientY - this.originalMouseY;

    let w = this.originalWidth;
    let h = this.originalHeight;
    let l = this.originalLeft;
    let t = this.originalTop;

    switch (this.currentHandle) {
      case 'se':
        w += dx;
        h += dy;
        break;
      case 's':
        h += dy;
        break;
      case 'sw':
        w -= dx;
        l += dx;
        h += dy;
        break;
      case 'e':
        w += dx;
        break;
      case 'w':
        w -= dx;
        l += dx;
        break;
      case 'ne':
        w += dx;
        h -= dy;
        t += dy;
        break;
      case 'n':
        h -= dy;
        t += dy;
        break;
      case 'nw':
        w -= dx;
        l += dx;
        h -= dy;
        t += dy;
        break;
    }

    if (w >= MINIMUM_SIZE) {
      this.element.style.width = `${w}px`;
      this.element.style.minWidth = '0px';
      this.element.style.left = `${l}px`;
    }
    if (h >= MINIMUM_SIZE) {
      this.element.style.height = `${h}px`;
      this.element.style.minHeight = '0px';
      this.element.style.top = `${t}px`;
    }
  };

  private stopResize = (): void => {
    window.removeEventListener('mousemove', this.resize);
    window.removeEventListener('mouseup', this.stopResize);
    this.currentHandle = null;
    CanvasResizeHandler.isResizing = false;
    /* Re-enable HTML5 drag now that the resize gesture is done */
    this.element.setAttribute('draggable', 'true');
    CanvasSharedState.historyManager.captureState();
    CanvasEventDispatcher.dispatchDesignChange();
  };
}

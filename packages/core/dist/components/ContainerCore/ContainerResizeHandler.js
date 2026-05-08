import { Canvas } from '../../canvas/Canvas.js';
import { RESIZER_POSITIONS } from '../../constants/index.js';
import { MINIMUM_SIZE } from '../../constants/index.js';
/* Manages corner-handle resizing for a container element */
export class ContainerResizeHandler {
  constructor(element, resizersEl) {
    /* Snapshot values captured when a resize gesture begins */
    this.originalWidth = 0;
    this.originalHeight = 0;
    this.originalX = 0;
    this.originalY = 0;
    this.originalMouseX = 0;
    this.originalMouseY = 0;
    /* The corner handle currently being dragged */
    this.currentResizer = null;
    /* Recalculates dimensions based on which corner is being dragged */
    this.resize = e => {
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
    this.stopResize = () => {
      window.removeEventListener('mousemove', this.resize);
      window.removeEventListener('mouseup', this.stopResize);
      this.currentResizer = null;
      /* Snapshot taken so undo/redo can roll back each resize step */
      Canvas.historyManager.captureState();
    };
    this.element = element;
    this.resizersEl = resizersEl;
  }
  /* Appends four corner handles and binds mousedown on each */
  addResizeHandles() {
    RESIZER_POSITIONS.forEach(position => {
      const resizer = document.createElement('div');
      resizer.classList.add('resizer', position.class);
      /* Each handle starts a resize on mousedown */
      resizer.addEventListener('mousedown', e => this.initResize(e, resizer));
      this.resizersEl.appendChild(resizer);
    });
  }
  /* Captures baseline measurements and registers global move/up listeners */
  initResize(e, resizer) {
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
}

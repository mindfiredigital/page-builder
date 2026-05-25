import { CanvasSharedState } from './CanvasSharedState.js';
import { CanvasEventDispatcher } from './CanvasEventDispatcher.js';
/* Manages mouse-based drag-repositioning for absolute-positioned canvas components */
export class CanvasDragHandler {
  /* Attaches dragstart / dragend listeners that reposition the element on drop */
  static addDraggableListeners(element) {
    element.setAttribute('draggable', 'true');
    element.style.cursor = 'grab';
    let dragStartX = 0;
    let dragStartY = 0;
    let elementStartX = parseFloat(element.style.left) || 0;
    let elementStartY = parseFloat(element.style.top) || 0;
    let canvasScrollStartX = 0;
    let canvasScrollStartY = 0;
    element.addEventListener('dragstart', event => {
      event.stopPropagation();
      if (event.dataTransfer) {
        /* Snapshot positions at the moment the drag begins */
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        canvasScrollStartX = CanvasSharedState.canvasElement.scrollLeft;
        canvasScrollStartY = CanvasSharedState.canvasElement.scrollTop;
        /* Re-read element position in case it was moved programmatically */
        elementStartX = parseFloat(element.style.left) || 0;
        elementStartY = parseFloat(element.style.top) || 0;
        event.dataTransfer.effectAllowed = 'move';
        element.style.cursor = 'grabbing';
      }
    });
    element.addEventListener('dragend', event => {
      event.preventDefault();
      event.stopPropagation();
      const canvasEl = CanvasSharedState.canvasElement;
      /* Recalculate bounding rect at dragend (it may have shifted due to scroll) */
      const canvasRect = canvasEl.getBoundingClientRect();
      const canvasRectStart = canvasEl.getBoundingClientRect();
      /* Translate drag-start client coords into canvas-local coords */
      const dragStartMouseX =
        dragStartX - canvasRectStart.left + canvasScrollStartX;
      const dragStartMouseY =
        dragStartY - canvasRectStart.top + canvasScrollStartY;
      /* Preserve the sub-pixel offset between the cursor and the element's top-left */
      const offsetX = elementStartX - dragStartMouseX;
      const offsetY = elementStartY - dragStartMouseY;
      /* Current mouse position in canvas-local coords (accounts for scroll) */
      const actualMouseX =
        event.clientX - canvasRect.left + canvasEl.scrollLeft;
      const actualMouseY = event.clientY - canvasRect.top + canvasEl.scrollTop;
      let newX = actualMouseX + offsetX;
      let newY = actualMouseY + offsetY;
      /* --- Boundary clamping: printable (A4) mode vs free-form canvas --- */
      if (
        CanvasSharedState.layoutMode === 'absolute' &&
        canvasEl.classList.contains('preview-printable')
      ) {
        const style = window.getComputedStyle(canvasEl);
        const paddingRight = parseFloat(style.paddingRight);
        const paddingLeft = parseFloat(style.paddingLeft);
        const paddingTop = parseFloat(style.paddingTop);
        const elementWidth = element.offsetWidth;
        /* Left boundary — can't drag past the left margin */
        newX = Math.max(newX, paddingLeft);
        /* Right boundary — element must stay within the content column */
        const innerContentRightX =
          canvasEl.offsetWidth - paddingRight - elementWidth;
        newX = Math.min(newX, innerContentRightX);
        /* Top boundary — can't drag above the top margin */
        newY = Math.max(newY, paddingTop);
        /* No bottom constraint — canvas grows via scrollHeight */
      } else {
        /* General mode: clamp to canvas scroll dimensions */
        const elementRect = element.getBoundingClientRect();
        const maxX = canvasEl.scrollWidth - elementRect.width;
        const maxY = canvasEl.scrollHeight - elementRect.height;
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
      }
      element.style.left = `${newX}px`;
      element.style.top = `${newY}px`;
      element.style.cursor = 'grab';
      CanvasSharedState.updateCanvasScrollSpace();
      CanvasSharedState.historyManager.captureState();
      CanvasEventDispatcher.dispatchDesignChange();
    });
  }
}

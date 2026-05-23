export class GridManager {
  constructor(cellSize = 20) {
    this.currentLayoutMode = 'absolute';
    this.cellSize = cellSize;
  }
  initializeDropPreview(canvasElement, layoutMode = 'absolute') {
    var _a;
    this.currentLayoutMode = layoutMode;
    (_a = canvasElement.querySelector('.drop-preview')) === null ||
    _a === void 0
      ? void 0
      : _a.remove();
    if (layoutMode === 'absolute') {
      const dropPreview = document.createElement('div');
      dropPreview.className = 'drop-preview';
      canvasElement.appendChild(dropPreview);
      canvasElement.addEventListener('dragover', event => {
        event.preventDefault();
        this.showGridCornerHighlight(event, dropPreview, canvasElement);
      });
      canvasElement.addEventListener('dragleave', event => {
        if (!canvasElement.contains(event.relatedTarget)) {
          dropPreview.classList.remove('visible');
        }
      });
    } else {
      /* Grid mode: show a horizontal insert-indicator line instead of the
               grid-corner dot. Suppress the indicator when the cursor is inside a
               container (containers manage their own drop UX). */
      canvasElement.addEventListener('dragover', event => {
        var _a;
        event.preventDefault();
        const target = event.target;
        if (target.closest('.container-component')) {
          (_a = canvasElement.querySelector('.drop-insert-indicator')) ===
            null || _a === void 0
            ? void 0
            : _a.remove();
          return;
        }
        this.updateInsertIndicator(event, canvasElement);
      });
      canvasElement.addEventListener('dragleave', event => {
        var _a;
        if (!canvasElement.contains(event.relatedTarget)) {
          (_a = canvasElement.querySelector('.drop-insert-indicator')) ===
            null || _a === void 0
            ? void 0
            : _a.remove();
        }
      });
    }
  }
  /**
   * Returns the first top-level canvas component whose vertical midpoint is
   * BELOW the cursor — i.e. "insert before this element".  Returns null to
   * mean "append at the end".
   */
  findInsertionPoint(event, canvasElement) {
    const children = Array.from(
      canvasElement.querySelectorAll(':scope > .editable-component')
    );
    for (const child of children) {
      const rect = child.getBoundingClientRect();
      if (event.clientY < rect.top + rect.height / 2) {
        return child;
      }
    }
    return null;
  }
  updateInsertIndicator(event, canvasElement) {
    var _a;
    const insertBefore = this.findInsertionPoint(event, canvasElement);
    (_a = canvasElement.querySelector('.drop-insert-indicator')) === null ||
    _a === void 0
      ? void 0
      : _a.remove();
    const indicator = document.createElement('div');
    indicator.className = 'drop-insert-indicator';
    if (insertBefore) {
      canvasElement.insertBefore(indicator, insertBefore);
    } else {
      canvasElement.appendChild(indicator);
    }
  }
  showGridCornerHighlight(event, dropPreview, canvasElement) {
    const gridCellSize = 20;
    const { gridX, gridY } = this.mousePositionAtGridCorner(
      event,
      canvasElement
    );
    dropPreview.style.left = `${gridX}px`;
    dropPreview.style.top = `${gridY}px`;
    dropPreview.style.width = `${gridCellSize}px`;
    dropPreview.style.height = `${gridCellSize}px`;
    dropPreview.classList.add('visible');
  }
  mousePositionAtGridCorner(event, canvas) {
    const canvasRect = canvas.getBoundingClientRect();
    const scrollLeft = canvas.scrollLeft;
    const scrollTop = canvas.scrollTop;
    const mouseX = event.clientX - canvasRect.left + scrollLeft;
    const mouseY = event.clientY - canvasRect.top + scrollTop;
    const gridSize = 10;
    const gridX = Math.round(mouseX / gridSize) * gridSize;
    const gridY = Math.round(mouseY / gridSize) * gridSize;
    const padding = 20;
    return {
      gridX: Math.max(padding, gridX - padding),
      gridY: Math.max(padding, gridY - padding),
    };
  }
  getCellSize() {
    return this.cellSize;
  }
}

export class GridManager {
    constructor(cellSize = 20) {
        this.currentLayoutMode = 'absolute';
        this.cellSize = cellSize;
    }
    initializeDropPreview(canvasElement, layoutMode = 'absolute') {
        var _a;
        this.currentLayoutMode = layoutMode;
        (_a = canvasElement.querySelector('.drop-preview')) === null || _a === void 0 ? void 0 : _a.remove();
        if (layoutMode === 'absolute') {
            canvasElement.addEventListener('dragover', (event) => {
                event.preventDefault();
            });
        }
        else {
            /* Grid mode: show a horizontal insert-indicator line instead of the
               grid-corner dot. Suppress the indicator when the cursor is inside a
               container (containers manage their own drop UX). */
            canvasElement.addEventListener('dragover', (event) => {
                var _a;
                event.preventDefault();
                const target = event.target;
                if (target.closest('.container-component')) {
                    (_a = canvasElement.querySelector('.drop-insert-indicator')) === null || _a === void 0 ? void 0 : _a.remove();
                    return;
                }
                this.updateInsertIndicator(event, canvasElement);
            });
            canvasElement.addEventListener('dragleave', (event) => {
                var _a;
                if (!canvasElement.contains(event.relatedTarget)) {
                    (_a = canvasElement.querySelector('.drop-insert-indicator')) === null || _a === void 0 ? void 0 : _a.remove();
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
        const children = Array.from(canvasElement.querySelectorAll(':scope > .editable-component'));
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
        (_a = canvasElement.querySelector('.drop-insert-indicator')) === null || _a === void 0 ? void 0 : _a.remove();
        const insertBefore = this.findInsertionPoint(event, canvasElement);
        const indicator = document.createElement('div');
        indicator.className = 'drop-insert-indicator';
        if (insertBefore) {
            canvasElement.insertBefore(indicator, insertBefore);
        }
        else {
            const spacer = canvasElement.querySelector('#canvas-scroll-spacer');
            if (spacer) {
                canvasElement.insertBefore(indicator, spacer);
            }
            else {
                canvasElement.appendChild(indicator);
            }
        }
    }
    showGridCornerHighlight(event, dropPreview, canvasElement) {
        const gridCellSize = 20;
        const { gridX, gridY } = this.mousePositionAtGridCorner(event, canvasElement);
        dropPreview.style.left = `${gridX}px`;
        dropPreview.style.top = `${gridY}px`;
        dropPreview.style.width = `${gridCellSize}px`;
        dropPreview.style.height = `${gridCellSize}px`;
        dropPreview.classList.add('visible');
    }
    mousePositionAtGridCorner(event, canvas) {
        const canvasRect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - canvasRect.left + canvas.scrollLeft;
        const mouseY = event.clientY - canvasRect.top + canvas.scrollTop;
        return {
            gridX: Math.round(mouseX),
            gridY: Math.round(mouseY),
        };
    }
    getCellSize() {
        return this.cellSize;
    }
}

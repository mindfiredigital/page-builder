export class GridManager {
  private cellSize: number;
  private currentLayoutMode: LayoutMode = 'absolute';

  constructor(cellSize: number = 20) {
    this.cellSize = cellSize;
  }

  initializeDropPreview(
    canvasElement: HTMLElement,
    layoutMode: LayoutMode = 'absolute'
  ): void {
    this.currentLayoutMode = layoutMode;

    canvasElement.querySelector('.drop-preview')?.remove();

    if (layoutMode === 'absolute') {
      canvasElement.addEventListener('dragover', (event: Event) => {
        event.preventDefault();
      });
    } else {
      /* Grid mode: show a horizontal insert-indicator line instead of the
         grid-corner dot. Suppress the indicator when the cursor is inside a
         container (containers manage their own drop UX). */
      canvasElement.addEventListener('dragover', (event: Event) => {
        event.preventDefault();
        const target = (event as DragEvent).target as HTMLElement;
        if (target.closest('.container-component')) {
          canvasElement.querySelector('.drop-insert-indicator')?.remove();
          return;
        }
        this.updateInsertIndicator(event as DragEvent, canvasElement);
      });

      canvasElement.addEventListener('dragleave', (event: Event) => {
        if (
          !canvasElement.contains((event as DragEvent).relatedTarget as Node)
        ) {
          canvasElement.querySelector('.drop-insert-indicator')?.remove();
        }
      });
    }
  }

  /**
   * Returns the first top-level canvas component whose vertical midpoint is
   * BELOW the cursor — i.e. "insert before this element".  Returns null to
   * mean "append at the end".
   */
  findInsertionPoint(
    event: DragEvent,
    canvasElement: HTMLElement
  ): HTMLElement | null {
    const children = Array.from(
      canvasElement.querySelectorAll<HTMLElement>(
        ':scope > .editable-component'
      )
    );

    for (const child of children) {
      const rect = child.getBoundingClientRect();
      if (event.clientY < rect.top + rect.height / 2) {
        return child;
      }
    }
    return null;
  }

  private updateInsertIndicator(
    event: DragEvent,
    canvasElement: HTMLElement
  ): void {
    canvasElement.querySelector('.drop-insert-indicator')?.remove();
    const insertBefore = this.findInsertionPoint(event, canvasElement);

    const indicator = document.createElement('div');
    indicator.className = 'drop-insert-indicator';

    if (insertBefore) {
      canvasElement.insertBefore(indicator, insertBefore);
    } else {
      const spacer = canvasElement.querySelector('#canvas-scroll-spacer');
      if (spacer) {
        canvasElement.insertBefore(indicator, spacer);
      } else {
        canvasElement.appendChild(indicator);
      }
    }
  }

  showGridCornerHighlight(
    event: DragEvent,
    dropPreview: HTMLElement,
    canvasElement: HTMLElement
  ): void {
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

  mousePositionAtGridCorner(
    event: DragEvent,
    canvas: HTMLElement
  ): { gridX: number; gridY: number } {
    const canvasRect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - canvasRect.left + canvas.scrollLeft;
    const mouseY = event.clientY - canvasRect.top + canvas.scrollTop;

    return {
      gridX: Math.round(mouseX),
      gridY: Math.round(mouseY),
    };
  }

  getCellSize(): number {
    return this.cellSize;
  }
}

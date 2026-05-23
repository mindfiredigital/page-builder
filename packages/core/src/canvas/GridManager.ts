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
      const dropPreview = document.createElement('div');
      dropPreview.className = 'drop-preview';
      canvasElement.appendChild(dropPreview);

      canvasElement.addEventListener('dragover', (event: Event) => {
        event.preventDefault();
        this.showGridCornerHighlight(
          event as DragEvent,
          dropPreview,
          canvasElement
        );
      });

      canvasElement.addEventListener('dragleave', (event: Event) => {
        if (
          !canvasElement.contains((event as DragEvent).relatedTarget as Node)
        ) {
          dropPreview.classList.remove('visible');
        }
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
    const insertBefore = this.findInsertionPoint(event, canvasElement);
    canvasElement.querySelector('.drop-insert-indicator')?.remove();

    const indicator = document.createElement('div');
    indicator.className = 'drop-insert-indicator';

    if (insertBefore) {
      canvasElement.insertBefore(indicator, insertBefore);
    } else {
      canvasElement.appendChild(indicator);
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

  getCellSize(): number {
    return this.cellSize;
  }
}

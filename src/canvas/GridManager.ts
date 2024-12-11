export class GridManager {
  private cellSize: number;

  constructor(cellSize: number = 20) {
    this.cellSize = cellSize;
  }
  /*
   * Initializes the "drop-preview" element for the canvas.
   * Ensures drag-and-drop functionality works correctly after canvas is restored.
   */
  initializeDropPreview(canvasElement: HTMLElement) {
    // Remove existing drop-preview if present
    const existingDropPreview = canvasElement.querySelector('.drop-preview');
    if (existingDropPreview) {
      existingDropPreview.remove();
    }

    // Create and append a new drop-preview element
    const dropPreview = document.createElement('div');
    dropPreview.className = 'drop-preview';
    canvasElement.appendChild(dropPreview);

    // Attach dragover event to show grid corner highlight
    canvasElement.addEventListener('dragover', event => {
      event.preventDefault();
      this.showGridCornerHighlight(event, dropPreview, canvasElement);
    });

    // Attach dragleave event to hide the preview
    canvasElement.addEventListener('dragleave', () => {
      dropPreview.classList.remove('visible'); // Hide preview on drag leave
    });
  }

  showGridCornerHighlight(
    event: DragEvent,
    dropPreview: HTMLElement,
    canvasElement: HTMLElement
  ) {
    const gridCellSize = 20;
    const { gridX, gridY } = this.mousePositionAtGridCorner(
      event,
      canvasElement
    );

    // Update preview position and visibility
    dropPreview.style.left = `${gridX}px`;
    dropPreview.style.top = `${gridY}px`;
    dropPreview.style.width = `${gridCellSize}px`;
    dropPreview.style.height = `${gridCellSize}px`;
    dropPreview.classList.add('visible');
  }

  mousePositionAtGridCorner(event: DragEvent, canvasElement: HTMLElement): any {
    const gridCellSize = 20; // Size of each grid cell
    const canvasRect = canvasElement.getBoundingClientRect();

    // Calculate mouse position relative to canvas
    const mouseX = event.clientX - canvasRect.left;
    const mouseY = event.clientY - canvasRect.top;

    // Snap mouse position to the nearest grid corner
    const gridX = Math.floor(mouseX / gridCellSize) * gridCellSize;
    const gridY = Math.floor(mouseY / gridCellSize) * gridCellSize;

    return { gridX, gridY };
  }

  getCellSize(): number {
    return this.cellSize;
  }
}

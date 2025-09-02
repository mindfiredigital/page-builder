export class GridManager {
  private cellSize: number;

  /**
   * Constructor for GridManager.
   * @param cellSize - The size of each grid cell, default is 20px.
   * Used to define the snapping behavior for grid-based alignment.
   */
  constructor(cellSize: number = 20) {
    this.cellSize = cellSize;
  }

  /**
   * Initializes the drop-preview element for the canvas.
   * Ensures there is only one drop-preview element at a time.
   * Sets up drag-and-drop event listeners for positioning previews.
   * Updates the visual grid alignment for drag-over operations.
   * Called during initialization or restoration of the canvas.
   */
  initializeDropPreview(canvasElement: HTMLElement) {
    const existingDropPreview = canvasElement.querySelector('.drop-preview');
    if (existingDropPreview) {
      existingDropPreview.remove();
    }

    const dropPreview = document.createElement('div');
    dropPreview.className = 'drop-preview';
    canvasElement.appendChild(dropPreview);

    canvasElement.addEventListener('dragover', event => {
      event.preventDefault();
      this.showGridCornerHighlight(event, dropPreview, canvasElement);
    });

    canvasElement.addEventListener('dragleave', () => {
      dropPreview.classList.remove('visible');
    });
  }

  /**
   * Updates the position of the drop-preview to align with the grid.
   * Calculates the nearest grid corner based on mouse position.
   * Ensures the drop-preview element reflects the correct alignment.
   * Enhances drag-and-drop UX by snapping the preview to the grid.
   * Called on every drag-over event over the canvas element.
   */
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

    dropPreview.style.left = `${gridX}px`;
    dropPreview.style.top = `${gridY}px`;
    dropPreview.style.width = `${gridCellSize}px`;
    dropPreview.style.height = `${gridCellSize}px`;
    dropPreview.classList.add('visible');
  }

  /**
   * Calculates the nearest grid corner position based on mouse coordinates.
   * Determines the mouse position relative to the canvas element.
   * Snaps the mouse position to the closest grid corner for alignment.
   * Supports grid-based snapping behavior during drag-and-drop.
   * Returns an object containing the grid-aligned X and Y coordinates.
   */
  mousePositionAtGridCorner(event: DragEvent, canvas: HTMLElement) {
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

  /**
   * Retrieves the size of each grid cell.
   * Provides a way to access the configured grid size for alignment.
   * Useful for other components needing grid cell dimensions.
   * Returns the current cell size set during initialization.
   * The default value is 20px unless overridden in the constructor.
   */
  getCellSize(): number {
    return this.cellSize;
  }
}

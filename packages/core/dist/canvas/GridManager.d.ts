export declare class GridManager {
  private cellSize;
  /**
   * Constructor for GridManager.
   * @param cellSize - The size of each grid cell, default is 20px.
   * Used to define the snapping behavior for grid-based alignment.
   */
  constructor(cellSize?: number);
  /**
   * Initializes the drop-preview element for the canvas.
   * Ensures there is only one drop-preview element at a time.
   * Sets up drag-and-drop event listeners for positioning previews.
   * Updates the visual grid alignment for drag-over operations.
   * Called during initialization or restoration of the canvas.
   */
  initializeDropPreview(canvasElement: HTMLElement): void;
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
  ): void;
  /**
   * Calculates the nearest grid corner position based on mouse coordinates.
   * Determines the mouse position relative to the canvas element.
   * Snaps the mouse position to the closest grid corner for alignment.
   * Supports grid-based snapping behavior during drag-and-drop.
   * Returns an object containing the grid-aligned X and Y coordinates.
   */
  mousePositionAtGridCorner(
    event: DragEvent,
    canvas: HTMLElement
  ): {
    gridX: number;
    gridY: number;
  };
  /**
   * Retrieves the size of each grid cell.
   * Provides a way to access the configured grid size for alignment.
   * Useful for other components needing grid cell dimensions.
   * Returns the current cell size set during initialization.
   * The default value is 20px unless overridden in the constructor.
   */
  getCellSize(): number;
}

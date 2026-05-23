export declare class GridManager {
  private cellSize;
  private currentLayoutMode;
  constructor(cellSize?: number);
  initializeDropPreview(
    canvasElement: HTMLElement,
    layoutMode?: LayoutMode
  ): void;
  /**
   * Returns the first top-level canvas component whose vertical midpoint is
   * BELOW the cursor — i.e. "insert before this element".  Returns null to
   * mean "append at the end".
   */
  findInsertionPoint(
    event: DragEvent,
    canvasElement: HTMLElement
  ): HTMLElement | null;
  private updateInsertIndicator;
  showGridCornerHighlight(
    event: DragEvent,
    dropPreview: HTMLElement,
    canvasElement: HTMLElement
  ): void;
  mousePositionAtGridCorner(
    event: DragEvent,
    canvas: HTMLElement
  ): {
    gridX: number;
    gridY: number;
  };
  getCellSize(): number;
}

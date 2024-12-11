export declare class GridManager {
  private cellSize;
  constructor(cellSize?: number);
  initializeDropPreview(canvasElement: HTMLElement): void;
  showGridCornerHighlight(
    event: DragEvent,
    dropPreview: HTMLElement,
    canvasElement: HTMLElement
  ): void;
  mousePositionAtGridCorner(event: DragEvent, canvasElement: HTMLElement): any;
  getCellSize(): number;
}

export declare class GridManager {
  private canvas;
  private gridSize;
  private isEnabled;
  private overlay;
  constructor(canvas: HTMLElement);
  private createGridOverlay;
  setGridSize(size: number): void;
  enable(): void;
  disable(): void;
  toggle(): void;
  snapToGrid(
    x: number,
    y: number
  ): {
    x: number;
    y: number;
  };
  destroy(): void;
}

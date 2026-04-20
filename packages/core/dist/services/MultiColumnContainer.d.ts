export declare class MultiColumnContainer {
  protected element: HTMLElement;
  protected columnCount: number;
  constructor(columnCount: number, className?: string);
  private createColumn;
  private initializeEventListeners;
  protected onDrop(event: DragEvent): void;
  private addStyles;
  create(): HTMLElement;
  static restoreColumn(column: HTMLElement): void;
}

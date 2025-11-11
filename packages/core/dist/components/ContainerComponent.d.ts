export declare class ContainerComponent {
  private element;
  private resizers;
  private readonly MINIMUM_SIZE;
  private originalWidth;
  private originalHeight;
  private originalX;
  private originalY;
  private originalMouseX;
  private originalMouseY;
  private currentResizer;
  constructor();
  private addResizeHandles;
  private initResize;
  private resize;
  /**
   * On mouse up event the resizing stops and captures the state
   * Which will help keep tracking of state for undo/redo purpose
   */
  private stopResize;
  private initializeEventListeners;
  private onDragStart;
  private onDrop;
  private showLabel;
  private hideLabel;
  private onMouseOver;
  private onMouseLeave;
  private addStyles;
  create(): HTMLElement;
  private static restoreResizer;
  static restoreContainer(
    container: HTMLElement,
    editable?: boolean | null
  ): void;
}

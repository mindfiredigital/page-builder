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
  private stopResize;
  private initializeEventListeners;
  private onDrop;
  private showLabel;
  private hideLabel;
  private onHover;
  private onBlur;
  private addStyles;
  create(): HTMLElement;
  static restoreResizer(element: HTMLElement): void;
}

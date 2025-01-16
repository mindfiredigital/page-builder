export declare class ButtonComponent {
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
  private onMouseOver;
  private onMouseLeave;
  private addStyles;
  create(): HTMLElement;
}

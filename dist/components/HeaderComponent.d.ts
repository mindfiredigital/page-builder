export declare class HeaderComponent {
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
  constructor(level?: number, text?: string);
  private addResizeHandles;
  private initResize;
  private resize;
  private stopResize;
  private addStyles;
  private initializeEventListeners;
  create(): HTMLElement;
}

export declare class TextComponent {
  private text;
  private readonly MINIMUM_SIZE;
  private element;
  private resizers;
  private originalWidth;
  private originalHeight;
  private originalX;
  private originalY;
  private originalMouseX;
  private originalMouseY;
  private currentResizer;
  constructor(text?: string);
  private addResizeHandles;
  private initResize;
  private resize;
  private stopResize;
  private initializeEventListeners;
  private onMouseOver;
  private onMouseLeave;
  private addStyles;
  create(): HTMLElement;
  setText(newText: string): void;
}

export declare class Canvas {
  private components;
  private canvasElement;
  private sidebarElement;
  private static componentFactory;
  constructor();
  init(): void;
  onDrop(event: DragEvent): void;
  static createComponent(type: string): HTMLElement | null;
  exportLayout(): {
    type: string;
    content: string;
  }[];
}

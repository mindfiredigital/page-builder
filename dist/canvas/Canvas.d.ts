export declare class Canvas {
  private components;
  private canvasElement;
  private sidebarElement;
  private componentCounters;
  private static componentFactory;
  constructor();
  init(): void;
  onDrop(event: DragEvent): void;
  static createComponent(type: string): HTMLElement | null;
  generateUniqueClass(type: string): string;
  exportLayout(): {
    type: string;
    content: string;
  }[];
}

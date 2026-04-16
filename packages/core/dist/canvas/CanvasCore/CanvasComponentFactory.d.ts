export declare class CanvasComponentFactory {
  private static get factoryMap();
  static createComponent(
    type: string,
    customSettings?: string | null,
    props?: string
  ): HTMLElement | null;
  static generateUniqueClass(
    type: string,
    isContainerComponent?: boolean,
    containerClass?: string | null
  ): string;
}

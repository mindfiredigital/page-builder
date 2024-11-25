export declare class CustomizationSidebar {
  private static sidebarElement;
  private static controlsContainer;
  private static componentNameHeader;
  private static closeButton;
  static init(): void;
  static showSidebar(componentId: string): void;
  static hideSidebar(): void;
  static rgbToHex(rgb: string): string;
  private static createControl;
  private static createSelectControl;
  private static addListeners;
}

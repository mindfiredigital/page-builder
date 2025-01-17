import LayersViewController from './LayerViewController';
export declare class CustomizationSidebar {
  private static sidebarElement;
  private static controlsContainer;
  private static componentNameHeader;
  private static closeButton;
  private static layersModeToggle;
  private static layersView;
  private static layersViewController;
  static init(): void;
  private static switchToCustomizeMode;
  private static switchToLayersMode;
  static updateLayersView(): void;
  static showSidebar(componentId: string): void;
  static hideSidebar(): void;
  static rgbToHex(rgb: string): string;
  private static createControl;
  private static createSelectControl;
  private static addListeners;
  static getLayersViewController(): LayersViewController;
}

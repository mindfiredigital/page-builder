import LayersViewController from './LayerViewController';
export declare class CustomizationSidebar {
  private static sidebarElement;
  private static controlsContainer;
  private static componentNameHeader;
  private static closeButton;
  private static layersModeToggle;
  private static layersView;
  private static layersViewController;
  private static expandConfiguration;
  private static functionsPanel;
  private static selectedComponent;
  static init(): void;
  private static switchToCustomizeMode;
  private static switchToLayersMode;
  static showSidebar(componentId: string): void;
  static hideSidebar(): void;
  private static populateCssControls;
  private static populateFunctionalityControls;
  static rgbToHex(rgb: string): string;
  private static createControl;
  private static createSelectControl;
  private static addListeners;
  static getLayersViewController(): LayersViewController;
}

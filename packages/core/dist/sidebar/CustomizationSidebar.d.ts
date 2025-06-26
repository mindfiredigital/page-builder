import LayersViewController from './LayerViewController';
export declare class CustomizationSidebar {
  private static sidebarElement;
  private static controlsContainer;
  private static componentNameHeader;
  private static closeButton;
  private static layersModeToggle;
  private static layersView;
  private static layersViewController;
  private static functionsPanel;
  private static selectedComponent;
  private static settingsReactRoot;
  static init(): void;
  private static switchToCustomizeMode;
  private static switchToAttributeMode;
  private static switchToLayersMode;
  static showSidebar(componentId: string): void;
  static hideSidebar(): void;
  private static populateCssControls;
  private static populateFunctionalityControls;
  /**
   * Unmounts the currently rendered React settings component to prevent memory leaks.
   */
  private static unmountSettingsComponent;
  static rgbToHex(rgb: string): string;
  private static createControl;
  private static createSelectControl;
  private static addListeners;
  static getLayersViewController(): LayersViewController;
}

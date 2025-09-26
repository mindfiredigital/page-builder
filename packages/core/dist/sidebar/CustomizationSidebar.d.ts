import LayersViewController from './LayerViewController';
export declare class CustomizationSidebar {
  private static sidebarElement;
  private static controlsContainer;
  private static componentNameHeader;
  private static layersModeToggle;
  private static layersView;
  private static layersViewController;
  private static functionsPanel;
  private static selectedComponent;
  private static customComponentsConfig;
  private static basicComponentsConfig;
  private static showAttributeTab;
  private static editable;
  static init(
    customComponentsConfig: CustomComponentConfig,
    editable: boolean | null,
    BasicComponent: BasicComponent[],
    showAttributeTab?: boolean
  ): void;
  private static switchToCustomizeMode;
  private static switchToAttributeMode;
  private static switchToLayersMode;
  static showSidebar(componentId: string): void;
  private static populateCssControls;
  private static handleInputTrigger;
  private static ShoModal;
  private static populateFunctionalityControls;
  private static addListeners;
  static getLayersViewController(): LayersViewController;
}

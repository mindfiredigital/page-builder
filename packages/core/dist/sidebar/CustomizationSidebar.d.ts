import LayersViewController from './LayerViewController';
type ReactComponentType<P = {}> = React.ComponentType<P>;
interface CustomComponentConfig {
  [key: string]: {
    component: string;
    svg?: string;
    title?: string;
    settingsComponent?: ReactComponentType<{
      targetComponentId: string;
    }>;
    settingsComponentTagName?: string;
    props?: Record<string, any>;
  };
}
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
  private static editable;
  static init(
    customComponentsConfig: CustomComponentConfig,
    editable: boolean | null,
    BasicComponent: BasicComponent
  ): void;
  private static switchToCustomizeMode;
  private static switchToAttributeMode;
  private static switchToLayersMode;
  static showSidebar(componentId: string): void;
  private static populateCssControls;
  private static populateFunctionalityControls;
  static rgbToHex(rgb: string): string;
  private static createControl;
  private static createSelectControl;
  private static addListeners;
  static getLayersViewController(): LayersViewController;
}
export {};

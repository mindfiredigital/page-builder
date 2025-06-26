import LayersViewController from './LayerViewController';
import * as React from 'react';
type ReactComponentType<P = {}> = React.ComponentType<P>;
interface CustomComponentConfig {
  [key: string]: {
    component: string;
    svg?: string;
    title?: string;
    settingsComponent?: ReactComponentType<{
      targetComponentId: string;
    }>;
    props?: Record<string, any>;
  };
}
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
  private static customComponentsConfig;
  static init(customComponentsConfig: CustomComponentConfig): void;
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
export {};

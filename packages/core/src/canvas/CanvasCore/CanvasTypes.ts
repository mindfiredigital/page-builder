/* Shared type declarations used across Canvas modules */

export type LayoutMode = 'grid' | 'absolute';

export interface CanvasState {
  components: HTMLElement[];
  canvasElement: HTMLElement;
  sidebarElement: HTMLElement;
  editable: boolean | null;
  layoutMode: LayoutMode;
  lastCanvasWidth: number | null;
}

/* Attribute config types for component factories */
export interface ComponentFactoryConfig {
  tableAttributeConfig?: ComponentAttribute[];
  textAttributeConfig?: ComponentAttribute[];
  headerAttributeConfig?: ComponentAttribute[];
  ImageAttributeConfig?: Function;
}

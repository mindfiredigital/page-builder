export interface TabManagerState {
  sidebarElement: HTMLElement;
  componentNameHeader: HTMLElement;
  controlsContainer: HTMLElement;
  functionsPanel: HTMLDivElement;
  layersView: HTMLDivElement;
  editable: boolean | null;
  showAttributeTab?: boolean;
  onCustomizeTab: () => void;
  onAttributeTab: () => void;
}
export declare function buildTabToggle(state: TabManagerState): HTMLDivElement;
export declare function switchToCustomizeMode(
  controlsContainer: HTMLElement,
  functionsPanel: HTMLElement,
  componentName: HTMLElement
): void;
export declare function switchToAttributeMode(
  controlsContainer: HTMLElement,
  functionsPanel: HTMLElement,
  componentName: HTMLElement
): void;
export declare function switchToLayersMode(): void;

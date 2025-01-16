declare class LayersViewController {
  private static layersView;
  private static canvasRoot;
  private static draggedItem;
  constructor(layersViewSelector?: string, canvasRootSelector?: string);
  /**
   * Initialize layers view and canvas root elements
   */
  private initializeElements;
  /**
   * Recursive function to build layer hierarchy from DOM
   */
  private static buildLayerHierarchyFromDOM;
  /**
   * Render the layers view with nested structure
   */
  static updateLayersView(): void;
  /**
   * Render layer items recursively
   */
  private static renderLayerItems;
  /**
   * Create a layer item element with advanced interactions
   */
  private static createLayerItemElement;
  /**
   * Toggle layer visibility
   */
  private static toggleLayerVisibility;
  /**
   * Toggle layer lock state
   */
  private static toggleLayerLock;
  /**
   * Select and customize a specific layer
   */
  private static selectLayer;
  /**
   * Drag and drop handling methods
   */
  private static handleDragStart;
  private static handleDragOver;
  private static handleDrop;
  /**
   * Switch to layer customization mode
   */
  private static switchToCustomizeMode;
  /**
   * Load layer-specific properties into the sidebar
   */
  private static loadLayerProperties;
}
export default LayersViewController;

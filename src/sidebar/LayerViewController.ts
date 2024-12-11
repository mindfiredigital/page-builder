import { Canvas } from '../canvas/Canvas'; // Assuming a Canvas management class
import { HTMLGenerator } from '../services/HTMLGenerator';

interface LayerItem {
  id: string;
  type: string;
  children?: LayerItem[];
  isVisible?: boolean;
  isLocked?: boolean;
  depth?: number;
}

class LayersViewController {
  private static layersView: HTMLElement | null = null;
  private static canvasRoot: HTMLElement | null = null;
  private static draggedItem: HTMLElement | null = null;

  constructor(
    layersViewSelector: string = '#layers-view',
    canvasRootSelector: string = '#home'
  ) {
    // Ensure elements exist before assignment
    this.initializeElements(layersViewSelector, canvasRootSelector);
  }

  /**
   * Initialize layers view and canvas root elements
   */
  private initializeElements(
    layersViewSelector: string,
    canvasRootSelector: string
  ) {
    // Try to find layers view
    LayersViewController.layersView =
      document.querySelector(layersViewSelector);
    if (!LayersViewController.layersView) {
      // Create layers view if it doesn't exist
      LayersViewController.layersView = document.createElement('div');
      LayersViewController.layersView.id = 'layers-view';
      LayersViewController.layersView.className = 'layers-view';

      // Optional: Add the layers view to the document
      // You might want to append this to a specific container
      document.body.appendChild(LayersViewController.layersView);

      console.warn(`Layers view element created: ${layersViewSelector}`);
    }

    // Try to find canvas root
    LayersViewController.canvasRoot =
      document.querySelector(canvasRootSelector);
    if (!LayersViewController.canvasRoot) {
      console.error(`Canvas root element not found: ${canvasRootSelector}`);
      // Fallback to body if no specific root is found
      LayersViewController.canvasRoot = document.body;
    }
  }

  /**
   * Recursive function to build layer hierarchy from DOM
   */
  private static buildLayerHierarchyFromDOM(
    rootElement: HTMLElement
  ): LayerItem[] {
    const htmlGenerator = new HTMLGenerator(new Canvas());
    const generatedHTML = htmlGenerator.generateHTML();

    // Parse the generated HTML into a DOM tree
    const parser = new DOMParser();
    const doc = parser.parseFromString(generatedHTML, 'text/html');

    // Recursively traverse the DOM to build LayerItem hierarchy
    const traverseDom = (element: Element, depth: number = 0): LayerItem => {
      const htmlElement = element as HTMLElement; // Assert the element is an HTMLElement

      const layer: LayerItem = {
        id:
          htmlElement.id || `layer-${Math.random().toString(36).substr(2, 9)}`, // Assign unique ID if missing
        type: htmlElement.tagName.toLowerCase(),
        isVisible: htmlElement.style?.display !== 'none', // Check visibility only for HTMLElements
        isLocked: htmlElement.getAttribute('data-locked') === 'true',
        depth,
        children: [],
      };

      Array.from(element.children).forEach(child => {
        const childLayer = traverseDom(child, depth + 1);
        layer.children!.push(childLayer);
      });

      return layer;
    };

    const rootElements = Array.from(doc.body.children);
    return rootElements.map(element => traverseDom(element));
  }

  /**
   * Render the layers view with nested structure
   */
  public static updateLayersView() {
    if (!this.layersView || !this.canvasRoot) {
      console.error('Layers view or canvas root not initialized');
      return;
    }

    // Clear existing layers
    this.layersView.innerHTML = '';

    // Build hierarchy from DOM
    const hierarchy = this.buildLayerHierarchyFromDOM(this.canvasRoot);

    // Create layers list
    const layersList = document.createElement('ul');
    layersList.className = 'layers-list';

    // Render layer items
    this.renderLayerItems(layersList, hierarchy);

    // Append to layers view
    this.layersView.appendChild(layersList);
  }

  /**
   * Render layer items recursively
   */
  private static renderLayerItems(
    parentElement: HTMLElement,
    layers: LayerItem[],
    depth: number = 0
  ) {
    layers.forEach(layer => {
      const layerItem = this.createLayerItemElement(layer, depth);

      // Handle nested children
      if (layer.children && layer.children.length > 0) {
        const expandToggle = document.createElement('span');
        expandToggle.className = 'layer-expand-toggle';
        expandToggle.textContent = '▶';

        const childrenContainer = document.createElement('ul');
        childrenContainer.className = 'layer-children';

        // Recursive rendering of children
        this.renderLayerItems(childrenContainer, layer.children, depth + 1);

        // Toggle expand/collapse
        expandToggle.addEventListener('click', () => {
          const isExpanded = childrenContainer.classList.toggle('expanded');
          expandToggle.textContent = isExpanded ? '▼' : '▶';
        });

        layerItem.insertBefore(expandToggle, layerItem.firstChild);
        layerItem.appendChild(childrenContainer);
      }

      parentElement.appendChild(layerItem);
    });
  }
  /**
   * Create a layer item element with advanced interactions
   */
  private static createLayerItemElement(
    layer: LayerItem,
    depth: number
  ): HTMLElement {
    const layerItem = document.createElement('li');
    layerItem.className = 'layer-item';
    layerItem.style.paddingLeft = `${depth * 20}px`; // Indentation for nested layers
    layerItem.dataset.layerId = layer.id;

    // Visibility toggle
    const visibilityToggle = document.createElement('span');
    visibilityToggle.className = 'layer-visibility';
    visibilityToggle.innerHTML = layer.isVisible ? '👁️' : '👁️‍🗨️';
    visibilityToggle.addEventListener('click', () =>
      this.toggleLayerVisibility(layer)
    );

    // Layer name with type
    const layerName = document.createElement('span');
    layerName.className = 'layer-name';
    layerName.textContent = `${layer.type} - ${layer.id}`;
    layerName.addEventListener('click', () => this.selectLayer(layer));

    // Lock toggle
    const lockToggle = document.createElement('span');
    lockToggle.className = 'layer-lock';
    lockToggle.innerHTML = layer.isLocked ? '🔒' : '🔓';
    lockToggle.addEventListener('click', () => this.toggleLayerLock(layer));

    // Drag and drop functionality
    layerItem.draggable = true;
    layerItem.addEventListener('dragstart', e =>
      this.handleDragStart(e, layer)
    );
    layerItem.addEventListener('dragover', this.handleDragOver);
    layerItem.addEventListener('drop', e => this.handleDrop(e, layer));

    // Append elements
    layerItem.appendChild(visibilityToggle);
    layerItem.appendChild(layerName);
    layerItem.appendChild(lockToggle);

    return layerItem;
  }

  /**
   * Toggle layer visibility
   */
  private static toggleLayerVisibility(layer: LayerItem) {
    const component = document.getElementById(layer.id);
    if (!component) return;

    if (component.style.display === 'none') {
      component.style.display = component.dataset.originalDisplay || '';
      layer.isVisible = true;
    } else {
      component.dataset.originalDisplay = component.style.display;
      component.style.display = 'none';
      layer.isVisible = false;
    }

    this.updateLayersView();
  }

  /**
   * Toggle layer lock state
   */
  private static toggleLayerLock(layer: LayerItem) {
    const component = document.getElementById(layer.id);
    if (!component) return;

    layer.isLocked = !layer.isLocked;
    if (layer.isLocked) {
      component.setAttribute('data-locked', 'true');
      component.style.pointerEvents = 'none';
    } else {
      component.removeAttribute('data-locked');
      component.style.pointerEvents = 'auto';
    }

    this.updateLayersView();
  }

  /**
   * Select and customize a specific layer
   */
  private static selectLayer(layer: LayerItem) {
    // Switch to customize mode for the selected layer
    this.switchToCustomizeMode(layer.id);
  }

  /**
   * Drag and drop handling methods
   */
  private static handleDragStart(e: DragEvent, layer: LayerItem) {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', layer.id);
      this.draggedItem = e.target as HTMLElement;
    }
  }

  private static handleDragOver(e: DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }

  private static handleDrop(e: DragEvent, targetLayer: LayerItem) {
    e.preventDefault();
    e.stopPropagation();

    if (!e.dataTransfer) return;

    const fromIndex = parseInt(e.dataTransfer?.getData('text/plain') || '-1');
    const toIndex = parseInt(targetLayer.id || '-1');

    // Implement complex reordering logic
    Canvas.reorderComponent(fromIndex, toIndex);

    // Refresh the layers view
    this.updateLayersView();
  }

  /**
   * Switch to layer customization mode
   */
  private static switchToCustomizeMode(layerId: string) {
    // Implement layer-specific customization
    // This could open a sidebar, highlight the component, etc.
    const sidebar = document.getElementById('customize-sidebar');
    if (sidebar) {
      sidebar.style.display = 'block';
      // Load specific layer properties
      this.loadLayerProperties(layerId);
    }
  }

  /**
   * Load layer-specific properties into the sidebar
   */
  private static loadLayerProperties(layerId: string) {
    const component = document.getElementById(layerId);
    if (!component) return;

    // Example: Populate sidebar with component properties
    const propertiesContainer = document.getElementById('layer-properties');
    if (propertiesContainer) {
      propertiesContainer.innerHTML = `
        <h3>Layer Properties: ${layerId}</h3>
        <div>Type: ${component.tagName}</div>
        <div>Visibility: ${component.style.display !== 'none' ? 'Visible' : 'Hidden'}</div>
        <div>Locked: ${component.getAttribute('data-locked') === 'true' ? 'Yes' : 'No'}</div>
      `;
    }
  }
}

// CSS to complement the layers view (can be in a separate stylesheet)
const layerViewStyles = `
.layers-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
}

.layer-item {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid #e0e0e0;
  cursor: move;
  transition: background-color 0.2s;
}

.layer-item:hover {
  background-color: #f5f5f5;
}

.layer-expand-toggle {
  margin-right: 10px;
  cursor: pointer;
  user-select: none;
  width: 15px;
  text-align: center;
}

.layer-visibility, 
.layer-lock {
  margin-right: 10px;
  cursor: pointer;
  user-select: none;
}

.layer-name {
  flex-grow: 1;
  margin-right: 10px;
}

.layer-children {
  display: none;
  list-style: none;
  padding-left: 20px;
}

.layer-children.expanded {
  display: block;
}

.layer-item[data-depth="1"] { padding-left: 20px; }
.layer-item[data-depth="2"] { padding-left: 40px; }
.layer-item[data-depth="3"] { padding-left: 60px; }
.layer-item[data-depth="4"] { padding-left: 80px; }
`;

// Append styles to document
const styleElement = document.createElement('style');
styleElement.textContent = layerViewStyles;
document.head.appendChild(styleElement);

export default LayersViewController;

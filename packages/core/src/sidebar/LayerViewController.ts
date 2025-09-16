import { Canvas } from '../canvas/Canvas';

export default class LayersViewController {
  private static layersContainer: HTMLElement;

  static updateLayersView() {
    const layersView = document.getElementById('layers-view');
    if (!layersView) return;

    // Clear existing content
    layersView.innerHTML = '';

    // Add search/filter input
    const searchContainer = document.createElement('div');
    searchContainer.className = 'layers-search';
    searchContainer.innerHTML = `
      <input type="text" placeholder="Search layers..." id="layers-search-input">
    `;
    layersView.appendChild(searchContainer);

    // Create layers container
    const layersContainer = document.createElement('div');
    layersContainer.className = 'layers-container';
    layersView.appendChild(layersContainer);

    // Get canvas and build layer tree
    const canvas = document.getElementById('canvas');
    if (canvas) {
      this.buildLayerTree(canvas, layersContainer, 0);
    }

    // Add search functionality
    const searchInput = document.getElementById(
      'layers-search-input'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
        this.filterLayers(layersContainer, searchTerm);
      });
    }
  }

  private static buildLayerTree(
    element: HTMLElement,
    container: HTMLElement,
    level: number
  ) {
    const children = Array.from(element.children).filter(
      child =>
        child.classList.contains('editable-component') ||
        child.classList.contains('component')
    );

    children.forEach(child => {
      const layerItem = this.createLayerItem(child as HTMLElement, level);
      container.appendChild(layerItem);

      // Check for nested components
      const nestedComponents = Array.from(child.children).filter(
        nested =>
          nested.classList.contains('editable-component') ||
          nested.classList.contains('component')
      );

      if (nestedComponents.length > 0) {
        const childrenContainer = document.createElement('div');
        childrenContainer.className = 'layer-children collapsed';

        // Add expand/collapse functionality
        const expandToggle = layerItem.querySelector('.layer-expand-toggle');
        if (expandToggle) {
          expandToggle.addEventListener('click', e => {
            e.stopPropagation();
            this.toggleLayerExpansion(
              expandToggle as HTMLElement,
              childrenContainer
            );
          });
        }

        this.buildLayerTree(child as HTMLElement, childrenContainer, level + 1);
        container.appendChild(childrenContainer);
      }
    });
  }

  private static createLayerItem(
    element: HTMLElement,
    level: number
  ): HTMLElement {
    const layerItem = document.createElement('div');
    layerItem.className = 'layer-item';
    layerItem.setAttribute('data-component-id', element.id);
    layerItem.setAttribute('data-type', this.getComponentType(element));

    // Check if element has children
    const hasChildren = Array.from(element.children).some(
      child =>
        child.classList.contains('editable-component') ||
        child.classList.contains('component')
    );

    layerItem.innerHTML = `
      <div class="layer-content">
        ${hasChildren ? '<button class="layer-expand-toggle">▶</button>' : '<span style="width: 16px;"></span>'}
        <span class="layer-name">${this.getComponentName(element)}</span>
      </div>
      <div class="layer-actions">
        <button class="layer-action-btn layer-visibility-btn" title="Toggle visibility">
          👁️
        </button>
        <button class="layer-action-btn layer-delete-btn" title="Delete">
          🗑️
        </button>
      </div>
    `;

    // Add click handler for layer selection
    layerItem.addEventListener('click', e => {
      e.stopPropagation();
      this.selectLayer(layerItem, element);
    });

    // Add action handlers
    const visibilityBtn = layerItem.querySelector('.layer-visibility-btn');
    const deleteBtn = layerItem.querySelector('.layer-delete-btn');

    if (visibilityBtn) {
      visibilityBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.toggleVisibility(element, visibilityBtn as HTMLElement);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', e => {
        e.stopPropagation();
        this.deleteComponent(element, layerItem);
      });
    }

    return layerItem;
  }

  private static toggleLayerExpansion(
    toggle: HTMLElement,
    childrenContainer: HTMLElement
  ) {
    const isExpanded = childrenContainer.classList.contains('expanded');

    if (isExpanded) {
      childrenContainer.classList.remove('expanded');
      childrenContainer.classList.add('collapsed');
      toggle.classList.remove('expanded');
    } else {
      childrenContainer.classList.remove('collapsed');
      childrenContainer.classList.add('expanded');
      toggle.classList.add('expanded');
    }
  }

  private static selectLayer(layerItem: HTMLElement, element: HTMLElement) {
    // Remove previous selection
    document.querySelectorAll('.layer-item.selected').forEach(item => {
      item.classList.remove('selected');
    });

    // Add selection to current item
    layerItem.classList.add('selected');

    // Show customization sidebar for selected component
    if (typeof (window as any).CustomizationSidebar !== 'undefined') {
      (window as any).CustomizationSidebar.showSidebar(element.id);
    }
  }

  private static toggleVisibility(element: HTMLElement, button: HTMLElement) {
    const isHidden = element.style.display === 'none';

    if (isHidden) {
      element.style.display = '';
      button.classList.remove('hidden');
    } else {
      element.style.display = 'none';
      button.classList.add('hidden');
    }
  }

  private static deleteComponent(element: HTMLElement, layerItem: HTMLElement) {
    element.remove();
    layerItem.remove();
    const updatedComponents = Canvas.getComponents().filter(
      comp => comp !== element
    );
    Canvas.setComponents(updatedComponents);
    Canvas.historyManager.captureState();
    Canvas.dispatchDesignChange();

    // Update layers view
    this.updateLayersView();
  }

  private static getComponentType(element: HTMLElement): string {
    if (element.classList.contains('text-component')) return 'text';
    if (element.classList.contains('button-component')) return 'button';
    if (element.classList.contains('image-component')) return 'image';
    if (element.classList.contains('container-component')) return 'container';
    return 'component';
  }

  private static getComponentName(element: HTMLElement): string {
    // Try to get a meaningful name
    if (element.id) return element.id;

    const type = this.getComponentType(element);
    const index =
      Array.from(element.parentElement?.children || [])
        .filter(child => child.classList.contains(element.classList[0]))
        .indexOf(element) + 1;

    return `${type.charAt(0).toUpperCase() + type.slice(1)} ${index}`;
  }

  private static filterLayers(container: HTMLElement, searchTerm: string) {
    const layerItems = container.querySelectorAll('.layer-item');

    layerItems.forEach(item => {
      const layerName =
        item.querySelector('.layer-name')?.textContent?.toLowerCase() || '';
      const matches = layerName.includes(searchTerm);
      (item as HTMLElement).style.display = matches ? 'flex' : 'none';
    });
  }
}

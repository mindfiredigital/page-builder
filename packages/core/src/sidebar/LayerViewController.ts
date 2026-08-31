import { buildLayerTree } from './LayerViewCore/LayerTreeBuilder';
import { filterLayers } from './LayerViewCore/LayerUtils';

export default class LayersViewController {
  private static layersContainer: HTMLElement;

  /* Rebuilds the entire layers panel from scratch */
  static updateLayersView(): void {
    const layersView = document.getElementById('layers-view');
    if (!layersView) return;

    /* Wipe previous content before rebuilding */
    layersView.innerHTML = '';

    /* Search / filter bar at the top of the panel */
    const searchContainer = document.createElement('div');
    searchContainer.className = 'layers-search';
    searchContainer.innerHTML = `
      <input type="text" placeholder="Search layers..." id="layers-search-input">
    `;
    layersView.appendChild(searchContainer);

    /* Container that holds all layer rows */
    const layersContainer = document.createElement('div');
    layersContainer.className = 'layers-container';
    layersView.appendChild(layersContainer);

    /* Build the full tree starting from the canvas root */
    const canvas = document.getElementById('canvas');
    if (canvas) {
      /* Pass updateLayersView as the refresh callback so deletes rebuild the panel */
      buildLayerTree(canvas, layersContainer, 0, () => this.updateLayersView());
    }

    /* Wire live search to filter visible layer rows */
    const searchInput = document.getElementById(
      'layers-search-input'
    ) as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', e => {
        const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
        filterLayers(layersContainer, searchTerm);
      });
    }
  }
}

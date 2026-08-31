import { buildLayerTree } from './LayerViewCore/LayerTreeBuilder.js';
import { filterLayers } from './LayerViewCore/LayerUtils.js';
export default class LayersViewController {
    /* Rebuilds the entire layers panel from scratch */
    static updateLayersView() {
        const layersView = document.getElementById('layers-view');
        if (!layersView)
            return;
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
        const searchInput = document.getElementById('layers-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', e => {
                const searchTerm = e.target.value.toLowerCase();
                filterLayers(layersContainer, searchTerm);
            });
        }
    }
}

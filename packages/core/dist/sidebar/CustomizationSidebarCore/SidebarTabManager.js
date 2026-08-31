import { svgs } from '../../icons/svgs.js';
import LayersViewController from '../LayerViewController.js';
/* Creates the tab toggle bar and wires click handlers */
export function buildTabToggle(state) {
    const layersModeToggle = document.createElement('div');
    layersModeToggle.className = 'layers-mode-toggle';
    layersModeToggle.innerHTML = `
    <button id="customize-tab"  title="Customize"  class="active">${svgs.settings}</button>
    <button id="attribute-tab"  title="Attribute">${svgs.attribute}</button>
    <button id="layers-tab"     title="Layers">${svgs.menu}</button>
  `;
    const customizeTab = layersModeToggle.querySelector('#customize-tab');
    const attributeTab = layersModeToggle.querySelector('#attribute-tab');
    const layersTab = layersModeToggle.querySelector('#layers-tab');
    /* In view-only mode with attribute tab forced: hide Customize and Layers */
    if (state.editable === false && state.showAttributeTab === true) {
        customizeTab.style.display = 'none';
        layersTab.style.display = 'none';
        attributeTab.classList.add('active');
        customizeTab.classList.remove('active');
        state.onAttributeTab();
    }
    else {
        customizeTab.addEventListener('click', () => state.onCustomizeTab());
        attributeTab.addEventListener('click', () => state.onAttributeTab());
        layersTab.addEventListener('click', () => switchToLayersMode());
    }
    return layersModeToggle;
}
/* Activates the Customize tab — shows CSS controls, hides the rest */
export function switchToCustomizeMode(controlsContainer, functionsPanel, componentName) {
    setActiveTab('customize-tab');
    document.getElementById('layers-view').style.display = 'none';
    controlsContainer.style.display = 'block';
    functionsPanel.style.display = 'none';
    componentName.style.display = 'block';
}
/* Activates the Attribute tab — shows the functions panel, hides CSS controls */
export function switchToAttributeMode(controlsContainer, functionsPanel, componentName) {
    setActiveTab('attribute-tab');
    document.getElementById('layers-view').style.display = 'none';
    functionsPanel.style.display = 'block';
    controlsContainer.style.display = 'none';
    componentName.style.display = 'block';
}
/* Activates the Layers tab — shows the layer tree, hides all panels */
export function switchToLayersMode() {
    setActiveTab('layers-tab');
    const layersView = document.getElementById('layers-view');
    const componentName = document.getElementById('component-name');
    layersView.style.display = 'block';
    componentName.style.display = 'none';
    LayersViewController.updateLayersView();
}
/* Removes active from all tabs then sets it on the target */
function setActiveTab(activeId) {
    var _a;
    ['customize-tab', 'attribute-tab', 'layers-tab'].forEach(id => {
        var _a;
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.classList.remove('active');
    });
    (_a = document.getElementById(activeId)) === null || _a === void 0 ? void 0 : _a.classList.add('active');
}

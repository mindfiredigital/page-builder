import { svgs } from '../../icons/svgs';
import LayersViewController from '../LayerViewController';

/* Creates the tab toggle bar and wires click handlers */
export function buildTabToggle(state: TabManagerState): HTMLDivElement {
  const layersModeToggle = document.createElement('div');
  layersModeToggle.className = 'layers-mode-toggle';
  layersModeToggle.innerHTML = `
    <button id="customize-tab"  title="Customize"  class="active">${svgs.settings}</button>
    <button id="attribute-tab"  title="Attribute">${svgs.attribute}</button>
    <button id="layers-tab"     title="Layers">${svgs.menu}</button>
  `;

  const customizeTab = layersModeToggle.querySelector('#customize-tab')!;
  const attributeTab = layersModeToggle.querySelector('#attribute-tab')!;
  const layersTab = layersModeToggle.querySelector('#layers-tab')!;

  /* In view-only mode with attribute tab forced: hide Customize and Layers */
  if (state.editable === false && state.showAttributeTab === true) {
    (customizeTab as HTMLElement).style.display = 'none';
    (layersTab as HTMLElement).style.display = 'none';
    attributeTab.classList.add('active');
    customizeTab.classList.remove('active');
    state.onAttributeTab();
  } else {
    customizeTab.addEventListener('click', () => state.onCustomizeTab());
    attributeTab.addEventListener('click', () => state.onAttributeTab());
    layersTab.addEventListener('click', () => switchToLayersMode());
  }

  return layersModeToggle;
}

/* Activates the Customize tab — shows CSS controls, hides the rest */
export function switchToCustomizeMode(
  controlsContainer: HTMLElement,
  functionsPanel: HTMLElement,
  componentName: HTMLElement
): void {
  setActiveTab('customize-tab');
  document.getElementById('layers-view')!.style.display = 'none';
  controlsContainer.style.display = 'block';
  functionsPanel.style.display = 'none';
  componentName.style.display = 'block';
}

/* Activates the Attribute tab — shows the functions panel, hides CSS controls */
export function switchToAttributeMode(
  controlsContainer: HTMLElement,
  functionsPanel: HTMLElement,
  componentName: HTMLElement
): void {
  setActiveTab('attribute-tab');
  document.getElementById('layers-view')!.style.display = 'none';
  functionsPanel.style.display = 'block';
  controlsContainer.style.display = 'none';
  componentName.style.display = 'block';
}

/* Activates the Layers tab — shows the layer tree, hides all panels */
export function switchToLayersMode(): void {
  setActiveTab('layers-tab');
  const layersView = document.getElementById('layers-view')!;
  const componentName = document.getElementById('component-name')!;
  layersView.style.display = 'block';
  componentName.style.display = 'none';
  LayersViewController.updateLayersView();
}

/* Removes active from all tabs then sets it on the target */
function setActiveTab(activeId: string): void {
  ['customize-tab', 'attribute-tab', 'layers-tab'].forEach(id => {
    document.getElementById(id)?.classList.remove('active');
  });
  document.getElementById(activeId)?.classList.add('active');
}

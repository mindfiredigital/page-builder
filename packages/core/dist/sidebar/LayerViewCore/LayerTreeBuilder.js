import { getComponentType, getComponentName } from './LayerUtils.js';
import {
  selectLayer,
  toggleVisibility,
  deleteComponent,
  toggleLayerExpansion,
} from './LayerItemActions.js';
/* Recursively walks the element's children and appends layer rows to the container */
export function buildLayerTree(
  element,
  container,
  level,
  refreshFn /* passed down so delete can trigger a full rebuild */
) {
  /* Only components tagged as editable or generic canvas components are shown */
  const children = Array.from(element.children).filter(
    child =>
      child.classList.contains('editable-component') ||
      child.classList.contains('component')
  );
  children.forEach(child => {
    const layerItem = createLayerItem(child, level, refreshFn);
    container.appendChild(layerItem);
    /* Check whether this child has its own nested components */
    const nestedComponents = Array.from(child.children).filter(
      nested =>
        nested.classList.contains('editable-component') ||
        nested.classList.contains('component')
    );
    if (nestedComponents.length > 0) {
      /* Nested children start collapsed */
      const childrenContainer = document.createElement('div');
      childrenContainer.className = 'layer-children collapsed';
      /* Wire the expand toggle that was just rendered inside layerItem */
      const expandToggle = layerItem.querySelector('.layer-expand-toggle');
      if (expandToggle) {
        expandToggle.addEventListener('click', e => {
          e.stopPropagation();
          toggleLayerExpansion(expandToggle, childrenContainer);
        });
      }
      buildLayerTree(child, childrenContainer, level + 1, refreshFn);
      container.appendChild(childrenContainer);
    }
  });
}
/* Creates a single layer row element with action buttons and event listeners */
function createLayerItem(element, level, refreshFn) {
  const layerItem = document.createElement('div');
  layerItem.className = 'layer-item';
  layerItem.setAttribute('data-component-id', element.id);
  layerItem.setAttribute('data-type', getComponentType(element));
  /* Show expand toggle only when the element contains child components */
  const hasChildren = Array.from(element.children).some(
    child =>
      child.classList.contains('editable-component') ||
      child.classList.contains('component')
  );
  layerItem.innerHTML = `
    <div class="layer-content">
      ${
        hasChildren
          ? '<button class="layer-expand-toggle">▶</button>'
          : '<span style="width: 16px;"></span>'
      }
      <span class="layer-name">${getComponentName(element)}</span>
    </div>
    <div class="layer-actions">
      <button class="layer-action-btn layer-visibility-btn" title="Toggle visibility">👁️</button>
      <button class="layer-action-btn layer-delete-btn"     title="Delete">🗑️</button>
    </div>
  `;
  /* Clicking the row selects the component in the canvas */
  layerItem.addEventListener('click', e => {
    e.stopPropagation();
    selectLayer(layerItem, element);
  });
  /* Visibility toggle — eye button */
  const visibilityBtn = layerItem.querySelector('.layer-visibility-btn');
  if (visibilityBtn) {
    visibilityBtn.addEventListener('click', e => {
      e.stopPropagation();
      toggleVisibility(element, visibilityBtn);
    });
  }
  /* Delete button — removes the component and refreshes the panel */
  const deleteBtn = layerItem.querySelector('.layer-delete-btn');
  if (deleteBtn) {
    deleteBtn.addEventListener('click', e => {
      e.stopPropagation();
      deleteComponent(element, layerItem, refreshFn);
    });
  }
  return layerItem;
}

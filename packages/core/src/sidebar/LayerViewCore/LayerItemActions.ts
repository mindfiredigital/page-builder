import { Canvas } from '../../canvas/Canvas';

/* Removes the active selection from all layer rows then selects the clicked one */
export function selectLayer(
  layerItem: HTMLElement,
  element: HTMLElement
): void {
  document.querySelectorAll('.layer-item.selected').forEach(item => {
    item.classList.remove('selected');
  });

  layerItem.classList.add('selected');

  /* Delegate to CustomizationSidebar if it is available on the window */
  if (typeof (window as any).CustomizationSidebar !== 'undefined') {
    (window as any).CustomizationSidebar.showSidebar(element.id);
  }
}

/* Toggles the DOM element's visibility and syncs the eye-button state */
export function toggleVisibility(
  element: HTMLElement,
  button: HTMLElement
): void {
  const isHidden = element.style.display === 'none';

  if (isHidden) {
    /* Restore to flow — clearing the inline style lets CSS take over */
    element.style.display = '';
    button.classList.remove('hidden');
  } else {
    element.style.display = 'none';
    button.classList.add('hidden');
  }
}

/* Removes the component from the DOM, the Canvas component list, and captures state */
export function deleteComponent(
  element: HTMLElement,
  layerItem: HTMLElement,
  refreshFn: () => void /* callback so the full layers view rebuilds */
): void {
  element.remove();
  layerItem.remove();

  /* Keep Canvas component registry in sync after deletion */
  const updatedComponents = Canvas.getComponents().filter(c => c !== element);
  Canvas.setComponents(updatedComponents);

  Canvas.historyManager.captureState();
  Canvas.dispatchDesignChange();

  /* Rebuild the layers panel to reflect the deletion */
  refreshFn();
}

/* Expands or collapses a nested children container */
export function toggleLayerExpansion(
  toggle: HTMLElement,
  childrenContainer: HTMLElement
): void {
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

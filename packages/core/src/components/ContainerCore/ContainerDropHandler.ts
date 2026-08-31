import { Canvas } from '../../canvas/Canvas';

/* Handles a component being dropped from the sidebar into this container */
export function handleContainerDrop(
  element: HTMLElement,
  event: DragEvent
): void {
  event.preventDefault();

  const componentType = event.dataTransfer?.getData('component-type');
  /* Only handle new-component drops from the sidebar.  Drag-handle reorders
     set 'dragged-component-id' instead; don't swallow those — let them bubble
     up to the canvas drop handler. */
  if (!componentType) return;

  event.stopPropagation();

  const component = Canvas.createComponent(componentType);
  if (!component) return;

  /* Third class on the container element is its unique identifier */
  const containerClass = element.classList[2];
  const uniqueClass = Canvas.generateUniqueClass(
    componentType,
    true,
    containerClass
  );

  component.classList.add(uniqueClass);
  component.id = uniqueClass;

  /*
   * createComponent already appends a .component-label with the global name.
   * Update that label's text to the container-scoped name instead of creating
   * a second label (which caused the wrong name to show on hover).
   */
  const existingLabel = component.querySelector(
    '.component-label'
  ) as HTMLElement | null;
  if (existingLabel) {
    existingLabel.textContent = uniqueClass;
  }

  /* Propagate nesting depth so CSS can apply depth-specific border colors */
  if (component.classList.contains('container-component')) {
    const parentDepth = parseInt(element.getAttribute('data-depth') ?? '0');
    component.setAttribute('data-depth', String(parentDepth + 1));
  }

  if (Canvas.layoutMode === 'absolute') {
    component.style.position = 'absolute';
    component.style.left = `${event.offsetX}px`;
    component.style.top = `${event.offsetY}px`;
    Canvas.addDraggableListeners(component);
  } else if (Canvas.layoutMode === 'grid') {
    element.classList.add('container-grid-active');
    /*
     * Without an explicit width, block-display nested containers expand to
     * 100% of their parent. Set a sensible default so the user can see the
     * container boundary and resize from there.
     */
    if (
      !component.style.width &&
      component.classList.contains('container-component')
    ) {
      component.style.width = '50%';
    }
  }

  element.appendChild(component);

  /* Capture state so the drop can be undone */
  Canvas.historyManager.captureState();
}

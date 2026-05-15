import { Canvas } from '../../canvas/Canvas';

/* Handles a component being dropped from the sidebar into this container */
export function handleContainerDrop(
  element: HTMLElement,
  event: DragEvent
): void {
  event.preventDefault();
  event.stopPropagation();

  const componentType = event.dataTransfer?.getData('component-type');
  if (!componentType) return;

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

  /* Hover label — hidden by default, shown on mouseenter */
  const label = document.createElement('span');
  label.className = 'component-label';
  label.textContent = uniqueClass;
  label.setAttribute('contenteditable', 'false');
  component.id = uniqueClass;
  label.style.display = 'none';
  component.appendChild(label);

  if (Canvas.layoutMode === 'absolute') {
    /* Position dropped component exactly where the cursor landed */
    component.style.position = 'absolute';
    component.style.left = `${event.offsetX}px`;
    component.style.top = `${event.offsetY}px`;
    Canvas.addDraggableListeners(component);
  } else if (Canvas.layoutMode === 'grid') {
    /* Grid mode: activate the grid layout class on the parent */
    element.classList.add('container-grid-active');
  }

  element.appendChild(component);

  /* Capture state so the drop can be undone */
  Canvas.historyManager.captureState();
}

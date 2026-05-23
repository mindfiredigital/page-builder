import { Canvas } from '../../canvas/Canvas';
import { ImageComponent } from '../ImageComponent';
import { ContainerResizeHandler } from './ContainerResizeHandler';
import { initContainerEventListeners } from './ContainerEventListeners';

/* Shows the hover label on a non-container component */
function showLabel(event: MouseEvent, component: HTMLElement): void {
  event.stopPropagation();
  const label = component.querySelector('.component-label') as HTMLElement;
  if (label) label.style.display = 'block';
}

/* Hides the hover label on a non-container component */
function hideLabel(event: MouseEvent, component: HTMLElement): void {
  event.stopPropagation();
  const label = component.querySelector('.component-label') as HTMLElement;
  if (label) label.style.display = 'none';
}

/* Re-attaches resize handles to an existing container DOM element */
export function restoreResizer(element: HTMLElement): void {
  element.querySelector('.resizers')?.remove();

  const resizersDiv = document.createElement('div');
  resizersDiv.classList.add('resizers');

  const handler = new ContainerResizeHandler(element, resizersDiv);
  handler.addResizeHandles();

  element.appendChild(resizersDiv);
}

/* Recursively restores a container and all its editable child components */
export function restoreContainer(
  container: HTMLElement,
  editable?: boolean | null
): void {
  const isGridMode = Canvas.layoutMode === 'grid';

  if (editable !== false && !isGridMode) {
    restoreResizer(container);
  } else {
    container.querySelectorAll('.resizers').forEach(r => r.remove());
  }

  container.querySelectorAll('.editable-component').forEach(child => {
    const childElement = child as HTMLElement;

    if (editable !== false) {
      Canvas.controlsManager.addControlButtons(childElement);

      if (isGridMode) {
        childElement.classList.remove('component-resizer');
        childElement.removeAttribute('draggable');
        childElement.style.cursor = 'default';
        childElement.style.position = '';
        childElement.style.left = '';
        childElement.style.top = '';
      } else {
        Canvas.addDraggableListeners(childElement);
        childElement.style.position = 'absolute';
        childElement.classList.add('component-resizer');
      }

      if (childElement.classList.contains('container-component')) {
        /*
         * Nested containers use mouseover/mouseleave managed by
         * initContainerEventListeners — not inline-style mouseenter/leave.
         * Re-wiring here ensures restored nested containers respond correctly.
         */
        initContainerEventListeners(childElement);
      } else {
        /* Non-container children: direct inline-style label show/hide */
        childElement.addEventListener('mouseenter', (event: MouseEvent) =>
          showLabel(event, childElement)
        );
        childElement.addEventListener('mouseleave', (event: MouseEvent) =>
          hideLabel(event, childElement)
        );
      }
    } else {
      (
        childElement.querySelectorAll(
          '[contenteditable]'
        ) as NodeListOf<HTMLElement>
      ).forEach(el => el.removeAttribute('contenteditable'));

      childElement.classList.remove('editable-component');
      childElement.classList.remove('component-resizer');
      childElement.removeAttribute('draggable');
      childElement.removeAttribute('contenteditable');
    }

    if (childElement.classList.contains('image-component')) {
      const imageSrc =
        childElement.querySelector('img')?.getAttribute('src') ?? null;
      ImageComponent.restoreImageUpload(childElement, imageSrc ?? '', editable);
    }

    if (childElement.classList.contains('container-component')) {
      restoreContainer(childElement, editable);
    }
  });
}

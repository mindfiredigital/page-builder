import { Canvas } from '../../canvas/Canvas.js';
import { ImageComponent } from '../ImageComponent.js';
import { ContainerResizeHandler } from './ContainerResizeHandler.js';
import { initContainerEventListeners } from './ContainerEventListeners.js';
/* Shows the hover label on a non-container component */
function showLabel(event, component) {
  event.stopPropagation();
  const label = component.querySelector('.component-label');
  if (label) label.style.display = 'block';
}
/* Hides the hover label on a non-container component */
function hideLabel(event, component) {
  event.stopPropagation();
  const label = component.querySelector('.component-label');
  if (label) label.style.display = 'none';
}
/* Re-attaches resize handles to an existing container DOM element */
export function restoreResizer(element) {
  var _a;
  (_a = element.querySelector('.resizers')) === null || _a === void 0
    ? void 0
    : _a.remove();
  const resizersDiv = document.createElement('div');
  resizersDiv.classList.add('resizers');
  const handler = new ContainerResizeHandler(element, resizersDiv);
  handler.addResizeHandles();
  element.appendChild(resizersDiv);
}
/* Recursively restores a container and all its editable child components */
export function restoreContainer(container, editable) {
  const isGridMode = Canvas.layoutMode === 'grid';
  if (editable !== false && !isGridMode) {
    restoreResizer(container);
  } else {
    container.querySelectorAll('.resizers').forEach(r => r.remove());
  }
  container.querySelectorAll('.editable-component').forEach(child => {
    var _a, _b;
    const childElement = child;
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
        childElement.addEventListener('mouseenter', event =>
          showLabel(event, childElement)
        );
        childElement.addEventListener('mouseleave', event =>
          hideLabel(event, childElement)
        );
      }
    } else {
      childElement
        .querySelectorAll('[contenteditable]')
        .forEach(el => el.removeAttribute('contenteditable'));
      childElement.classList.remove('editable-component');
      childElement.classList.remove('component-resizer');
      childElement.removeAttribute('draggable');
      childElement.removeAttribute('contenteditable');
    }
    if (childElement.classList.contains('image-component')) {
      const imageSrc =
        (_b =
          (_a = childElement.querySelector('img')) === null || _a === void 0
            ? void 0
            : _a.getAttribute('src')) !== null && _b !== void 0
          ? _b
          : null;
      ImageComponent.restoreImageUpload(
        childElement,
        imageSrc !== null && imageSrc !== void 0 ? imageSrc : '',
        editable
      );
    }
    if (childElement.classList.contains('container-component')) {
      restoreContainer(childElement, editable);
    }
  });
}

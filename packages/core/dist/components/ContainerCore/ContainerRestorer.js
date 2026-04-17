import { Canvas } from '../../canvas/Canvas.js';
import { ImageComponent } from '../ImageComponent.js';
import { ContainerResizeHandler } from './ContainerResizeHandler.js';
/* Shows the hover label on a component */
function showLabel(event, component) {
  event.stopPropagation();
  const label = component.querySelector('.component-label');
  if (label) label.style.display = 'block';
}
/* Hides the hover label on a component */
function hideLabel(event, component) {
  event.stopPropagation();
  const label = component.querySelector('.component-label');
  if (label) label.style.display = 'none';
}
/* Re-attaches resize handles to an existing container DOM element */
export function restoreResizer(element) {
  var _a;
  /* Remove stale resizers that may already be present */
  (_a = element.querySelector('.resizers')) === null || _a === void 0
    ? void 0
    : _a.remove();
  const resizersDiv = document.createElement('div');
  resizersDiv.classList.add('resizers');
  /* Bind a fresh resize handler to this element and attach the handles */
  const handler = new ContainerResizeHandler(element, resizersDiv);
  handler.addResizeHandles();
  element.appendChild(resizersDiv);
}
/* Recursively restores a container and all its editable child components */
export function restoreContainer(container, editable) {
  const isGridMode = Canvas.layoutMode === 'grid';
  /* Only add resize handles in absolute mode when editable */
  if (editable !== false && !isGridMode) {
    restoreResizer(container);
  } else {
    /* Strip any existing resizer handles (preview / export mode) */
    container.querySelectorAll('.resizers').forEach(r => r.remove());
  }
  /* Re-wire controls and listeners on every editable child */
  container.querySelectorAll('.editable-component').forEach(child => {
    var _a;
    if (editable !== false) {
      Canvas.controlsManager.addControlButtons(child);
      if (isGridMode) {
        /* Grid mode: remove absolute-layout artefacts from child */
        child.classList.remove('component-resizer');
        child.removeAttribute('draggable');
        child.style.cursor = 'default';
        child.style.position = '';
        child.style.left = '';
        child.style.top = '';
      } else {
        /* Absolute mode: make children draggable and resizable */
        Canvas.addDraggableListeners(child);
        child.style.position = 'absolute';
        child.classList.add('component-resizer');
      }
      /* Re-attach hover label listeners to each child */
      child.addEventListener('mouseenter', event => showLabel(event, child));
      child.addEventListener('mouseleave', event => hideLabel(event, child));
    } else {
      /* Non-editable (preview/export): strip all editing attributes */
      child
        .querySelectorAll('[contenteditable]')
        .forEach(el => el.removeAttribute('contenteditable'));
      child.classList.remove('editable-component');
      child.classList.remove('component-resizer');
      child.removeAttribute('draggable');
      child.removeAttribute('contenteditable');
    }
    /* Restore image-upload interactivity for image children */
    if (child.classList.contains('image-component')) {
      const imageSrc =
        ((_a = child.querySelector('img')) === null || _a === void 0
          ? void 0
          : _a.getAttribute('src')) || '';
      ImageComponent.restoreImageUpload(child, imageSrc, editable);
    }
    /* Recurse into nested containers */
    if (child.classList.contains('container-component')) {
      restoreContainer(child, editable);
    }
  });
}

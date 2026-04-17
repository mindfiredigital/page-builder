import { handleContainerDrop } from './ContainerDropHandler.js';
/* Wires all DOM event listeners onto the container element */
export function initContainerEventListeners(element) {
  /* Stop drag bubbling when the container itself is the drag source */
  element.addEventListener('dragstart', event => {
    if (event.target === element) event.stopPropagation();
  });
  element.addEventListener('drop', event =>
    handleContainerDrop(element, event)
  );
  element.addEventListener('dragover', event => event.preventDefault());
  /* Highlight the innermost container the cursor is directly over */
  element.addEventListener('mouseover', event => {
    event.stopPropagation();
    /* Clear highlight from any previously highlighted containers */
    document.querySelectorAll('.container-highlight').forEach(el => {
      el.classList.remove('container-highlight');
    });
    if (event.target === element) element.classList.add('container-highlight');
  });
  /* Remove highlight when cursor leaves */
  element.addEventListener('mouseleave', event => {
    if (event.target === element)
      element.classList.remove('container-highlight');
  });
}

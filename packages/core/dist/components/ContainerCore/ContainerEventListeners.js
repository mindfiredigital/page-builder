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
  /*
   * mouseover fires for every element the cursor enters (bubbles up).
   * stopPropagation keeps outer container handlers from also firing.
   * Only show label/highlight when cursor is directly over this container's
   * surface (event.target === element), not when it's over a child.
   * Child containers call stopPropagation in their own handlers, so the
   * outer container's handler won't run when cursor is inside a child container.
   */
  element.addEventListener('mouseover', event => {
    event.stopPropagation();
    /* Clear highlight and label-visible from all other containers */
    document.querySelectorAll('.container-highlight').forEach(el => {
      if (el !== element) {
        el.classList.remove('container-highlight');
        el.classList.remove('label-visible');
      }
    });
    if (event.target === element) {
      /* Cursor is directly on this container's surface — highlight and show label */
      element.classList.add('container-highlight');
      element.classList.add('label-visible');
    } else {
      /*
       * Cursor is over a non-container child (container children call
       * stopPropagation so they never reach here). Remove this container's
       * visual state so only the targeted element is highlighted.
       */
      element.classList.remove('container-highlight');
      element.classList.remove('label-visible');
    }
  });
  /* Remove highlight and label when cursor fully leaves this container */
  element.addEventListener('mouseleave', () => {
    element.classList.remove('container-highlight');
    element.classList.remove('label-visible');
  });
}

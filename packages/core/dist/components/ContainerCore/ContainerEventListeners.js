import { handleContainerDrop } from './ContainerDropHandler.js';
/**
 * Shows a blue insert-indicator line inside the container at the position
 * where the dragged component would be inserted.  Called during dragover
 * when a reorder drag (dragged-component-id) is detected.
 */
function updateContainerInsertIndicator(event, container) {
    /* Remove any existing indicators inside this container */
    container
        .querySelectorAll(':scope > .drop-insert-indicator')
        .forEach(el => el.remove());
    const children = Array.from(container.querySelectorAll(':scope > .editable-component'));
    let insertBefore = null;
    for (const child of children) {
        const rect = child.getBoundingClientRect();
        if (event.clientY < rect.top + rect.height / 2) {
            insertBefore = child;
            break;
        }
    }
    const indicator = document.createElement('div');
    indicator.className = 'drop-insert-indicator';
    if (insertBefore) {
        container.insertBefore(indicator, insertBefore);
    }
    else {
        container.appendChild(indicator);
    }
}
/* Wires all DOM event listeners onto the container element */
export function initContainerEventListeners(element) {
    /* Stop drag bubbling when the container itself is the drag source */
    element.addEventListener('dragstart', (event) => {
        if (event.target === element)
            event.stopPropagation();
    });
    element.addEventListener('drop', (event) => handleContainerDrop(element, event));
    element.addEventListener('dragover', (event) => {
        var _a;
        event.preventDefault();
        /* When a component is being reordered (drag handle), show an insert
           indicator within this container and stop the event from reaching the
           canvas-level dragover handler so the canvas indicator doesn't appear. */
        if ((_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.types.includes('dragged-component-id')) {
            event.stopPropagation();
            updateContainerInsertIndicator(event, element);
        }
    });
    /* Clean up the insert indicator when the cursor leaves the container */
    element.addEventListener('dragleave', (event) => {
        if (!element.contains(event.relatedTarget)) {
            element
                .querySelectorAll(':scope > .drop-insert-indicator')
                .forEach(el => el.remove());
        }
    });
    /*
     * mouseover fires for every element the cursor enters (bubbles up).
     * stopPropagation keeps outer container handlers from also firing.
     * Only show label/highlight when cursor is directly over this container's
     * surface (event.target === element), not when it's over a child.
     * Child containers call stopPropagation in their own handlers, so the
     * outer container's handler won't run when cursor is inside a child container.
     */
    element.addEventListener('mouseover', (event) => {
        event.stopPropagation();
        /* Clear highlight and label-visible from all other containers */
        document
            .querySelectorAll('.container-highlight')
            .forEach(el => {
            if (el !== element) {
                el.classList.remove('container-highlight');
                el.classList.remove('label-visible');
            }
        });
        if (event.target === element) {
            /* Cursor is directly on this container's surface — highlight and show label */
            element.classList.add('container-highlight');
            element.classList.add('label-visible');
        }
        else {
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

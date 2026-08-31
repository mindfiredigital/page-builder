import { CanvasSharedState } from './CanvasCore/CanvasSharedState.js';
import { CanvasEventDispatcher } from './CanvasCore/CanvasEventDispatcher.js';
export class ComponentControlsManager {
    constructor(_canvas) {
        this.icons = {
            delete: 'https://res.cloudinary.com/dodvwsaqj/image/upload/v1737366522/delete-2-svgrepo-com_fwkzn7.svg',
        };
    }
    /**
     * Adds a controls div (with drag handle in grid mode, delete button) to the component.
     *
     * Image containers: we use appendChild (not prepend) and skip adding
     * `position: relative` — both of which were the original fix that kept
     * images rendering at their natural size. The delete bug was unrelated to
     * this; it was caused by searching for `.delete-icon` on `element` instead
     * of inside `controlsDiv` (fixed in createDeleteIcon below).
     */
    addControlButtons(element) {
        var _a;
        const isImageContainer = !!element.querySelector('img');
        /* Only set position:relative on non-image wrappers */
        if (!isImageContainer) {
            if (!element.style.position || element.style.position === 'static') {
                element.style.position = 'relative';
            }
        }
        let controlsDiv = element.querySelector('.component-controls');
        if (!controlsDiv) {
            controlsDiv = document.createElement('div');
            controlsDiv.className = 'component-controls';
            controlsDiv.setAttribute('contenteditable', 'false');
            controlsDiv.style.position = 'absolute';
            controlsDiv.style.top = '0';
            controlsDiv.style.right = '0';
            controlsDiv.style.zIndex = '100';
            controlsDiv.style.display = 'flex';
            controlsDiv.style.gap = '4px';
            controlsDiv.style.padding = '2px';
            controlsDiv.style.pointerEvents = 'none';
            /*
             * Image containers: append (after the <img>) so the controls div
             * does not shift the image in the DOM or break flex/grid sizing.
             * Everything else: prepend so controls appear visually on top-right.
             */
            if (isImageContainer) {
                element.appendChild(controlsDiv);
            }
            else {
                element.prepend(controlsDiv);
            }
        }
        /*
         * In grid mode add a drag handle so every component — including
         * containers whose children cover the entire surface — can be grabbed
         * and reordered without needing to hit empty border space.
         *
         * Always remove and recreate the handle so it always has a live
         * dragstart listener — a handle restored from serialised innerHTML
         * has no event listeners and would silently do nothing on drag.
         */
        if (CanvasSharedState.layoutMode === 'grid') {
            (_a = controlsDiv.querySelector('.drag-handle')) === null || _a === void 0 ? void 0 : _a.remove();
            const dragHandle = this.createDragHandle(element);
            controlsDiv.prepend(dragHandle);
        }
        const deleteIcon = this.createDeleteIcon(element, controlsDiv);
        controlsDiv.appendChild(deleteIcon);
    }
    /**
     * Creates a drag handle that sets 'dragged-component-id' on the data
     * transfer so the canvas drop handler knows to reorder rather than create.
     */
    createDragHandle(element) {
        const handle = document.createElement('div');
        handle.className = 'drag-handle';
        handle.setAttribute('draggable', 'true');
        handle.setAttribute('contenteditable', 'false');
        handle.title = 'Drag to reorder';
        handle.style.pointerEvents = 'all';
        handle.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="9" cy="5" r="2"/><circle cx="15" cy="5" r="2"/>
      <circle cx="9" cy="12" r="2"/><circle cx="15" cy="12" r="2"/>
      <circle cx="9" cy="19" r="2"/><circle cx="15" cy="19" r="2"/>
    </svg>`;
        handle.addEventListener('dragstart', (event) => {
            event.stopPropagation();
            if (event.dataTransfer) {
                event.dataTransfer.setData('dragged-component-id', element.id);
                event.dataTransfer.effectAllowed = 'move';
            }
            element.style.opacity = '0.45';
            handle.style.cursor = 'grabbing';
        });
        handle.addEventListener('dragend', () => {
            var _a, _b;
            element.style.opacity = '';
            handle.style.cursor = 'grab';
            /* Clean up the indicator if the drop landed outside the canvas */
            (_b = (_a = CanvasSharedState.canvasElement) === null || _a === void 0 ? void 0 : _a.querySelector('.drop-insert-indicator')) === null || _b === void 0 ? void 0 : _b.remove();
        });
        return handle;
    }
    /**
     * Creates (or reuses) the delete icon inside `controlsDiv`.
     *
     * Bug fix vs. the original "before" version: we now search inside
     * `controlsDiv` (not `element`) so we never accidentally grab an <img>
     * inside the component itself when looking for `.delete-icon`.
     */
    createDeleteIcon(element, controlsDiv) {
        let deleteIcon = controlsDiv.querySelector('.delete-icon');
        if (!deleteIcon) {
            deleteIcon = document.createElement('img');
            deleteIcon.src = this.icons.delete;
            deleteIcon.alt = 'Delete';
            deleteIcon.classList.add('delete-icon');
            deleteIcon.style.pointerEvents = 'all';
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.style.width = '16px';
            deleteIcon.style.height = '16px';
        }
        deleteIcon.onclick = e => {
            e.stopPropagation();
            this.handleDelete(element);
        };
        return deleteIcon;
    }
    /**
     * Deletes the component, updates shared state, and captures undo history.
     * Reads historyManager at call-time to avoid circular-import issues.
     */
    handleDelete(element) {
        const { historyManager, components } = CanvasSharedState;
        historyManager.captureState();
        element.remove();
        CanvasSharedState.components = components.filter(c => c !== element);
        historyManager.captureState();
        CanvasEventDispatcher.dispatchDesignChange();
        /* Reset sidebar to canvas settings after deletion */
        import('../sidebar/CustomizationSidebar').then(({ CustomizationSidebar }) => {
            CustomizationSidebar.showSidebar(CanvasSharedState.canvasElement.id);
        });
    }
}

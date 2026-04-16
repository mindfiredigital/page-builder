import { CanvasSharedState } from './CanvasCore/CanvasSharedState';
import { CanvasEventDispatcher } from './CanvasCore/CanvasEventDispatcher';

export class ComponentControlsManager {
  private icons = {
    delete:
      'https://res.cloudinary.com/dodvwsaqj/image/upload/v1737366522/delete-2-svgrepo-com_fwkzn7.svg',
  };

  /* No longer takes Canvas as constructor arg — reads shared state directly */
  constructor(_canvas?: unknown) {}

  public addControlButtons(element: HTMLElement): void {
    if (!element.style.position || element.style.position === 'static') {
      element.style.position = 'relative';
    }

    let controlsDiv = element.querySelector(
      '.component-controls'
    ) as HTMLElement;

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

      element.prepend(controlsDiv);
    }

    const deleteIcon = this.createDeleteIcon(element, controlsDiv);
    controlsDiv.appendChild(deleteIcon);
  }

  private createDeleteIcon(
    element: HTMLElement,
    controlsDiv: HTMLElement
  ): HTMLImageElement {
    let deleteIcon = controlsDiv.querySelector(
      '.delete-icon'
    ) as HTMLImageElement;

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

  private handleDelete(element: HTMLElement): void {
    /* Read historyManager at call-time, not at import-time — avoids circular dep */
    const { historyManager, components } = CanvasSharedState;

    historyManager.captureState();
    element.remove();

    CanvasSharedState.components = components.filter(c => c !== element);

    historyManager.captureState();
    CanvasEventDispatcher.dispatchDesignChange();
  }
}

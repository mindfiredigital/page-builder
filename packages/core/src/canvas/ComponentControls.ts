import { Canvas } from './Canvas';

export class ComponentControlsManager {
  private canvas: typeof Canvas;
  private icons = {
    delete:
      'https://res.cloudinary.com/dodvwsaqj/image/upload/v1737366522/delete-2-svgrepo-com_fwkzn7.svg',
  };

  constructor(canvas: typeof Canvas) {
    this.canvas = canvas;
  }

  /**
   * First check if there is already a div with class  as component-controls exists
   * Add a div for each components in which we can add control buttons
   * We have added delete button
   * NB: For image container we are using appendChild method instead of prepend since it is hampering the style.
   */
  public addControlButtons(element: HTMLElement): void {
    let ImageComponent = element.querySelector('img') as HTMLImageElement;
    let controlsDiv = element.querySelector(
      '.component-controls'
    ) as HTMLElement;
    if (!controlsDiv) {
      controlsDiv = document.createElement('div');
      controlsDiv.className = 'component-controls';
      controlsDiv.setAttribute('contenteditable', 'false');
      if (ImageComponent) {
        element.appendChild(controlsDiv);
      } else {
        element.prepend(controlsDiv);
      }
    }
    const deleteIcon = this.createDeleteIcon(element);
    controlsDiv.appendChild(deleteIcon);
  }

  /**
   * First check if there is already deleteIcon within element
   * Creating delete icon
   * Adding click event for the  delete icon
   */
  private createDeleteIcon(element: HTMLElement): HTMLImageElement {
    let deleteIcon = element.querySelector('.delete-icon') as HTMLImageElement;
    if (!deleteIcon) {
      deleteIcon = document.createElement('img');
      deleteIcon.src = this.icons.delete;
      deleteIcon.alt = 'Delete';
      deleteIcon.classList.add('delete-icon');
      element.appendChild(deleteIcon);
    }
    deleteIcon.onclick = e => {
      e.stopPropagation();
      this.handleDelete(element);
    };
    return deleteIcon;
  }

  /**
   * This function handle deletion of component
   * It captures the current state and state after deletion for undo redo functionality
   * Then removes the component from canvas
   * And updates the component list with the help of getters and setters
   */
  private handleDelete(element: HTMLElement): void {
    this.canvas.historyManager.captureState();
    element.remove();
    const updatedComponents = this.canvas
      .getComponents()
      .filter(comp => comp !== element);
    this.canvas.setComponents(updatedComponents);
    this.canvas.historyManager.captureState();
    this.canvas.dispatchDesignChange();
  }
}

export class ComponentControlsManager {
  constructor(canvas) {
    //Image imports
    this.icons = {
      delete: '/dist/icons/delete.png',
    };
    this.canvas = canvas;
  }
  /**
   * Add a div for each components in which we can add control buttons
   * We have added delete button
   */
  addControlButtons(element) {
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'component-controls';
    const deleteIcon = this.createDeleteIcon(element);
    // Append the delete icon to controlsDiv, for future we can add other buttons to this controls div
    controlsDiv.appendChild(deleteIcon);
    element.appendChild(controlsDiv);
  }
  /**
   * First check if there is already deleteIcon within element
   * Creating delete icon
   * Adding click event for the  delete icon
   */
  createDeleteIcon(element) {
    let deleteIcon = element.querySelector('.delete-icon');
    if (!deleteIcon) {
      deleteIcon = document.createElement('img');
      deleteIcon.src = this.icons.delete;
      deleteIcon.alt = 'Delete';
      deleteIcon.classList.add('delete-icon');
      element.appendChild(deleteIcon);
    }
    // Attach the click event handler
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
  handleDelete(element) {
    this.canvas.historyManager.captureState();
    element.remove();
    const updatedComponents = this.canvas
      .getComponents()
      .filter(comp => comp !== element);
    this.canvas.setComponents(updatedComponents);
    this.canvas.historyManager.captureState();
  }
}

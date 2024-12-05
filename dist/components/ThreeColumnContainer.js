import { Canvas } from '../canvas/Canvas.js';
export class ThreeColumnContainer {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('threeCol-component');
    this.element.setAttribute('draggable', 'true');
    // Create columns
    const column1 = this.createColumn('column-1');
    const column2 = this.createColumn('column-2');
    const column3 = this.createColumn('column-3');
    // Append columns to the container
    this.element.appendChild(column1);
    this.element.appendChild(column2);
    this.element.appendChild(column3);
    // Add styles
    this.addStyles();
    // Add event listeners
    this.initializeEventListeners();
  }
  createColumn(className) {
    const column = document.createElement('div');
    column.classList.add('column', className);
    column.setAttribute('draggable', 'true');
    column.style.width = '33.33%'; // Default equal width for three columns
    return column;
  }
  initializeEventListeners() {
    this.element.addEventListener('dragover', event => event.preventDefault());
    this.element.addEventListener('drop', this.onDrop.bind(this));
  }
  /**
   * Handles the drop event for three-column containers, restoring the states of dropped components
   * and ensuring that they are uniquely identified and labeled.
   *
   * This function manages:
   * - Appending the dropped component to the target column.
   * - Assigning a unique ID and class to the column and component based on the container's ID.
   * - Creating or updating labels for the column and component for easy identification.
   * - Capturing the current state in the history manager for undo/redo functionality.
   *
   */
  onDrop(event) {
    var _a;
    event.preventDefault();
    event.stopPropagation();
    const componentType =
      (_a = event.dataTransfer) === null || _a === void 0
        ? void 0
        : _a.getData('component-type');
    if (!componentType) return;
    const component = Canvas.createComponent(componentType);
    if (!component) return;
    // Determine the target column
    const targetColumn = event.target;
    // Ensure the drop is happening on a valid column
    if (targetColumn && targetColumn.classList.contains('column')) {
      // Append the dropped component to the column
      targetColumn.appendChild(component);
      // Get the parent container's ID
      const parentId = this.element.id;
      // Determine the column-specific suffix (c1, c2, or c3)
      const columnSuffix = targetColumn.classList.contains('column-1')
        ? 'c1'
        : targetColumn.classList.contains('column-2')
          ? 'c2'
          : 'c3';
      // Update the column's ID and class dynamically
      const newColumnClassName = `${parentId}-${columnSuffix}`;
      targetColumn.id = newColumnClassName;
      targetColumn.classList.add(newColumnClassName);
      // Optionally, update a visible label for the column
      let columnLabel = targetColumn.querySelector('.column-label');
      if (!columnLabel) {
        columnLabel = document.createElement('span');
        columnLabel.className = 'column-label';
        targetColumn.appendChild(columnLabel);
      }
      columnLabel.textContent = newColumnClassName;
      // Generate a unique class name for the dropped component
      const uniqueComponentClass = Canvas.generateUniqueClass(
        componentType,
        true,
        newColumnClassName
      );
      component.classList.add(uniqueComponentClass);
      component.id = uniqueComponentClass;
      // Optionally, create and update a visible label for the component
      let componentLabel = component.querySelector('.component-label');
      if (!componentLabel) {
        componentLabel = document.createElement('span');
        componentLabel.className = 'component-label';
        component.appendChild(componentLabel);
      }
      componentLabel.textContent = uniqueComponentClass;
      // Capture the state for history
      Canvas.historyManager.captureState();
    }
  }
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .threeCol-component {
          display: flex;
          width: 97%;
          min-width: 100px;
          min-height: 100px;
        }
        .column {
          flex-grow: 1;
          min-width: 50px;
          border: 1px dashed #ddd;
          padding: 10px;
          position: relative;
        }
        .column:hover {
          background: #f5f5f5;
        }
      `;
    document.head.appendChild(style);
  }
  create() {
    return this.element;
  }
}

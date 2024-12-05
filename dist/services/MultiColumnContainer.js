import { Canvas } from '../canvas/Canvas.js';
import { ImageComponent } from '../components/ImageComponent.js';
/**
 * MultiColumnContainer is a reusable container class that dynamically creates a flexible number of columns based on the specified column count.
 * It handles the creation of the container element, dynamically creates columns, sets up drag-and-drop functionality,
 * and applies necessary styles for layout. It also manages the event handling for dropping components into columns.
 */
export class MultiColumnContainer {
  constructor(columnCount, className = `${columnCount}Col-component`) {
    this.columnCount = columnCount;
    this.element = document.createElement('div');
    this.element.classList.add(className);
    this.element.setAttribute('draggable', 'true');
    // Create columns dynamically based on columnCount
    for (let i = 1; i <= columnCount; i++) {
      const column = this.createColumn(`column-${i}`);
      this.element.appendChild(column);
    }
    // Add styles
    this.addStyles(className);
    // Add event listeners
    this.initializeEventListeners();
  }
  /**
   * Creates an individual column inside the container with a given class name.
   * The column's width is dynamically adjusted based on the number of columns in the container.
   */
  createColumn(className) {
    const column = document.createElement('div');
    column.classList.add('column', className);
    column.setAttribute('draggable', 'true');
    column.style.width = `${100 / this.columnCount}%`; // Equal width for all columns
    return column;
  }
  /**
   * Initializes event listeners for the container element.
   * It listens for dragover and drop events to handle the drag-and-drop functionality.
   */
  initializeEventListeners() {
    this.element.addEventListener('dragover', event => event.preventDefault());
    this.element.addEventListener('drop', this.onDrop.bind(this));
  }
  /**
   * Handles the drop event when a component is dropped onto a column.
   * It appends the component to the target column, generates unique IDs for the component and column,
   * and updates the component and column with labels for easy identification.
   * It also captures the state in the history manager for undo/redo functionality.
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
    const targetColumn = event.target;
    if (targetColumn && targetColumn.classList.contains('column')) {
      targetColumn.appendChild(component);
      const parentId = this.element.id;
      // Determine the column-specific suffix dynamically
      const columnIndex =
        Array.from(targetColumn.parentElement.children).indexOf(targetColumn) +
        1;
      const columnSuffix = `c${columnIndex}`;
      const newColumnClassName = `${parentId}-${columnSuffix}`;
      targetColumn.id = newColumnClassName;
      targetColumn.classList.add(newColumnClassName);
      let columnLabel = targetColumn.querySelector('.column-label');
      if (!columnLabel) {
        columnLabel = document.createElement('span');
        columnLabel.className = 'column-label';
        targetColumn.appendChild(columnLabel);
      }
      columnLabel.textContent = newColumnClassName;
      const uniqueComponentClass = Canvas.generateUniqueClass(
        componentType,
        true,
        newColumnClassName
      );
      component.classList.add(uniqueComponentClass);
      component.id = uniqueComponentClass;
      let componentLabel = component.querySelector('.component-label');
      if (!componentLabel) {
        componentLabel = document.createElement('span');
        componentLabel.className = 'component-label';
        component.appendChild(componentLabel);
      }
      componentLabel.textContent = uniqueComponentClass;
      Canvas.historyManager.captureState();
    }
  }
  /**
   * Adds the required styles for the container and its columns.
   * It dynamically creates a style element and applies flexbox-based layout styles,
   * ensuring that the columns are evenly distributed and visually styled with hover effects.
   */
  addStyles(className) {
    const style = document.createElement('style');
    style.textContent = `
      .${className} {
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
  /**
   * Creates and returns the container element that holds the columns.
   * This method is called to generate the full container after the columns have been created.
   */
  create() {
    return this.element;
  }
  /**
   * Restores a column by reapplying necessary controls to the child components.
   * This includes adding control buttons, making child components draggable,
   * and restoring image uploads if the child is an image component.
   */
  static restoreColumn(column) {
    const columnChildren = column.querySelectorAll('.editable-component');
    columnChildren.forEach(child => {
      var _a;
      Canvas.controlsManager.addControlButtons(child);
      Canvas.addDraggableListeners(child);
      if (child.classList.contains('image-component')) {
        const imageSrc =
          ((_a = child.querySelector('img')) === null || _a === void 0
            ? void 0
            : _a.getAttribute('src')) || '';
        ImageComponent.restoreImageUpload(child, imageSrc);
      }
    });
  }
}

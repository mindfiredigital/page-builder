import { Canvas } from '../canvas/Canvas.js..js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js.js';
export class TwoColumnComponent {
  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('2col-component');
    this.element.setAttribute('draggable', 'true');
    // Create columns
    const column1 = this.createColumn('column-1');
    const column2 = this.createColumn('column-2');
    // Append columns to the container
    this.element.appendChild(column1);
    this.element.appendChild(column2);
    // Add styles
    this.addStyles();
    // Add event listeners
    this.initializeEventListeners();
  }
  createColumn(className) {
    const column = document.createElement('div');
    column.classList.add('column', className);
    column.setAttribute('draggable', 'true');
    column.style.width = '50%'; // Default 50% width for two columns
    return column;
  }
  initializeEventListeners() {
    this.element.addEventListener('dragover', event => event.preventDefault());
    this.element.addEventListener('drop', this.onDrop.bind(this));
  }
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
      targetColumn.appendChild(component);
      // Capture state for history
      Canvas.historyManager.captureState();
    }
  }
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .2col-component {
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

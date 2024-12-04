import { Canvas } from '../canvas/Canvas';

export class TwoColumnContainer {
  private element: HTMLElement;

  constructor() {
    this.element = document.createElement('div');
    this.element.classList.add('twoCol-component');
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

  private createColumn(className: string): HTMLElement {
    const column = document.createElement('div');
    column.classList.add('column', className);
    column.setAttribute('draggable', 'true');
    column.style.width = '50%'; // Default 50% width for two columns
    return column;
  }

  private initializeEventListeners(): void {
    this.element.addEventListener('dragover', event => event.preventDefault());
    this.element.addEventListener('drop', this.onDrop.bind(this));
  }

  /**
   * Handles the drop event when a component is dragged and dropped onto a column within the container.
   * The target column (where the component is dropped) is identified by checking if the target element contains the 'column' class.
   * If the drop occurs inside a valid column, the component is appended to that column.
   *
   * The parent container's ID is fetched from the container's element, which is the element in which the column resides.
   * Based on this ID, a unique suffix for the column is generated (either `c1` or `c2`), which ensures that the column’s
   * ID and class names remain distinct within the parent container.
   *
   * The column’s ID and class name are dynamically updated with this new suffix to maintain proper structure and avoid conflicts.
   * A visible label for the column is created or updated to reflect this new ID or class name.
   *
   * Next, a unique class name for the dropped component is generated using the `Canvas.generateUniqueClass()` method, which ensures
   * that the component's ID and class are unique within the column. This unique class name is then applied to the component.
   * A label for the component is created or updated to display its unique class name on the canvas.
   *
   * Finally, the state of the canvas is captured using `Canvas.historyManager.captureState()` to allow for undo/redo functionality.
   */

  private onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    const componentType = event.dataTransfer?.getData('component-type');
    if (!componentType) return;

    const component = Canvas.createComponent(componentType);
    if (!component) return;

    const targetColumn = event.target as HTMLElement;

    if (targetColumn && targetColumn.classList.contains('column')) {
      targetColumn.appendChild(component);

      const parentId = this.element.id;

      const columnSuffix = targetColumn.classList.contains('column-1')
        ? 'c1'
        : 'c2';

      const newColumnClassName = `${parentId}-${columnSuffix}`;
      targetColumn.id = newColumnClassName;
      targetColumn.classList.add(newColumnClassName);

      let columnLabel = targetColumn.querySelector(
        '.column-label'
      ) as HTMLSpanElement;
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

      let componentLabel = component.querySelector(
        '.component-label'
      ) as HTMLSpanElement;
      if (!componentLabel) {
        componentLabel = document.createElement('span');
        componentLabel.className = 'component-label';
        component.appendChild(componentLabel);
      }
      componentLabel.textContent = uniqueComponentClass;

      Canvas.historyManager.captureState();
    }
  }

  private addStyles(): void {
    const style = document.createElement('style');
    style.textContent = `
        .twoCol-component {
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

  public create(): HTMLElement {
    return this.element;
  }
}

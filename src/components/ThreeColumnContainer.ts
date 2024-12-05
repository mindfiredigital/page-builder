import { Canvas } from '../canvas/Canvas';

export class ThreeColumnContainer {
  private element: HTMLElement;

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

  private createColumn(className: string): HTMLElement {
    const column = document.createElement('div');
    column.classList.add('column', className);
    column.setAttribute('draggable', 'true');
    column.style.width = '33.33%'; // Default equal width for three columns
    return column;
  }

  private initializeEventListeners(): void {
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
        : targetColumn.classList.contains('column-2')
          ? 'c2'
          : 'c3';

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

  public create(): HTMLElement {
    return this.element;
  }
}

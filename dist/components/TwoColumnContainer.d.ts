export declare class TwoColumnContainer {
  private element;
  constructor();
  private createColumn;
  private initializeEventListeners;
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
  private onDrop;
  private addStyles;
  create(): HTMLElement;
  static restoreColumn(column: HTMLElement): void;
}

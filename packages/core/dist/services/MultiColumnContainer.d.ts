/**
 * MultiColumnContainer is a reusable container class that dynamically creates a flexible number of columns based on the specified column count.
 * It handles the creation of the container element, dynamically creates columns, sets up drag-and-drop functionality,
 * and applies necessary styles for layout. It also manages the event handling for dropping components into columns.
 */
export declare class MultiColumnContainer {
  protected element: HTMLElement;
  protected columnCount: number;
  constructor(columnCount: number, className?: string);
  /**
   * Creates an individual column inside the container with a given class name.
   * The column's width is dynamically adjusted based on the number of columns in the container.
   */
  private createColumn;
  /**
   * Initializes event listeners for the container element.
   * It listens for dragover and drop events to handle the drag-and-drop functionality.
   */
  private initializeEventListeners;
  /**
   * Handles the drop event when a component is dropped onto a column.
   * It appends the component to the target column, generates unique IDs for the component and column,
   * and updates the component and column with labels for easy identification.
   * It also captures the state in the history manager for undo/redo functionality.
   */
  protected onDrop(event: DragEvent): void;
  /**
   * Adds the required styles for the container and its columns.
   * It dynamically creates a style element and applies flexbox-based layout styles,
   * ensuring that the columns are evenly distributed and visually styled with hover effects.
   */
  private addStyles;
  /**
   * Creates and returns the container element that holds the columns.
   * This method is called to generate the full container after the columns have been created.
   */
  create(): HTMLElement;
  /**
   * Restores a column by reapplying necessary controls to the child components.
   * This includes adding control buttons, making child components draggable,
   * and restoring image uploads if the child is an image component.
   */
  static restoreColumn(column: HTMLElement): void;
}

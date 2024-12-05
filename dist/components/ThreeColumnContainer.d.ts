export declare class ThreeColumnContainer {
  private element;
  constructor();
  private createColumn;
  private initializeEventListeners;
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
  private onDrop;
  private addStyles;
  create(): HTMLElement;
}

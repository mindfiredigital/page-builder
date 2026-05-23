/** Handles the DragEvent fired when a new component is dropped onto the canvas */
export declare class CanvasDropHandler {
  static onDrop(event: DragEvent): void;
  /**
   * Moves an existing top-level canvas component to the position indicated
   * by the cursor.  Only canvas-level components (direct children of
   * canvasElement) are eligible; components inside containers are ignored.
   */
  private static handleReorder;
}

import { Canvas } from '../canvas/Canvas';
export declare class HistoryManager {
  private undoStack;
  private redoStack;
  private canvas;
  constructor(canvas: Canvas);
  /**
   * Capture the current state of the canvas with getState method.
   * Clears the redo stack when a new action is made.
   * Limits the undo stack size to a maximum of 20 entries.
   */
  captureState(): void;
  /**
   * Undo the last action.
   * Save the current state to the redo stack before undoing.
   * Restores the previous state if available.
   */
  undo(): void;
  /**
   * Redo the last undone action.
   * Save the current state to the undo stack before redoing.
   * Restores the next state if available.
   */
  redo(): void;
}

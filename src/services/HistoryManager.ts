import { Canvas } from '../canvas/Canvas';

export class HistoryManager {
  private undoStack: any[] = [];
  private redoStack: any[] = [];
  private canvas: Canvas;

  constructor(canvas: Canvas) {
    this.canvas = canvas;
  }

  /**
   * Capture the current state of the canvas with getState method.
   * Clears the redo stack when a new action is made.
   * Limits the undo stack size to a maximum of 20 entries.
   */
  captureState() {
    const state = Canvas.getState();

    if (state.length > 0) {
      const lastState = this.undoStack[this.undoStack.length - 1];

      // Only capture the state if it's different from the last state
      if (JSON.stringify(state) !== JSON.stringify(lastState)) {
        this.undoStack.push(state);

        // Limit the undo stack size to a maximum of 20 entries
        if (this.undoStack.length > 20) {
          this.undoStack.shift();
        }

        // Clear the redo stack as a new action is made
        this.redoStack = [];
      }
    } else {
      console.warn('No valid state to capture.');
    }
  }

  /**
   * Undo the last action.
   * Save the current state to the redo stack before undoing.
   * Restores the previous state if available.
   */
  undo() {
    if (this.undoStack.length > 1) {
      const currentState = this.undoStack.pop();
      this.redoStack.push(currentState);

      const previousState = this.undoStack[this.undoStack.length - 1];
      Canvas.restoreState(previousState);
    } else if (this.undoStack.length === 1) {
      const initialState = this.undoStack.pop();
      this.redoStack.push(initialState);

      // Load existing layout from local storage and render, if any else empty the canvas
      const savedState = Canvas.jsonStorage.load();
      savedState ? Canvas.restoreState(savedState) : Canvas.restoreState([]);
    } else {
      console.warn('No more actions to undo.');
    }
  }

  /**
   * Redo the last undone action.
   * Save the current state to the undo stack before redoing.
   * Restores the next state if available.
   */
  redo() {
    if (this.redoStack.length > 0) {
      const nextState = this.redoStack.pop();
      this.undoStack.push(nextState);

      Canvas.restoreState(nextState);
    } else {
      console.warn('No more actions to redo.');
    }
  }
}

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
    // Check if the state is not empty and not identical to the last captured state
    if (state.length > 0) {
      // Compare the current state with the last state in the undoStack
      const lastState = this.undoStack[this.undoStack.length - 1];

      if (JSON.stringify(state) !== JSON.stringify(lastState)) {
        this.undoStack.push(state);

        // Limit the undo stack size to a maximum of 20 entries
        if (this.undoStack.length > 20) {
          this.undoStack.shift();
        }

        // Clear redo stack as new action is taken
        this.redoStack = [];
      } else {
        console.log('State is the same as the last one, not capturing again.');
      }
    } else {
      console.warn('Attempted to capture an empty state');
    }
  }

  /**
   * Undo the last action.
   * Save the current state to the redo stack before undoing.
   * Restores the previous state if available.
   */
  undo() {
    if (this.undoStack.length > 1) {
      // Pop the current state and push it to the redo stack
      const currentState = this.undoStack.pop();
      this.redoStack.push(currentState);

      // Restore the last state remaining in the undoStack
      const previousState = this.undoStack[this.undoStack.length - 1];
      Canvas.restoreState(previousState);
    } else if (this.undoStack.length === 1) {
      // Clear the canvas for the last undo action
      const initialState = this.undoStack.pop();
      this.redoStack.push(initialState);

      // Clear the canvas
      Canvas.restoreState([]);
    } else {
      console.warn('No more actions to undo');
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
      this.undoStack.push(nextState); // Save current state for future undo
      Canvas.restoreState(nextState);
    } else {
      console.warn('No more actions to redo');
    }
  }
}

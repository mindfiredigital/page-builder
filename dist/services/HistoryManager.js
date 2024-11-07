export class HistoryManager {
  constructor(canvas) {
    this.undoStack = [];
    this.redoStack = [];
    this.canvas = canvas;
  }
  /**
   * Capture the current state of the canvas with getState method.
   * Clears the redo stack when a new action is made.
   * Limits the undo stack size to a maximum of 20 entries.
   */
  captureState() {
    const state = this.canvas.getState();
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
      console.log(this.undoStack);
      const currentState = this.undoStack.pop(); // Save the current state to redo stack
      this.redoStack.push(currentState);
      const previousState = this.undoStack[this.undoStack.length - 1];
      if (previousState) {
        this.canvas.restoreState(previousState);
      }
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
      this.canvas.restoreState(nextState);
    } else {
      console.warn('No more actions to redo');
    }
  }
}

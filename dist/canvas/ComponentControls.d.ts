import { Canvas } from './Canvas';
export declare class ComponentControlsManager {
  private canvas;
  private icons;
  constructor(canvas: typeof Canvas);
  /**
   * Add a div for each components in which we can add control buttons
   * We have added delete button
   */
  addControlButtons(element: HTMLElement): void;
  /**
   * Creating delete icon
   * Adding click event for the  delete icon
   */
  private createDeleteIcon;
  /**
   * This function handle deletion of component
   * It captures the current state and state after deletion for undo redo functionality
   * Then removes the component from canvas
   * And updates the component list with the help of getters and setters
   */
  private handleDelete;
}

import { HistoryManager } from '../services/HistoryManager';
import { JSONStorage } from '../services/JSONStorage';
import { ComponentControlsManager } from './ComponentControls';
export declare class Canvas {
  private static components;
  private static canvasElement;
  private static sidebarElement;
  static controlsManager: ComponentControlsManager;
  static historyManager: HistoryManager;
  static jsonStorage: JSONStorage;
  static getComponents(): HTMLElement[];
  static setComponents(components: HTMLElement[]): void;
  private static componentFactory;
  static init(): void;
  static clearCanvas(): void;
  /**
   * Generates the current state of the canvas for undo/redo purposes.
   * Maps each component into a structured object containing:
   * Type, content, position, dimensions, style, and classes.
   * @returns The array of component objects.
   */
  static getState(): {
    id: string;
    type: string;
    content: string;
    position: {
      x: number;
      y: number;
    };
    dimensions: {
      width: number;
      height: number;
    };
    style: {
      [key: string]: string;
    };
    inlineStyle: string;
    classes: string[];
    dataAttributes: {
      [key: string]: string;
    };
    imageSrc: string | null;
  }[];
  /**
   * Restores the canvas to a previous state.
   * This functions helps for undoing and redoing purpose
   * Clears the canvas. Iterates through the state and recreates components using createComponent().
   * Then restores their position, content, styles, and classes.
   * Re-adds them to the canvasElement and components array.
   * Dynamic functionalities also re-applied (e.g resize container, delete a component etc).
   */
  static restoreState(state: any): void;
  static onDrop(event: DragEvent): void;
  static reorderComponent(fromIndex: number, toIndex: number): void;
  private static reorderDOM;
  static createComponent(type: string): HTMLElement | null;
  static generateUniqueClass(
    type: string,
    isContainerComponent?: boolean,
    containerClass?: string | null
  ): string;
  /**
   * Adds drag-and-drop behavior to a component.
   * Makes the component draggable (draggable="true").
   * On dragstart:
   * -Captures initial positions and dimensions.
   * -Locks dimensions to prevent resizing during the drag.
   * On dragend:
   * -Calculates new positions based on the drag delta.
   * -Ensures the component stays within canvas boundaries then Resets dimensions and captures the new state.
   *
   */
  static addDraggableListeners(element: HTMLElement): void;
  static exportLayout(): {
    type: string;
    content: string;
  }[];
}

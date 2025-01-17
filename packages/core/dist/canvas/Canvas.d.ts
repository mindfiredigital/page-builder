import { HistoryManager } from '../services/HistoryManager';
import { JSONStorage } from '../services/JSONStorage';
import { ComponentControlsManager } from './ComponentControls';
export declare class Canvas {
  private static components;
  private static canvasElement;
  private static sidebarElement;
  static controlsManager: ComponentControlsManager;
  private static gridManager;
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
  static restoreState(state: any): void;
  static onDrop(event: DragEvent): void;
  static reorderComponent(fromIndex: number, toIndex: number): void;
  static createComponent(type: string): HTMLElement | null;
  static generateUniqueClass(
    type: string,
    isContainerComponent?: boolean,
    containerClass?: string | null
  ): string;
  static addDraggableListeners(element: HTMLElement): void;
  static exportLayout(): {
    type: string;
    content: string;
  }[];
}

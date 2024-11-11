import { HistoryManager } from '../services/HistoryManager';
export declare class Canvas {
  private static components;
  private static canvasElement;
  private static sidebarElement;
  static historyManager: HistoryManager;
  private static jsonStorage;
  private static componentFactory;
  static init(): void;
  static clearCanvas(): void;
  static getState(): {
    type: string;
    content: string;
    position: {
      x: number;
      y: number;
    };
  }[];
  static restoreState(state: any): void;
  static onDrop(event: DragEvent): void;
  static createComponent(type: string): HTMLElement | null;
  static generateUniqueClass(type: string): string;
  static addDraggableListeners(element: HTMLElement): void;
  static exportLayout(): {
    type: string;
    content: string;
  }[];
}

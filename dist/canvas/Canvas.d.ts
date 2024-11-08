import { HistoryManager } from '../services/HistoryManager';
export declare class Canvas {
  private components;
  private canvasElement;
  private sidebarElement;
  private static componentCounters;
  historyManager: HistoryManager;
  private static componentFactory;
  constructor();
  getState(): {
    type: string;
    content: string;
  }[];
  restoreState(state: any): void;
  init(): void;
  onDrop(event: DragEvent): void;
  static createComponent(type: string): HTMLElement | null;
  static generateUniqueClass(type: string): string;
  exportLayout(): {
    type: string;
    content: string;
  }[];
}

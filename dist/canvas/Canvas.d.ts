import { HistoryManager } from '../services/HistoryManager';
export declare class Canvas {
  private components;
  private canvasElement;
  private sidebarElement;
  private componentCounters;
  historyManager: HistoryManager;
  private jsonStorage;
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
  generateUniqueClass(type: string): string;
  exportLayout(): {
    type: string;
    content: string;
  }[];
}

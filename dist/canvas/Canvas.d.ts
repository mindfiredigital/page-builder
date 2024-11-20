import { HistoryManager } from '../services/HistoryManager';
export declare class Canvas {
  private static components;
  private static canvasElement;
  private static sidebarElement;
  private static controlsManager;
  static historyManager: HistoryManager;
  private static jsonStorage;
  static getComponents(): HTMLElement[];
  static setComponents(components: HTMLElement[]): void;
  private static componentFactory;
  static init(): void;
  static clearCanvas(): void;
  static getState(): {
    type: string;
    content: string;
  }[];
  static restoreState(state: any): void;
  static onDrop(event: DragEvent): void;
  static createComponent(type: string): HTMLElement | null;
  static generateUniqueClass(
    type: string,
    isContainerComponent?: boolean,
    containerClass?: string | null
  ): string;
  static exportLayout(): {
    type: string;
    content: string;
  }[];
}

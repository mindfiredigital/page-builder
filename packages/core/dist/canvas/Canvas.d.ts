import { HistoryManager } from '../services/HistoryManager';
import { JSONStorage } from '../services/JSONStorage';
import { ComponentControlsManager } from './ComponentControls';
export declare class Canvas {
  private static components;
  private static canvasElement;
  private static sidebarElement;
  static controlsManager: ComponentControlsManager;
  private static gridManager;
  private static editable;
  static historyManager: HistoryManager;
  static jsonStorage: JSONStorage;
  static lastCanvasWidth: number | null;
  private static tableAttributeConfig;
  private static textAttributeConfig;
  private static headerAttributeConfig;
  private static ImageAttributeConfig;
  static getComponents(): HTMLElement[];
  static setComponents(components: HTMLElement[]): void;
  private static componentFactory;
  static init(
    initialData: (PageBuilderDesign | null) | undefined,
    editable: boolean | null,
    basicComponentsConfig: BasicComponent
  ): void;
  /**
   * Dispatches a custom event indicating that the canvas design has changed.
   * The event detail contains the current design state.
   */
  static dispatchDesignChange(): void;
  static clearCanvas(): void;
  static getState(): PageBuilderDesign;
  static restoreState(state: any): void;
  static onDrop(event: DragEvent): void;
  static reorderComponent(fromIndex: number, toIndex: number): void;
  static createComponent(
    type: string,
    customSettings?: string | null,
    props?: string
  ): HTMLElement | null;
  static generateUniqueClass(
    type: string,
    isContainerComponent?: boolean,
    containerClass?: string | null
  ): string;
  static addDraggableListeners(element: HTMLElement): void;
}

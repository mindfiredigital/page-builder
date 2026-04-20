import type { LayoutMode } from './CanvasCore/CanvasTypes';
export declare class Canvas {
  static get controlsManager(): import('./ComponentControls').ComponentControlsManager;
  static get historyManager(): import('../services/HistoryManager').HistoryManager;
  static get jsonStorage(): import('../services/JSONStorage').JSONStorage;
  static get layoutMode(): LayoutMode;
  static get lastCanvasWidth(): number | null;
  static set lastCanvasWidth(v: number | null);
  static getComponents(): HTMLElement[];
  static setComponents(components: HTMLElement[]): void;
  static init(
    initialData: (PageBuilderDesign | null) | undefined,
    editable: boolean | null,
    basicComponentsConfig: BasicComponent[],
    layoutMode: LayoutMode
  ): void;
  static dispatchDesignChange(): void;
  static clearCanvas(): void;
  static getState(): PageBuilderDesign;
  static restoreState(state: PageBuilderDesign): void;
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

import type { LayoutMode } from './CanvasTypes';
import type { HistoryManager } from '../../services/HistoryManager';
import type { JSONStorage } from '../../services/JSONStorage';
import type { ComponentControlsManager } from '../ComponentControls';
import type { GridManager } from '../GridManager';
export declare class CanvasSharedState {
  static components: HTMLElement[];
  static canvasElement: HTMLElement;
  static sidebarElement: HTMLElement;
  static controlsManager: ComponentControlsManager;
  static gridManager: GridManager;
  static editable: boolean | null;
  static layoutMode: LayoutMode;
  static lastCanvasWidth: number | null;
  static historyManager: HistoryManager;
  static jsonStorage: JSONStorage;
  static tableAttributeConfig: ComponentAttribute[] | undefined;
  static textAttributeConfig: ComponentAttribute[] | undefined;
  static headerAttributeConfig: ComponentAttribute[] | undefined;
  static ImageAttributeConfig: Function | undefined;
}

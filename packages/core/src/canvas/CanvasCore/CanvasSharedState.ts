import type { HistoryManager } from '../../services/HistoryManager';
import type { JSONStorage } from '../../services/JSONStorage';
import type { ComponentControlsManager } from '../ComponentControls';
import type { GridManager } from '../GridManager';

/* Central shared state container — all Canvas modules read/write through here */
export class CanvasSharedState {
  public static components: HTMLElement[] = [];
  public static canvasElement: HTMLElement;
  public static sidebarElement: HTMLElement;
  public static controlsManager: ComponentControlsManager;
  public static gridManager: GridManager;
  public static editable: boolean | null = null;
  public static layoutMode: LayoutMode;
  public static lastCanvasWidth: number | null = null;
  public static historyManager: HistoryManager;
  public static jsonStorage: JSONStorage;

  /* Attribute configs forwarded from basicComponentsConfig during init */
  public static tableAttributeConfig: ComponentAttribute[] | undefined;
  public static textAttributeConfig: ComponentAttribute[] | undefined;
  public static headerAttributeConfig: ComponentAttribute[] | undefined;
  public static ImageAttributeConfig: Function | undefined;
}

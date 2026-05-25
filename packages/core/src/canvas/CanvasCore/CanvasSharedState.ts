import type { HistoryManager } from '../../services/HistoryManager';
import type { JSONStorage } from '../../services/JSONStorage';
import type { ComponentControlsManager } from '../ComponentControls';
import type { GridManager } from '../GridManager';

/* Central shared state container — all Canvas modules read/write through here */
export class CanvasSharedState {
  /**
   * Ensures there is always a buffer of empty droppable space at the bottom
   * of the canvas. Works in both layout modes:
   *
   *  • Grid mode   — components are in flow; the spacer sits after the last
   *                  component and is always 300 px tall.
   *  • Absolute    — components have position:absolute and don't grow scroll
   *                  height; the spacer height = lowest component edge + 300 px
   *                  so the user can always scroll down and drop more content.
   *
   * The spacer is invisible and pointer-events:none so it never interferes
   * with normal interactions. It is stripped from HTML/PDF exports via
   * EDITOR_NODES_SELECTOR (#canvas-scroll-spacer).
   */
  public static updateCanvasScrollSpace(): void {
    const canvasEl = CanvasSharedState.canvasElement;
    if (!canvasEl) return;

    const SPACER_ID = 'canvas-scroll-spacer';
    const BUFFER = 300;

    let spacer = canvasEl.querySelector<HTMLElement>(`#${SPACER_ID}`);
    if (!spacer) {
      spacer = document.createElement('div');
      spacer.id = SPACER_ID;
      spacer.style.cssText =
        'position:static;pointer-events:none;visibility:hidden;width:1px;flex-shrink:0;';
    }
    /* Always keep spacer as the very last child */
    canvasEl.appendChild(spacer);

    if (CanvasSharedState.layoutMode === 'absolute') {
      let maxBottom = 0;
      Array.from(canvasEl.children).forEach(child => {
        if ((child as HTMLElement).id === SPACER_ID) return;
        const el = child as HTMLElement;
        if (window.getComputedStyle(el).position === 'absolute') {
          maxBottom = Math.max(maxBottom, el.offsetTop + el.offsetHeight);
        }
      });
      spacer.style.height = `${Math.max(canvasEl.clientHeight, maxBottom) + BUFFER}px`;
    } else {
      /* Grid mode: fixed 300 px buffer below the last in-flow component */
      spacer.style.height = `${BUFFER}px`;
    }
  }

  /** @deprecated use updateCanvasScrollSpace */
  public static expandCanvasForAbsoluteMode(): void {
    CanvasSharedState.updateCanvasScrollSpace();
  }

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

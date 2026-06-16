import type { HistoryManager } from '../../services/HistoryManager';
import type { JSONStorage } from '../../services/JSONStorage';
import type { ComponentControlsManager } from '../ComponentControls';
import type { GridManager } from '../GridManager';
export declare class CanvasSharedState {
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
    static updateCanvasScrollSpace(): void;
    /** @deprecated use updateCanvasScrollSpace */
    static expandCanvasForAbsoluteMode(): void;
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

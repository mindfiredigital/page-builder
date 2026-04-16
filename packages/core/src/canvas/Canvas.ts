/**
 * Canvas.ts — Public facade
 *
 * All logic has been extracted into focused modules under /CanvasCore/.
 * This file re-exports a unified Canvas class so that existing import sites
 * (e.g. `import { Canvas } from './Canvas'`) continue to work without change.
 *
 * Module map:
 *  CanvasSharedState     → mutable singleton (components[], canvasElement, etc.)
 *  CanvasInitializer     → init() bootstrap
 *  CanvasStateManager    → getState() / restoreState()
 *  CanvasEventDispatcher → dispatchDesignChange() + event wiring
 *  CanvasComponentFactory→ createComponent() / generateUniqueClass()
 *  CanvasDragHandler     → addDraggableListeners()
 *  CanvasDropHandler     → onDrop()
 */

import { CanvasSharedState } from './CanvasCore/CanvasSharedState';
import { CanvasInitializer } from './CanvasCore/CanvasInitializer';
import { CanvasStateManager } from './CanvasCore/CanvasStateManager';
import { CanvasEventDispatcher } from './CanvasCore/CanvasEventDispatcher';
import { CanvasComponentFactory } from './CanvasCore/CanvasComponentFactory';
import { CanvasDragHandler } from './CanvasCore/CanvasDragHandler';
import { CanvasDropHandler } from './CanvasCore/CanvasDropHandler';

import type { LayoutMode } from './CanvasCore/CanvasTypes';

export class Canvas {
  /* ── Accessors for shared state (keep backward-compat public API) ────── */

  public static get controlsManager() {
    return CanvasSharedState.controlsManager;
  }
  public static get historyManager() {
    return CanvasSharedState.historyManager;
  }
  public static get jsonStorage() {
    return CanvasSharedState.jsonStorage;
  }
  public static get layoutMode() {
    return CanvasSharedState.layoutMode;
  }
  public static get lastCanvasWidth() {
    return CanvasSharedState.lastCanvasWidth;
  }

  public static set lastCanvasWidth(v: number | null) {
    CanvasSharedState.lastCanvasWidth = v;
  }

  /* ── Component list helpers ──────────────────────────────────────────── */

  public static getComponents(): HTMLElement[] {
    return CanvasSharedState.components;
  }

  public static setComponents(components: HTMLElement[]): void {
    CanvasSharedState.components = components;
  }

  /* ── Lifecycle ───────────────────────────────────────────────────────── */

  static init(
    initialData: PageBuilderDesign | null = null,
    editable: boolean | null,
    basicComponentsConfig: BasicComponent[],
    layoutMode: LayoutMode
  ): void {
    CanvasInitializer.init(
      initialData,
      editable,
      basicComponentsConfig,
      layoutMode
    );
  }

  /* ── Design change / persistence ────────────────────────────────────── */

  static dispatchDesignChange(): void {
    CanvasEventDispatcher.dispatchDesignChange();
  }

  /* ── Canvas-level operations ─────────────────────────────────────────── */

  static clearCanvas(): void {
    CanvasSharedState.canvasElement.innerHTML = '';
    CanvasSharedState.components = [];
    CanvasSharedState.historyManager.captureState();

    /* Re-initialise drop preview after clearing (called twice intentionally — matches original) */
    CanvasSharedState.gridManager.initializeDropPreview(
      CanvasSharedState.canvasElement
    );
    CanvasSharedState.gridManager.initializeDropPreview(
      CanvasSharedState.canvasElement
    );

    CanvasEventDispatcher.dispatchDesignChange();
  }

  /* ── State serialisation ─────────────────────────────────────────────── */

  static getState(): PageBuilderDesign {
    return CanvasStateManager.getState();
  }

  static restoreState(state: any): void {
    CanvasStateManager.restoreState(state);
  }

  /* ── Drop handler ────────────────────────────────────────────────────── */

  static onDrop(event: DragEvent): void {
    CanvasDropHandler.onDrop(event);
  }

  /* ── Component reordering ────────────────────────────────────────────── */

  public static reorderComponent(fromIndex: number, toIndex: number): void {
    const { components } = CanvasSharedState;

    if (
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= components.length ||
      toIndex >= components.length
    ) {
      console.error('Invalid indices for reordering');
      return;
    }

    const [movedComponent] = components.splice(fromIndex, 1);
    components.splice(toIndex, 0, movedComponent);

    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
      canvasContainer.innerHTML = '';
      components.forEach(component => canvasContainer.appendChild(component));
    }

    CanvasSharedState.historyManager.captureState();
    CanvasEventDispatcher.dispatchDesignChange();
  }

  /* ── Component creation helpers ──────────────────────────────────────── */

  static createComponent(
    type: string,
    customSettings: string | null = null,
    props?: string
  ): HTMLElement | null {
    return CanvasComponentFactory.createComponent(type, customSettings, props);
  }

  static generateUniqueClass(
    type: string,
    isContainerComponent: boolean = false,
    containerClass: string | null = null
  ): string {
    return CanvasComponentFactory.generateUniqueClass(
      type,
      isContainerComponent,
      containerClass
    );
  }

  /* ── Drag helpers ────────────────────────────────────────────────────── */

  static addDraggableListeners(element: HTMLElement): void {
    CanvasDragHandler.addDraggableListeners(element);
  }
}

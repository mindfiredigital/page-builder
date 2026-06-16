/**
 * Canvas.ts — Public facade
 *
 * All logic has been extracted into focused modules under /CanvasCore/.
 * This file re-exports a unified Canvas class so that existing import sites
 * (e.g. `import { Canvas } from './Canvas.js'`) continue to work without change.
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
import { CanvasSharedState } from './CanvasCore/CanvasSharedState.js';
import { CanvasInitializer } from './CanvasCore/CanvasInitializer.js';
import { CanvasStateManager } from './CanvasCore/CanvasStateManager.js';
import { CanvasEventDispatcher } from './CanvasCore/CanvasEventDispatcher.js';
import { CanvasComponentFactory } from './CanvasCore/CanvasComponentFactory.js';
import { CanvasDragHandler } from './CanvasCore/CanvasDragHandler.js';
import { CanvasDropHandler } from './CanvasCore/CanvasDropHandler.js';
export class Canvas {
    /* ── Accessors for shared state ──────────────────────────────────────── */
    static get controlsManager() {
        return CanvasSharedState.controlsManager;
    }
    static get historyManager() {
        return CanvasSharedState.historyManager;
    }
    static get jsonStorage() {
        return CanvasSharedState.jsonStorage;
    }
    static get layoutMode() {
        return CanvasSharedState.layoutMode;
    }
    static get lastCanvasWidth() {
        return CanvasSharedState.lastCanvasWidth;
    }
    static set lastCanvasWidth(v) {
        CanvasSharedState.lastCanvasWidth = v;
    }
    /* ── Component list helpers ──────────────────────────────────────────── */
    static getComponents() {
        return CanvasSharedState.components;
    }
    static setComponents(components) {
        CanvasSharedState.components = components;
    }
    /* ── Lifecycle ───────────────────────────────────────────────────────── */
    static init(initialData = null, editable, basicComponentsConfig, layoutMode) {
        CanvasInitializer.init(initialData, editable, basicComponentsConfig, layoutMode);
    }
    /* ── Design change / persistence ────────────────────────────────────── */
    static dispatchDesignChange() {
        CanvasEventDispatcher.dispatchDesignChange();
    }
    /* ── Canvas-level operations ─────────────────────────────────────────── */
    static clearCanvas() {
        CanvasSharedState.canvasElement.innerHTML = '';
        CanvasSharedState.components = [];
        CanvasSharedState.historyManager.captureState();
        CanvasSharedState.gridManager.initializeDropPreview(CanvasSharedState.canvasElement);
        CanvasSharedState.gridManager.initializeDropPreview(CanvasSharedState.canvasElement);
        CanvasEventDispatcher.dispatchDesignChange();
    }
    /* ── State serialisation ─────────────────────────────────────────────── */
    static getState() {
        return CanvasStateManager.getState();
    }
    static restoreState(state) {
        CanvasStateManager.restoreState(state);
    }
    /* ── Drop handler ────────────────────────────────────────────────────── */
    static onDrop(event) {
        CanvasDropHandler.onDrop(event);
    }
    /* ── Component reordering ────────────────────────────────────────────── */
    static reorderComponent(fromIndex, toIndex) {
        const { components } = CanvasSharedState;
        if (fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= components.length ||
            toIndex >= components.length) {
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
    static createComponent(type, customSettings = null, props) {
        return CanvasComponentFactory.createComponent(type, customSettings, props);
    }
    static generateUniqueClass(type, isContainerComponent = false, containerClass = null) {
        return CanvasComponentFactory.generateUniqueClass(type, isContainerComponent, containerClass);
    }
    /* ── Drag helpers ────────────────────────────────────────────────────── */
    static addDraggableListeners(element) {
        CanvasDragHandler.addDraggableListeners(element);
    }
}

import { CanvasSharedState } from './CanvasSharedState.js';
import { CanvasStateManager } from './CanvasStateManager.js';
import { CanvasEventDispatcher } from './CanvasEventDispatcher.js';
import { CanvasDropHandler } from './CanvasDropHandler.js';
import { HistoryManager } from '../../services/HistoryManager.js';
import { JSONStorage } from '../../services/JSONStorage.js';
import { ComponentControlsManager } from '../ComponentControls.js';
import { GridManager } from '../GridManager.js';
import { DragDropManager } from '../DragDropManager.js';
import { DeleteElementHandler } from '../DeleteElement.js';
/* Bootstraps every sub-system; called once at application startup */
export class CanvasInitializer {
  static init(initialData = null, editable, basicComponentsConfig, layoutMode) {
    /* --- Populate shared state before any other module touches it --- */
    CanvasSharedState.editable = editable;
    CanvasSharedState.layoutMode = layoutMode;
    /* Extract per-component attribute configs from the host app's config array */
    CanvasInitializer.applyComponentConfigs(basicComponentsConfig);
    /* Resolve DOM anchors */
    CanvasSharedState.canvasElement = document.getElementById('canvas');
    CanvasSharedState.sidebarElement = document.getElementById('sidebar');
    const { canvasElement, sidebarElement } = CanvasSharedState;
    /* Toggle printable-layout class based on mode */
    if (canvasElement) {
      if (layoutMode === 'absolute') {
        canvasElement.classList.add('preview-printable');
      } else {
        canvasElement.classList.remove('preview-printable');
      }
    }
    /* Wire up global event listeners */
    CanvasEventDispatcher.attachTableDesignListener();
    CanvasEventDispatcher.attachDropListeners(
      CanvasDropHandler.onDrop.bind(CanvasDropHandler)
    );
    CanvasEventDispatcher.attachClickListeners(target => {
      CanvasInitializer.deleteElementHandler.selectElement(target);
    });
    /* Apply grid class and default positioning */
    canvasElement.classList.add('preview-desktop');
    if (layoutMode === 'grid')
      canvasElement.classList.add('grid-layout-active');
    canvasElement.style.position = 'relative';
    /* Initialise services */
    CanvasSharedState.lastCanvasWidth = canvasElement.offsetWidth;
    CanvasSharedState.historyManager = new HistoryManager(canvasElement);
    CanvasSharedState.jsonStorage = new JSONStorage();
    CanvasSharedState.controlsManager = new ComponentControlsManager(
      /* Canvas class reference is passed in to avoid a circular import */
      { getComponents: () => CanvasSharedState.components }
    );
    /* Grid drop-preview overlay */
    CanvasSharedState.gridManager = new GridManager();
    CanvasSharedState.gridManager.initializeDropPreview(canvasElement);
    /* Sidebar ↔ canvas drag-and-drop bridge */
    const dragDropManager = new DragDropManager(canvasElement, sidebarElement);
    dragDropManager.enable();
    /* Restore state: prefer explicitly passed data, then localStorage fallback */
    if (initialData) {
      CanvasStateManager.restoreState(initialData);
    } else {
      const savedState = CanvasSharedState.jsonStorage.load();
      if (savedState) CanvasStateManager.restoreState(savedState);
    }
  }
  /* Pull attribute configs for built-in component types out of the host config */
  static applyComponentConfigs(basicComponentsConfig) {
    var _a, _b, _c, _d;
    const find = name => basicComponentsConfig.find(c => c.name === name);
    CanvasSharedState.tableAttributeConfig =
      (_a = find('table')) === null || _a === void 0 ? void 0 : _a.attributes;
    CanvasSharedState.textAttributeConfig =
      (_b = find('text')) === null || _b === void 0 ? void 0 : _b.attributes;
    CanvasSharedState.headerAttributeConfig =
      (_c = find('header')) === null || _c === void 0 ? void 0 : _c.attributes;
    CanvasSharedState.ImageAttributeConfig =
      (_d = find('image')) === null || _d === void 0
        ? void 0
        : _d.globalExecuteFunction;
  }
}
CanvasInitializer.deleteElementHandler = new DeleteElementHandler();

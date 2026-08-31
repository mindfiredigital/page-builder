import { CanvasSharedState } from './CanvasSharedState';
import { CanvasStateManager } from './CanvasStateManager';
import { CanvasEventDispatcher } from './CanvasEventDispatcher';
import { CanvasDropHandler } from './CanvasDropHandler';

import { HistoryManager } from '../../services/HistoryManager';
import { JSONStorage } from '../../services/JSONStorage';
import { ComponentControlsManager } from '../ComponentControls';
import { GridManager } from '../GridManager';
import { DragDropManager } from '../DragDropManager';
import { DeleteElementHandler } from '../DeleteElement';

/* Bootstraps every sub-system; called once at application startup */
export class CanvasInitializer {
  private static deleteElementHandler = new DeleteElementHandler();

  static init(
    initialData: PageBuilderDesign | null = null,
    editable: boolean | null,
    basicComponentsConfig: BasicComponent[],
    layoutMode: LayoutMode
  ): void {
    /* --- Populate shared state before any other module touches it --- */
    CanvasSharedState.editable = editable;
    CanvasSharedState.layoutMode = layoutMode;

    /* Extract per-component attribute configs from the host app's config array */
    CanvasInitializer.applyComponentConfigs(basicComponentsConfig);

    /* Resolve DOM anchors */
    CanvasSharedState.canvasElement = document.getElementById('canvas')!;
    CanvasSharedState.sidebarElement = document.getElementById('sidebar')!;

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
      canvasElement
    );

    /* Grid drop-preview overlay */
    CanvasSharedState.gridManager = new GridManager();
    CanvasSharedState.gridManager.initializeDropPreview(
      canvasElement,
      layoutMode
    );

    /* Sidebar ↔ canvas drag-and-drop bridge */
    const dragDropManager = new DragDropManager(canvasElement, sidebarElement);
    dragDropManager.enable();

    /* Restore state: prefer explicitly passed data, then localStorage fallback */
    if (initialData) {
      CanvasStateManager.restoreState(initialData);
    } else {
      const savedState = CanvasSharedState.jsonStorage.load();
      if (savedState) {
        CanvasStateManager.restoreState(savedState);
      } else {
        /* Empty canvas — still add the scroll buffer so there's room to drop */
        CanvasSharedState.updateCanvasScrollSpace();
      }
    }
  }

  /* Pull attribute configs for built-in component types out of the host config */
  private static applyComponentConfigs(
    basicComponentsConfig: BasicComponent[]
  ): void {
    const find = (name: string) =>
      basicComponentsConfig.find(c => c.name === name);

    CanvasSharedState.tableAttributeConfig = find('table')?.attributes;
    CanvasSharedState.textAttributeConfig = find('text')?.attributes;
    CanvasSharedState.headerAttributeConfig = find('header')?.attributes;
    CanvasSharedState.ImageAttributeConfig = find('image')
      ?.globalExecuteFunction as
      | ((base64String: string) => Promise<{ url: string }>)
      | undefined;
  }
}

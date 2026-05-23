import { CanvasSharedState } from './CanvasSharedState.js';
import { CanvasComponentFactory } from './CanvasComponentFactory.js';
import { CanvasEventDispatcher } from './CanvasEventDispatcher.js';
import { CanvasDragHandler } from './CanvasDragHandler.js';
/** Handles the DragEvent fired when a new component is dropped onto the canvas */
export class CanvasDropHandler {
  static onDrop(event) {
    var _a, _b, _c;
    event.preventDefault();
    const target = event.target;
    const { canvasElement, layoutMode, components, historyManager } =
      CanvasSharedState;
    /** Containers handle their own drop logic — bail out early */
    if (
      target.classList.contains('container-component') ||
      target.closest('.container-component')
    ) {
      return;
    }
    const componentType =
      (_a = event.dataTransfer) === null || _a === void 0
        ? void 0
        : _a.getData('component-type');
    let customSettings =
      (_b = event.dataTransfer) === null || _b === void 0
        ? void 0
        : _b.getData('custom-settings');
    if (!componentType) return;
    /** If no custom settings in the transfer, fall back to globally registered config */
    if (!customSettings || customSettings.trim() === '') {
      const draggableElement = document.querySelector(
        `[data-component="${componentType}"]`
      );
      if (draggableElement) {
        const customComponents = window.customComponents;
        if (
          (_c =
            customComponents === null || customComponents === void 0
              ? void 0
              : customComponents[componentType]) === null || _c === void 0
            ? void 0
            : _c.settings
        ) {
          customSettings = JSON.stringify(
            customComponents[componentType].settings
          );
        }
      }
    }
    /** Grid snapping: resolve the drop to the nearest grid-corner position */
    const { gridX, gridY } =
      CanvasSharedState.gridManager.mousePositionAtGridCorner(
        event,
        canvasElement
      );
    /** Printable mode: prevent drops inside the margin gutter */
    if (
      layoutMode === 'absolute' &&
      canvasElement.classList.contains('preview-printable')
    ) {
      const style = window.getComputedStyle(canvasElement);
      const paddingTop = parseFloat(style.paddingTop);
      const paddingRight = parseFloat(style.paddingRight);
      const paddingLeft = parseFloat(style.paddingLeft);
      const MIN_COMPONENT_WIDTH = 100;
      const innerContentRightX =
        canvasElement.offsetWidth - paddingRight - MIN_COMPONENT_WIDTH;
      if (
        gridX < paddingLeft ||
        gridY < paddingTop ||
        gridX > innerContentRightX
      ) {
        console.warn('Component dropped into margin area. Drop prevented.');
        canvasElement.classList.add('container-highlight');
        setTimeout(
          () => canvasElement.classList.remove('container-highlight'),
          300
        );
        return;
      }
    }
    const component = CanvasComponentFactory.createComponent(
      componentType,
      customSettings
    );
    if (component && CanvasSharedState.editable !== false) {
      const uniqueClass =
        CanvasComponentFactory.generateUniqueClass(componentType);
      component.id = uniqueClass;
      component.classList.add(uniqueClass);
      if (layoutMode === 'absolute') {
        component.style.position = 'absolute';
        /** Containers use raw offsetY; leaf components snap to the grid */
        if (['container', 'twoCol', 'threeCol'].includes(componentType)) {
          component.style.top = `${event.offsetY}px`;
        } else {
          component.style.left = `${gridX}px`;
          component.style.top = `${gridY}px`;
        }
        CanvasDragHandler.addDraggableListeners(component);
      } else if (layoutMode === 'grid') {
        /** Grid mode: remove absolute positioning and disable HTML5 drag */
        component.style.position = '';
        if (component.hasAttribute('draggable')) {
          component.removeAttribute('draggable');
          component.style.cursor = 'default';
        }
      }
      /* Mark top-level containers with depth=0 for depth-based colour theming */
      if (['container', 'twoCol', 'threeCol'].includes(componentType)) {
        component.setAttribute('data-depth', '0');
      }
      components.push(component);
      canvasElement.appendChild(component);
      /* Set a stable initial width so the sidebar always shows a consistent
               value regardless of whether sidebars are open or closed.
               Without this, block elements show offsetWidth (which fluctuates with
               canvas size) instead of an explicit percentage. */
      if (!component.style.width) {
        const computedDisplay = window.getComputedStyle(component).display;
        if (computedDisplay === 'block') {
          component.style.width =
            layoutMode === 'grid' ? '100%' : `${canvasElement.offsetWidth}px`;
        }
      }
      historyManager.captureState();
      /* Auto-switch the sidebar to the newly dropped component */
      import('../../sidebar/CustomizationSidebar').then(
        ({ CustomizationSidebar }) => {
          CustomizationSidebar.showSidebar(component.id);
        }
      );
    }
    CanvasEventDispatcher.dispatchDesignChange();
  }
}

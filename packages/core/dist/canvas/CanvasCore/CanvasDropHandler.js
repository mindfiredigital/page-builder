import { CanvasSharedState } from './CanvasSharedState.js';
import { CanvasComponentFactory } from './CanvasComponentFactory.js';
import { CanvasEventDispatcher } from './CanvasEventDispatcher.js';
import { CanvasDragHandler } from './CanvasDragHandler.js';
/* Handles the DragEvent fired when a new component is dropped onto the canvas */
export class CanvasDropHandler {
  static onDrop(event) {
    var _a, _b;
    event.preventDefault();
    const target = event.target;
    const { canvasElement, layoutMode, components, historyManager } =
      CanvasSharedState;
    /* Containers handle their own drop logic — bail out early */
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
    /* If no custom settings in the transfer, fall back to globally registered config */
    if (!customSettings || customSettings.trim() === '') {
      const draggableElement = document.querySelector(
        `[data-component="${componentType}"]`
      );
      if (draggableElement) {
        if (window.customComponents && window.customComponents[componentType]) {
          const componentConfig = window.customComponents[componentType];
          if (componentConfig.settings) {
            customSettings = JSON.stringify(componentConfig.settings);
          }
        }
      }
    }
    /* Grid snapping: resolve the drop to the nearest grid-corner position */
    const { gridX, gridY } =
      CanvasSharedState.gridManager.mousePositionAtGridCorner(
        event,
        canvasElement
      );
    /* Printable mode: prevent drops inside the margin gutter */
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
        /* Drop landed in margin — flash visual feedback and abort */
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
        /* Containers use raw offsetY; leaf components snap to the grid */
        if (['container', 'twoCol', 'threeCol'].includes(componentType)) {
          component.style.top = `${event.offsetY}px`;
        } else {
          component.style.left = `${gridX}px`;
          component.style.top = `${gridY}px`;
        }
        CanvasDragHandler.addDraggableListeners(component);
      } else if (layoutMode === 'grid') {
        /* Grid mode: remove absolute positioning and disable HTML5 drag */
        component.style.position = '';
        if (component.hasAttribute('draggable')) {
          component.removeAttribute('draggable');
          component.style.cursor = 'default';
        }
      }
      components.push(component);
      canvasElement.appendChild(component);
      historyManager.captureState();
    }
    CanvasEventDispatcher.dispatchDesignChange();
  }
}

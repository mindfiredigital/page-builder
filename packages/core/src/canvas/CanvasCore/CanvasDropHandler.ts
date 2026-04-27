import { CanvasSharedState } from './CanvasSharedState';
import { CanvasComponentFactory } from './CanvasComponentFactory';
import { CanvasEventDispatcher } from './CanvasEventDispatcher';
import { CanvasDragHandler } from './CanvasDragHandler';

/** Handles the DragEvent fired when a new component is dropped onto the canvas */
export class CanvasDropHandler {
  static onDrop(event: DragEvent): void {
    event.preventDefault();

    const target = event.target as HTMLElement;
    const { canvasElement, layoutMode, components, historyManager } =
      CanvasSharedState;

    /** Containers handle their own drop logic — bail out early */
    if (
      target.classList.contains('container-component') ||
      target.closest('.container-component')
    ) {
      return;
    }

    const componentType = event.dataTransfer?.getData('component-type');
    let customSettings = event.dataTransfer?.getData('custom-settings');

    if (!componentType) return;

    /** If no custom settings in the transfer, fall back to globally registered config */
    if (!customSettings || customSettings.trim() === '') {
      const draggableElement = document.querySelector(
        `[data-component="${componentType}"]`
      );
      if (draggableElement) {
        const customComponents = (
          window as Window & {
            customComponents?: Record<string, CustomComponentEntry>;
          }
        ).customComponents;
        if (customComponents?.[componentType]?.settings) {
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
    }

    CanvasEventDispatcher.dispatchDesignChange();
  }
}

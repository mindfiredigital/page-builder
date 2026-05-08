import { CanvasSharedState } from './CanvasSharedState';
import { CanvasStateManager } from './CanvasStateManager';

/* Handles all custom event dispatching originating from the canvas */
export class CanvasEventDispatcher {
  /* Fires 'design-change' with the current state and persists to JSONStorage */
  static dispatchDesignChange(): void {
    const { canvasElement, editable, jsonStorage } = CanvasSharedState;

    if (canvasElement && editable !== false) {
      const currentDesign = CanvasStateManager.getState();

      /* Bubble the design change up through the shadow DOM if needed */
      const event = new CustomEvent('design-change', {
        detail: currentDesign,
        bubbles: true,
        composed: true,
      });

      canvasElement.dispatchEvent(event);
      jsonStorage.save(currentDesign);
    }
  }

  /* Attach the global table-design-change listener on the window */
  static attachTableDesignListener(): void {
    window.addEventListener('table-design-change', () => {
      CanvasEventDispatcher.dispatchDesignChange();
    });
  }

  /* Attach drop + dragover listeners to the canvas element */
  static attachDropListeners(onDrop: (event: DragEvent) => void): void {
    const { canvasElement } = CanvasSharedState;

    canvasElement.addEventListener('drop', onDrop);
    canvasElement.addEventListener('dragover', event => event.preventDefault());
  }

  /* Attach click-to-select and click-to-show-sidebar listeners */
  static attachClickListeners(
    onSelectElement: (target: HTMLElement) => void
  ): void {
    const { canvasElement } = CanvasSharedState;

    /* Deselect previously selected component on any canvas click */
    canvasElement.addEventListener('click', (event: MouseEvent) => {
      const selected = document.querySelector('.editable-component.selected');
      if (selected) {
        selected.classList.remove('selected');
      }

      const target = event.target as HTMLElement;
      if (target !== canvasElement) {
        onSelectElement(target);
      }
    });

    /* Show customisation sidebar for the clicked component.
       Walk up from the raw click target to the nearest editable component
       so that clicks on child elements (e.g. <video> player, <img> after
       upload) correctly resolve to the component container's id. */
    canvasElement.addEventListener('click', (event: MouseEvent) => {
      let target = event.target as HTMLElement | null;

      while (
        target &&
        target !== canvasElement &&
        !target.classList.contains('editable-component')
      ) {
        target = target.parentElement;
      }

      if (!target) return;

      const componentId =
        target === canvasElement ? canvasElement.id : target.id;

      if (componentId) {
        import('../../sidebar/CustomizationSidebar').then(
          ({ CustomizationSidebar }) => {
            CustomizationSidebar.showSidebar(componentId);
          }
        );
      }
    });
  }
}

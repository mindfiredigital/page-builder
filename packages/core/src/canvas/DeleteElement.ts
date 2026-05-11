import { CanvasSharedState } from './CanvasCore/CanvasSharedState';
import { CanvasEventDispatcher } from './CanvasCore/CanvasEventDispatcher';

export class DeleteElementHandler {
  private selectedElement: HTMLElement | null = null;

  constructor() {
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  private deleteSelectedElement(): void {
    if (!this.selectedElement) return;

    const element = this.selectedElement;
    this.selectedElement = null;

    CanvasSharedState.historyManager?.captureState();
    element.remove();
    CanvasSharedState.components = CanvasSharedState.components.filter(
      c => c !== element
    );
    CanvasSharedState.historyManager?.captureState();
    CanvasEventDispatcher.dispatchDesignChange();

    /* Reset sidebar to canvas settings after keyboard delete */
    import('../sidebar/CustomizationSidebar').then(
      ({ CustomizationSidebar }) => {
        CustomizationSidebar.showSidebar(CanvasSharedState.canvasElement.id);
      }
    );
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Delete') {
      this.deleteSelectedElement();
    }
  }

  public selectElement(element: HTMLElement): void {
    if (this.selectedElement) {
      this.selectedElement.classList.remove('selected');
    }
    this.selectedElement = element;
    this.selectedElement.classList.add('selected');
  }
}

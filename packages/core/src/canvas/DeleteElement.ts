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

  /**
   * Selects the nearest ancestor container of the currently selected element
   * and shows its sidebar.  Allows the user to "bubble up" through nested
   * containers by pressing Escape repeatedly.
   */
  private selectParentContainer(): void {
    if (!this.selectedElement) return;

    const parent = this.selectedElement.parentElement?.closest(
      '.container-component'
    ) as HTMLElement | null;

    if (!parent) return;

    this.selectElement(parent);

    import('../sidebar/CustomizationSidebar').then(
      ({ CustomizationSidebar }) => {
        CustomizationSidebar.showSidebar(parent.id);
      }
    );
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Delete') {
      this.deleteSelectedElement();
    } else if (event.key === 'Escape') {
      this.selectParentContainer();
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

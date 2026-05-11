import { CanvasSharedState } from './CanvasCore/CanvasSharedState.js';
import { CanvasEventDispatcher } from './CanvasCore/CanvasEventDispatcher.js';
export class DeleteElementHandler {
  constructor() {
    this.selectedElement = null;
    document.addEventListener('keydown', this.handleKeydown.bind(this));
  }
  deleteSelectedElement() {
    var _a, _b;
    if (!this.selectedElement) return;
    const element = this.selectedElement;
    this.selectedElement = null;
    (_a = CanvasSharedState.historyManager) === null || _a === void 0
      ? void 0
      : _a.captureState();
    element.remove();
    CanvasSharedState.components = CanvasSharedState.components.filter(
      c => c !== element
    );
    (_b = CanvasSharedState.historyManager) === null || _b === void 0
      ? void 0
      : _b.captureState();
    CanvasEventDispatcher.dispatchDesignChange();
    /* Reset sidebar to canvas settings after keyboard delete */
    import('../sidebar/CustomizationSidebar').then(
      ({ CustomizationSidebar }) => {
        CustomizationSidebar.showSidebar(CanvasSharedState.canvasElement.id);
      }
    );
  }
  handleKeydown(event) {
    if (event.key === 'Delete') {
      this.deleteSelectedElement();
    }
  }
  selectElement(element) {
    if (this.selectedElement) {
      this.selectedElement.classList.remove('selected');
    }
    this.selectedElement = element;
    this.selectedElement.classList.add('selected');
  }
}

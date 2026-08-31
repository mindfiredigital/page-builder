import { CanvasSharedState } from './CanvasCore/CanvasSharedState.js';
import { CanvasEventDispatcher } from './CanvasCore/CanvasEventDispatcher.js';
export class DeleteElementHandler {
    constructor() {
        this.selectedElement = null;
        document.addEventListener('keydown', this.handleKeydown.bind(this));
    }
    deleteSelectedElement() {
        var _a, _b;
        if (!this.selectedElement)
            return;
        const element = this.selectedElement;
        this.selectedElement = null;
        (_a = CanvasSharedState.historyManager) === null || _a === void 0 ? void 0 : _a.captureState();
        element.remove();
        CanvasSharedState.components = CanvasSharedState.components.filter(c => c !== element);
        (_b = CanvasSharedState.historyManager) === null || _b === void 0 ? void 0 : _b.captureState();
        CanvasEventDispatcher.dispatchDesignChange();
        /* Reset sidebar to canvas settings after keyboard delete */
        import('../sidebar/CustomizationSidebar').then(({ CustomizationSidebar }) => {
            CustomizationSidebar.showSidebar(CanvasSharedState.canvasElement.id);
        });
    }
    /**
     * Selects the nearest ancestor container of the currently selected element
     * and shows its sidebar.  Allows the user to "bubble up" through nested
     * containers by pressing Escape repeatedly.
     */
    selectParentContainer() {
        var _a;
        if (!this.selectedElement)
            return;
        const parent = (_a = this.selectedElement.parentElement) === null || _a === void 0 ? void 0 : _a.closest('.container-component');
        if (!parent)
            return;
        this.selectElement(parent);
        import('../sidebar/CustomizationSidebar').then(({ CustomizationSidebar }) => {
            CustomizationSidebar.showSidebar(parent.id);
        });
    }
    handleKeydown(event) {
        if (event.key === 'Delete') {
            this.deleteSelectedElement();
        }
        else if (event.key === 'Escape') {
            this.selectParentContainer();
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

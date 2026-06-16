export declare class DeleteElementHandler {
    private selectedElement;
    constructor();
    private deleteSelectedElement;
    /**
     * Selects the nearest ancestor container of the currently selected element
     * and shows its sidebar.  Allows the user to "bubble up" through nested
     * containers by pressing Escape repeatedly.
     */
    private selectParentContainer;
    private handleKeydown;
    selectElement(element: HTMLElement): void;
}

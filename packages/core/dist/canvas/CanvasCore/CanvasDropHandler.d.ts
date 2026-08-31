/** Handles the DragEvent fired when a new component is dropped onto the canvas */
export declare class CanvasDropHandler {
    static onDrop(event: DragEvent): void;
    /**
     * Moves a component to the position indicated by the cursor.
     * Works for both top-level canvas components AND components nested inside
     * containers — always reorders within whatever parent the component belongs to.
     */
    private static handleReorder;
}

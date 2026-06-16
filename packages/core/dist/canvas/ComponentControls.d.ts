export declare class ComponentControlsManager {
    private icons;
    constructor(_canvas?: unknown);
    /**
     * Adds a controls div (with drag handle in grid mode, delete button) to the component.
     *
     * Image containers: we use appendChild (not prepend) and skip adding
     * `position: relative` — both of which were the original fix that kept
     * images rendering at their natural size. The delete bug was unrelated to
     * this; it was caused by searching for `.delete-icon` on `element` instead
     * of inside `controlsDiv` (fixed in createDeleteIcon below).
     */
    addControlButtons(element: HTMLElement): void;
    /**
     * Creates a drag handle that sets 'dragged-component-id' on the data
     * transfer so the canvas drop handler knows to reorder rather than create.
     */
    private createDragHandle;
    /**
     * Creates (or reuses) the delete icon inside `controlsDiv`.
     *
     * Bug fix vs. the original "before" version: we now search inside
     * `controlsDiv` (not `element`) so we never accidentally grab an <img>
     * inside the component itself when looking for `.delete-icon`.
     */
    private createDeleteIcon;
    /**
     * Deletes the component, updates shared state, and captures undo history.
     * Reads historyManager at call-time to avoid circular-import issues.
     */
    private handleDelete;
}

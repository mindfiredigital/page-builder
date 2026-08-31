/**
 * A reusable modal component for displaying and managing configuration settings.
 *
 * This class creates a generic modal with a form that is dynamically populated
 * based on the provided configuration. It handles showing, hiding, and
 * capturing user input with expandable field display.
 */
export declare class ModalComponent {
    private modalElement;
    private contentContainer;
    private attributes;
    /** Stores the resolve function of the currently open promise */
    private resolvePromise;
    constructor();
    /**
     * Shows the modal and populates it with the given configuration.
     * Returns a Promise that resolves with the new values when saved,
     * or null if the modal is closed without saving.
     */
    show(attributes: ComponentAttribute[]): Promise<ModalResult | null>;
    /** Hides the modal overlay */
    hide(): void;
}

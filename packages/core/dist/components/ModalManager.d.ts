/**
 * A reusable modal component for displaying and managing configuration settings.
 *
 * This class creates a generic modal with a form that is dynamically populated
 * based on the provided configuration. It handles showing, hiding, and
 * capturing user input.
 */
export declare class ModalComponent {
  private modalElement;
  private contentContainer;
  private resolvePromise;
  private attributes;
  constructor();
  /**
   * Adds CSS styles to the document head if not already present
   */
  private addStyles;
  /**
   * Creates the base HTML structure for the modal using regular CSS classes.
   * @returns The modal HTMLElement.
   */
  createModalElement(): HTMLElement;
  /**
   * Dynamically generates and renders the form inputs for the modal.
   * @param attributes An array of ComponentAttribute to define the form.
   */
  private renderForm;
  /**
   * Shows the modal and populates it with the given configuration.
   * Returns a Promise that resolves with the new values when the form is saved,
   * or null if the modal is closed.
   * @param attributes An array of ComponentAttribute to define the form.
   * @returns A Promise resolving to the new form values or null.
   */
  show(attributes: ComponentAttribute[]): Promise<Record<string, any> | null>;
  /**
   * Hides the modal.
   */
  hide(): void;
  /**
   * Gathers data from the form inputs and resolves the promise.
   */
  private onSave;
  /**
   * Resets the promise to prevent memory leaks.
   */
  private resetPromise;
}
